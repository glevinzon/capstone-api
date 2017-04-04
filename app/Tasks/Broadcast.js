'use strict';
var FCM = require('fcm-node');

class Broadcast {

  static get schedule() {
    return '*/1 * * * *';
  }

  * handle() {
    var serverKey = 'AAAA97QjpFE:APA91bFjditA2VHzGPi2Ox25VX9Hq8UkHz58eSpcAJWC1ANyubZZMB-VZoYVi5gqmg_MOMStPdI0rS2Lwezan1F_zLq5kcYA8wIQ6wC9yzJOLk3sXuWW_HBHuHTbKwgdCiuciaEOX5_i'; //put your server key here
    var fcm = new FCM(serverKey);

    var data='';
    var message="Hey! you got this notification.";
    var title="Capstone Notification";
    var token="com.itp.glevinzon.capstone>"

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,

        notification: {
            title: title,
            body: message,
            sound: "default",
            icon: "ic_launcher" //default notification icon
        },

        data: data
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });

  }

}

module.exports = Broadcast;
