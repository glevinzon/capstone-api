'use strict'

const { HttpException } = use('node-exceptions')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const Request = use('App/Model/Request')
/**
 * Operations for Token model
 *
 * @author glen
 * @class
 */
class RequestOperation extends Operation {

  constructor () {
    super()

    this.id = null
    this.eqId = null
    this.device_token = null
  }

  get rules () {
    return {
      device_token: 'required|max:255'
    }
  }

  * store () {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      let request = new Request()
      if (this.id) {
        request = yield Request.find(this.id)

        if (!request) {
          this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The request does not exist')
          return false
        }
      }
      request.eqId = this.eqId
      request.name = "Request to add equation to the dataset."
      request.device_token = this.device_token
      yield request.save()

      return request
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getList () {
    try {
      let requests = yield Request.all()

      return requests
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }
}

module.exports = RequestOperation
