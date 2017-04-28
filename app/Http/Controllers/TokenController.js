'use strict'

const { HttpException } = use('node-exceptions')
const TokenOperation = use('App/Operations/TokenOperation')

/**
 * Controller for Token Endpoints
 * POST /token            - create
 * @author glen
 */
class TokenController {

  * store (request, response) {
    let tokenOp = new TokenOperation()
    let {
      token,
      prevToken
    } = request.post()

    tokenOp.device_token = token
    tokenOp.prev_token = prevToken

    let result = yield tokenOp.store()

    if (result === false) {
      let error = tokenOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }

    response.sendJson(result)
  }

}

module.exports = TokenController
