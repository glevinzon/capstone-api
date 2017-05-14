'use strict';
const EquationOperation = use('App/Operations/EquationOperation')
const Tag = use('App/Model/Tag')
const Equation = use('App/Model/Equation')
const moment = use('moment')

class Broadcast {

  // This is required. This is the schedule for which the task will run.
  // More docs here: https://github.com/node-schedule/node-schedule#cron-style-scheduling
  static get schedule() {
    // once every minute
    return '0 0 10 1/1 * ? *'
  }

  // This is the function that is called at the defined schedule
  * handle() {
    let eqOp = new EquationOperation

    let tags = yield Tag.query().count('id as tags')
    let equations = yield Equation.query().count('id as equations')
    let title = 'Daily Report'
    let text = `${equations[0].equations} Equations | ${tags[0].tags} Tags as of ${moment().format()} .`

    yield eqOp.broadcastNotif({'title': title, 'text': text})

  }

}

module.exports = Broadcast;
