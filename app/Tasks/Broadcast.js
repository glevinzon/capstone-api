'use strict';
const EquationAppOperation = use('App/Operations/EquationAppOperation')
const TokenOperation = use('App/Operations/TokenOperation')
const _ = use('lodash')
const foreach = require('generator-foreach')

class Broadcast {

  // This is required. This is the schedule for which the task will run.
  // More docs here: https://github.com/node-schedule/node-schedule#cron-style-scheduling
  static get schedule() {
    // once every minute
    return '*/1 * * * *';
  }

  // This is the function that is called at the defined schedule
  * handle() {
    const broadcastOp = new EquationAppOperation()
    const tokenOp = new TokenOperation()
    let tokens = yield tokenOp.getList()
    let tokensArr = []
    _.toArray(tokens).map((token=> {
      tokensArr.push(token)
    }))

    yield * foreach(tokensArr, results)

      function * results (value) {
        yield broadcastOp.sendMessageToUser(value.device_token, {message: 'Capstone Notification'})
      }

  }

}

module.exports = Broadcast;
