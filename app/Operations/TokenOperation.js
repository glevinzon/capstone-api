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

    this.id = null
    this.code = null
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
      let token = new Token()
      if (this.id) {
        token = yield Token.find(this.id)

        if (!token) {
          this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The token does not exist')
          return false
        }
      }

      token.device_token = this.device_token
      yield token.save()

      return token
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }
}

module.exports = TokenOperation
