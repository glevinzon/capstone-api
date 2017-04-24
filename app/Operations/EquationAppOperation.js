'use strict'

const { HttpException } = use('node-exceptions')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const User = use('App/Model/User')
const Tag = use('App/Model/Tag')
const Record = use('App/Model/Record')
const Equation = use('App/Model/Equation')
const _ = use('lodash')
const foreach = require('generator-foreach')
const moment = use('moment')
const Env = use('Env');

const Audio = use('App/Model/Audio');
const AudioOperation = use('App/Operations/AudioOperation');

var request = require('request')

const Database = use('Database')

/**
 * Operations for Equation model
 *
 * @author glen
 * @class
 */
class EquationAppOperation extends Operation {

  constructor () {
    super()

    this.id = null
    this.code = null
    this.username = null
    this.name = null
    this.note = null
    this.audioUrl = null
    this.tags = []
    this.active = null
    this.filter = null
    this.page = null
    this.count = null
    this.by = null
    this.keyword = null
    this.audio = null
  }

  get rules () {
    return {
      name: 'required|max:255',
      note: 'max:255'
    }
  }

  * store () {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      let equation = new Equation()
      let user = yield User.findOrCreate(
                        { username: this.username },
                        { username: this.username, role: 'user' })

      if (this.id) {
        equation = yield Equation.find(this.id)

        if (!equation) {
          this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The equation does not exist')
          return false
        }
      }

      equation.userId = user.id
      equation.name = this.name
      equation.note = this.note
      equation.audioUrl = this.audioUrl
      equation.active = this.active

      yield equation.save()

      let keywords = this.tags

      yield * foreach(keywords, records)

      function * records (value) {
        let tag = yield Tag.findOrCreate(
                      { name: value },
                      { name: value })
        let record = new Record()

        record.eqId = equation.id
        record.tagId = tag.id

        yield record.save()
      }

      return equation
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getList () {
    try {
      let equations = new Equation()

      if (this.filter === 'paginate') {
        equations = yield Equation.query().orderBy('created_at', 'desc').paginate(this.page, this.count)
      } else {
        equations = yield Equation.all()
      }

      let tags = yield Tag.all()
      let records = yield Record.all()

      return equations
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getEquation () {
    try {
      let equations = new Equation()
        equations = yield Database
                      .table('equations')
                      // .distinct('equations.*')
                      .innerJoin('records', 'equations.id', 'records.eqId')
                      .innerJoin('tags', 'tags.id', 'records.tagId')
                      .whereRaw('tags.name LIKE ?', '%' + this.keyword + '%')
                      .paginate(this.page, this.count)
        // equations = yield Database
        //               .raw(`select DISTINCT equations.* from equations join records on equations.id = records.eqId join tags on tags.id = records.tagId where tags.name LIKE '%${this.keyword}%' group by equations.id`)
      return equations
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getRelated () {
    try {
      let tags = new Tag()
        tags = yield Database
                      .table('tags')
                      .innerJoin('records', 'tags.id', 'records.tagId')
                      .whereRaw('records.eqId = ?', this.id)

      var rawQuery = ''

      tags.map((tag, i)=>{
        if(i < tags.length - 1){
          rawQuery = rawQuery.concat("tags.name LIKE '%"+tag.name + "%' OR ")
        } else {
          rawQuery = rawQuery.concat("tags.name LIKE '%"+tag.name + "%'")
        }
      })

        let equations = new Equation()
          equations = yield Database
                        .table('equations')
                        // .select('equations.*')
                        // .groupBy('records.id')
                        // .distinct('equations.*')
                        .innerJoin('records', 'equations.id', 'records.eqId')
                        .innerJoin('tags', 'tags.id', 'records.tagId')
                        .whereRaw(rawQuery)
                        .paginate(this.page, this.count)

      console.log(equations)
      return equations
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * destroy () {
    try {
      let equation = yield Equation.find(this.id)
      let record = yield Record.findBy('eqId', this.id)
      if (!equation) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The equation does not exist')
        return false
      }

      yield equation.delete()
      yield record.delete()

      return true
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * uploadAudio() {
    if (!this.audio) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, 'No audio selected');

      return false;
    }

    const directory = Audio.getAudioDirectory();
    const filename = `ID${this.id}_${moment().format("YYYYMMDD-HHmmss")}`;

    try {
      if (!this.audioUrl) {
        this.audioUrl = yield AudioOperation.getAudioUrlFromFile(this.audio, directory, filename);
      }

      let equation = new Equation()
      if(this.id){
        equation = yield Equation.findBy('id', this.id)
        if(!equation){
          this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The equation does not exist')
          return false
        }
      }
      equation.audioUrl = Env.get('API_HOST') + this.audioUrl
      yield equation.save()

      return equation;
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message);

      return false;
    }
  }

  * sendMessageToUser(deviceId, message) {
    request({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'key=AAAA97QjpFE:APA91bFjditA2VHzGPi2Ox25VX9Hq8UkHz58eSpcAJWC1ANyubZZMB-VZoYVi5gqmg_MOMStPdI0rS2Lwezan1F_zLq5kcYA8wIQ6wC9yzJOLk3sXuWW_HBHuHTbKwgdCiuciaEOX5_i'
      },
      body: JSON.stringify(
        {
        "notification": {
          "title": message.title,
          "text": message.text
        },
        "data": {
            "message": 'Notification Service'
          },
        "to" : deviceId
        }
      )
    }, function(error, response, body) {
      if (error) {
        console.error(error, response, body);
      }
      else if (response.statusCode >= 400) {
        console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
      }
      else {
        console.log('Done!')
      }
    })
  }
}

module.exports = EquationAppOperation
