'use strict'

const { HttpException } = use('node-exceptions')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const Request = use('App/Model/Request')
const Token = use('App/Model/Token')
const Equation = use('App/Model/Equation')
const NotifyOperation = use('App/Operations/NotifyOperation')

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
    this.name = null
    this.device_token = null
    this.filter = null
    this.page = null
    this.count = null
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
      request.name = this.name
      request.token = this.device_token

      console.log(this.device_token)
      yield request.save()

      return true
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * getList () {
    try {
      let requests = new Request()

      if (this.filter === 'paginate') {
        requests = yield Request.query().where('active', 1).orderBy('created_at', 'desc').paginate(this.page, this.count)
      } else {
        requests = yield Request.all()
      }

      return requests
    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }

  * activateRecord () {
    try {
      var broadcastOp = new NotifyOperation()
      var request = new Request()
      var equation = new Equation()

      if (this.id) {
        request = yield Request.find(this.id)

        if (!request) {
          this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The request does not exist')
          return false
        }

        request.active = 0

        if(yield request.save()) {
          equation = yield Equation.find(request.eqId)

          if (!equation) {
            this.addError(HTTPResponse.STATUS_NOT_FOUND, 'The equation does not exist')
            return false
          }

          equation.active = 1

           if(yield equation.save()){
              let title = 'Request Accepted'
              let text = `Request from you(${request.code}) was added to the Dataset`

              broadcastOp.message = {'title': title, 'text': text}
              broadcastOp.token = request.token

              yield broadcastOp.sendMessageToUser()
           }
        }
      }

      this.filter = "paginate"
      this.page = 1
      this.count = 999

      return yield this.getList()

    } catch (e) {
      this.addError(HTTPResponse.STATUS_INTERNAL_SERVER_ERROR, e.message)
      return false
    }
  }
}

module.exports = RequestOperation
