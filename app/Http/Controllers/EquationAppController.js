'use strict'

const { HttpException } = use('node-exceptions')
const EquationOperation = use('App/Operations/EquationAppOperation')
const RequestOperation = use('App/Operations/RequestOperation')

/**
 * Controller for Equation Endpoints
 * POST /equations            - create
 * @author glen
 */
class EquationAppController {

  * store (request, response) {
    let equationOp = new EquationOperation()
    const fileUploaded = request.file('file', {
      maxSize: '10mb',
      allowedExtensions: ['m4a', '3gp', 'mp4', 'mp3', 'wav', 'mkv', 'ogg']
    });

    let {
      id,
      username,
      name,
      note,
      tags,
    } = request.post()

    let eqId = request.param('eqId')

    tags = JSON.parse(tags)

    console.log(tags)

    equationOp.id = eqId || id
    equationOp.username = username
    equationOp.name = name
    equationOp.note = note
    equationOp.tags = tags
    equationOp.audio = fileUploaded;

    let equation = yield equationOp.store()

    if (equation === false) {
      let error = equationOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }

    response.sendJson(equation)
  }

  * activate (request, response) {
    let requestOp = new RequestOperation()
    let { id, token } = request.all()

    requestOp.id = id

    let equations = yield requestOp.activateRecord()

    if (equations === false) {
      let error = requestOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }

    response.sendJson(equations)
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

  * listRequests (request, response) {
    let requestOp = new RequestOperation()
    let { filter, page, count } = request.all()

    requestOp.filter = filter
    requestOp.page = page
    requestOp.count = count

    let requests = yield requestOp.getList()

    response.sendJson(requests)
  }

  * show (request, response) {
    let equationOp = new EquationOperation()
    let { keyword, page, count } = request.all()

    equationOp.keyword = keyword
    equationOp.page = page
    equationOp.count = count

    let equations = yield equationOp.getEquation()
    if (equations === false) {
      let error = equationOp.getFirstError()

      throw new HttpException(error.message, error.code)
    }
    response.sendJson(equations)
  }

  * related (request, response) {
    let equationOp = new EquationOperation()
    let { eqId, page, count } = request.all()

    equationOp.id = eqId
    equationOp.page = page
    equationOp.count = count

    let equations = yield equationOp.getRelated()
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
    const fileUploaded = request.file('file', {
      maxSize: '10mb',
      allowedExtensions: ['m4a', '3gp', 'mp4', 'mp3', 'wav', 'mkv', 'ogg']
    });

    let { id, eqId, deviceId } = request.all()

    equationOp.id = id
    equationOp.eqId = eqId
    equationOp.audio = fileUploaded;
    equationOp.deviceId = deviceId

    console.log(fileUploaded, deviceId)

    let pref = yield equationOp.uploadAudio();

    if (pref === false) {
      let error = equationOp.getFirstError();

      throw new HttpException(error.message, error.code);
    }

    response.sendJson(pref);
  }

  * listTags (request, response){
    let equationOp = new EquationOperation()

    let tags = yield equationOp.getTagList()

    response.sendJson({tags: tags})
  }
}

module.exports = EquationAppController
