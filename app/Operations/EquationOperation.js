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
const EquationAppOperation = use('App/Operations/EquationAppOperation')
const TokenOperation = use('App/Operations/TokenOperation')
const S3Operation = use('App/Operations/S3Operation');

/**
 * Operations for Equation model
 *
 * @author glen
 * @class
 */
class EquationOperation extends Operation {

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

      yield this.codeToImage(equation.code)

      let title = 'Dataset Update'
      let text = 'The ' + equation.name + ' was added to the dataset.'

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

      return { 'equations':equations, 'tags': tags, 'records': records }
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getEquation () {
    try {
      let equations = new Equation()
      var result = []
      if (this.keyword) {
        if (this.by === 'equation') {
          equations = yield Equation.findBy('name', this.keyword)
          result = result.concat(equations)
        } else if (this.by === 'note') {
          equations = yield Equation.findBy('note', this.keyword)
          result = result.concat(equations)
        } else if (this.by === 'tag') {
          let tag = yield Tag.findBy('name', this.keyword)
          let records = yield Record
                      .query().where('tagId', tag.id)

          yield * foreach(records, search)

          function * search (record) {
            let equation = yield Equation.query().where('id', record.eqId)
            result = result.concat(equation)
          }
        }
        return result
      }
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

      let title = 'Dataset Deletion'
      let text = 'The ' + equation.name + ' was removed from the dataset.'

      yield this.broadcastNotif({'title': title, 'text': text})

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
        var record = yield AudioOperation.getAudioUrlFromFile(this.audio, directory, filename);
      }

      let equation = new Equation()
      if(this.id){
        equation = yield Equation.findBy('id', this.id)
        if(!equation){
          this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The equation does not exist')
          return false
        }
      }
      equation.audioUrl = 'https://s3-ap-southeast-1.amazonaws.com/glevinzon/uploads/' + record.filename
      yield equation.save()

      yield S3Operation.uploadAudioToS3Bucket(record.url, record.filename)

      return equation;
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message);

      return false;
    }
  }

  * broadcastNotif(message) {
    const broadcastOp = new EquationAppOperation()
    const tokenOp = new TokenOperation()
    let tokens = yield tokenOp.getList()
    let tokensArr = []
    _.toArray(tokens).map((token=> {
      tokensArr.push(token)
    }))

    yield * foreach(tokensArr, results)

      function * results (value) {
        yield broadcastOp.sendMessageToUser(value.device_token, message)
      }
  }
}

module.exports = EquationOperation
