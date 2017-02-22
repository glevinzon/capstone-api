'use strict'

const { HttpException } = use('node-exceptions')
const EquationOperation = use('App/Operations/EquationOperation')

/**
 * Controller for Equation Endpoints
 * POST /equations            - create
 * @author glen
 */
class EquationController {

  * store (request, response) {
    let equationOp = new EquationOperation()

    let {
      username,
      name,
      note,
      audioUrl,
      active
    } = request.post()

    let eqId = request.param('eqId')

    equationOp.id = eqId
    equationOp.username = username
    equationOp.name = name
    equationOp.note = note
    equationOp.audioUrl = audioUrl
    equationOp.active = active

    let equation = yield equationOp.store()

    if (equation === false) {
      let error = equationOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }

    response.sendJson(equation)
  }

  * list (request, response) {
    let equationOp = new EquationOperation()
    let equation = yield equationOp.getList()

    response.sendJson(equation)
  }

//   * show (request, response) {
//     let equationOp = new EquationOperation()
//     let equationId = request.param('equationId')

//     equationOp.id = equationId

//     let equation = yield equationOp.getequation()

//     if (equation === false) {
//       let error = equationOp.getFirstError()

//       throw new HttpException(error.message, error.code)
//     }
//     response.sendJson(equation)
//   }

//   * destroy (request, response) {
//     let equationOp = new EquationOperation()
//     let equationId = request.param('equationId')

//     equationOp.id = equationId

//     let equation = yield equationOp.destroy()

//     if (equation === false) {
//       let error = equationOp.getFirstError()

//       throw new HttpException(error.message, error.code)
//     }
//     response.send()
//   }
}

module.exports = EquationController
