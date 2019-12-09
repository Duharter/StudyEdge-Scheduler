var { DateTime } = require('luxon')

nodemailer = require('nodemailer'),
mongoose = require('mongoose'),
config = require('../config/config.js');

mongoose.connect(config.db.uri, { useNewUrlParser: true });

var express = require('express');
var eRoute = express.Router();

let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'studyedgescheduler@gmail.com',
    pass: config.EmailPass
  }
});


eRoute.post('/', (req, res, next) => {
  var email = req.body.email;
  var session = req.body.session;
  var note = req.body.note
  var txt = `Hello Study Edge member!\n\nYour Study Expert sent you a notification about your Study Edge reservation that is coming up on ${DateTime.fromISO(session.date).toFormat('ff')} for ${session.class}.\n\nNotification: ${note}`

  const message = {
    from: 'studyedgescheduler@gmail.com',
    to: email,
    subject: 'Upcoming Study Session Notification', // Subject line
    //text: 'Your Study expert sent your a reminder about your Study Edge reservation that is coming up' // Plain text body
    text: txt
  };

  transport.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log('Email sent' + info);
      res.status(200);
    }
  });

});

module.exports = eRoute;