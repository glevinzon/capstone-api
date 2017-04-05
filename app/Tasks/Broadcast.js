'use strict';
const EquationOperation = use('App/Operations/EquationOperation')

class Broadcast {

  // This is required. This is the schedule for which the task will run.
  // More docs here: https://github.com/node-schedule/node-schedule#cron-style-scheduling
  static get schedule() {
    // once every minute
    return '*/45 * * * *';
  }

  // This is the function that is called at the defined schedule
  * handle() {
    let eqOp = new EquationOperation

    let title = 'Quarterly Update'
    let text = 'This is a test.'

    yield eqOp.broadcastNotif({'title': title, 'text': text})

  }

}

module.exports = Broadcast;
