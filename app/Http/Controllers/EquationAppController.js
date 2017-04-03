'use strict'

const { HttpException } = use('node-exceptions')
const EquationOperation = use('App/Operations/EquationAppOperation')

/**
 * Controller for Equation Endpoints
 * POST /equations            - create
 * @author glen
 */
class EquationAppController {

  * store (request, response) {
    let equationOp = new EquationOperation()
    let {
      id,
      username,
      name,
      note,
      audioUrl,
      active,
      currentValues
    } = request.post()

    let eqId = request.param('eqId')

    equationOp.id = eqId || id
    equationOp.username = username
    equationOp.name = name
    equationOp.note = note
    equationOp.audioUrl = audioUrl
    equationOp.tags = currentValues
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
    let { filter, page, count } = request.all()

    equationOp.filter = filter
    equationOp.page = page
    equationOp.count = count

    let equation = yield equationOp.getList()

    response.sendJson(equation)
  }

  * show (request, response) {
    let equationOp = new EquationOperation()
    let { by, keyword } = request.all()

    equationOp.by = by
    equationOp.keyword = keyword

    let equations = yield equationOp.getEquation()
    if (equations === false) {
      let error = equationOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }
    response.sendJson(equations)
  }

  * destroy (request, response) {
    let equationOp = new EquationOperation()
    let eqId = request.param('eqId')

    equationOp.id = eqId

    let equation = yield equationOp.destroy()

    if (equation === false) {
      let error = equationOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }
    response.sendJson()
  }

  * uploadFile (request, response) {
    const equationOp = new EquationOperation();
    const fileUploaded = request.file('audio', {
      maxSize: '3mb',
      allowedExtensions: ['m4a', '3gp', 'mp4', 'mp3', 'wav', 'mkv', 'ogg']
    });

    equationOp.id = request.param('eqId');
    equationOp.audio = fileUploaded;

    let equations = yield equationOp.uploadAudio();

    if (equations === false) {
      let error = equationOp.getFirstError();

      throw new HttpException(error.message, error.code);
    }

    response.sendJson(equations);
  }
}

module.exports = EquationAppController
