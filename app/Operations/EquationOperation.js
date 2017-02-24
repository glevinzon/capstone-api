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

      yield * foreach(['glevinzon', 'dapal', 'glen'], records)

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

      return equations
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  // * getShop () {
  //   try {
  //     let shop = new Shop()
  //     let id = this.id

  //     if (id) {
  //       shop = yield Shop.find(id)
  //       yield shop.related('properties').load()
  //       yield shop.related('branches').load()

  //       yield this.increaseShopViews(id)

  //       if (!shop) {
  //         this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The shop does not exist')
  //         return false
  //       }
  //     }

  //     return shop
  //   } catch (e) {
  //     this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
  //     return false
  //   }
  // }

  // * destroy () {
  //   try {
  //     let shop = yield Shop.find(this.id)

  //     if (!shop) {
  //       this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The shop does not exist')
  //       return false
  //     }

  //     yield shop.delete()

  //     return true
  //   } catch (e) {
  //     this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
  //     return false
  //   }
}

module.exports = EquationOperation
