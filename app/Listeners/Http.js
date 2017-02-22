'use strict'

const Env = use('Env')
const Youch = use('youch')
const Http = exports = module.exports = {}
const Response = use('Response')

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  const status = error.status || 500

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const youch = new Youch(error, request.request)
    const type = request.accepts('json', 'html')
    const formatMethod = type === 'json' ? 'toJSON' : 'toHTML'
    const formattedErrors = yield youch[formatMethod]()
    response.status(status).send(formattedErrors)
    return
  }

  /**
   * PRODUCTION REPORTER
   */
  console.error(error.stack)

  let jsonResponse = {
    code: status,
    message: error.message
  }

  yield response.status(status).json({ error: { jsonResponse } })
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  Response.macro('sendJson', function (data) {
    this.json({ data })
  })
}
