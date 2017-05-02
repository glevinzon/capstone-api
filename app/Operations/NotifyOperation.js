'use strict'

const { HttpException } = use('node-exceptions')
const HTTPResponse = use('App/HTTPResponse')
const Operation = use('App/Operations/Operation')
const Token = use('App/Model/Token')
var request = require('request')

/**
 * Operations for Token model
 *
 * @author glen
 * @class
 */
class TokenOperation extends Operation {

  constructor () {
    super()

    this.message = null
    this.token = null
  }

  get rules () {
    return {
      message: 'required|max:255',
      token: 'required|max:255',
    }
  }

  * sendMessageToUser() {
    console.log(this.message.text, this.message.title)
    request({
      url: 'https://fcm.googleapis.com/fcm/send',
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': 'key=AAAA97QjpFE:APA91bFjditA2VHzGPi2Ox25VX9Hq8UkHz58eSpcAJWC1ANyubZZMB-VZoYVi5gqmg_MOMStPdI0rS2Lwezan1F_zLq5kcYA8wIQ6wC9yzJOLk3sXuWW_HBHuHTbKwgdCiuciaEOX5_i'
      },
      body: JSON.stringify(
        {
        "notification": {
          "title": this.message.title,
          "text": this.message.text
        },
        "data": {
            "message": 'Notification Service'
          },
        "to" : this.token
        }
      )
    }, function(error, response, body) {
      if (error) {
        console.error(error, response, body);
      }
      else if (response.statusCode >= 400) {
        console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body);
      }
      else {
        console.log('Done!')
      }
    })
  }
}

module.exports = TokenOperation
