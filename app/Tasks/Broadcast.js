'use strict';
const EquationOperation = use('App/Operations/EquationOperation')
const Tag = use('App/Model/Tag')
const Record = use('App/Model/Record')
const moment = use('moment')

class Broadcast {

  // This is required. This is the schedule for which the task will run.
  // More docs here: https://github.com/node-schedule/node-schedule#cron-style-scheduling
  static get schedule() {
    // once every minute
    return '9 * * *';
  }

  // This is the function that is called at the defined schedule
  * handle() {
    let eqOp = new EquationOperation

    let tags = yield Tag.query().count('id as tags')
    let records = yield Record.query().count('id as records')
    let title = 'Daily Report'
    let text = `${records[0].records} Records | ${tags[0].tags} Tags as of ${moment().format()} .`

    yield eqOp.broadcastNotif({'title': title, 'text': text})

  }

}

module.exports = Broadcast;
