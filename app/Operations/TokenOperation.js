'use strict'

const { HttpException } = use('node-exceptions')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const Token = use('App/Model/Token')
/**
 * Operations for Token model
 *
 * @author glen
 * @class
 */
class TokenOperation extends Operation {

  constructor () {
    super()

    this.device_token = null
    this.prev_token = null
  }

  get rules () {
    return {
      device_token: 'required|max:255',
      prev_token: 'required|max:255',
    }
  }

  * store () {
    let isValid = yield this.validate()

    if (!isValid) {
      return false
    }

    try {
      let token = new Token()
      token = yield Token.findOrCreate(
                  { device_token: this.prev_token },
                  { device_token: this.device_token })

      if (!token) {
        this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The token does not exist')
        return false
      }

      return token
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getList () {
    try {
      let tokens = yield Token.all()

      return tokens
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }
}

module.exports = TokenOperation
