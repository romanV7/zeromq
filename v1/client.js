var zmq = require('zeromq')
var subscriber = zmq.socket('sub')
var client = zmq.socket('req')
var inquirer = require('inquirer');

// const obj = {
//   type: 'login',
//   //email: 'foo@bar.baz',
//   email: 'user@gmail.com',
//   pwd: 'xxxz',
//   msg_id: 'yyy'
// }

const obj = {
  type: '',
  //email: 'foo@bar.baz',
  email: 'user@gmail.com',
  pwd: 'xxx',
  msg_id: ''
}

var buf = Buffer.from(JSON.stringify(obj));

subscriber.on('message', function(reply) {
  const response = JSON.parse(reply.toString())
  console.log('Received message: ', response);
  if (response.status === 'ok') {
    console.log('ok')
    process.exit(0);
  }
  if (response.status === 'error') {
    console.log(response.error)
  }

  var questions = [
    {
      type: 'input',
      name: 'email',
      message: "What's your email ?",
    },
    {
      type: 'input',
      name: 'password',
      message: "What's your password ?",
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const object = {
      type: 'login',
      email: answers.email,
      pwd: answers.password,
      msg_id: response.msg_id || 'yyy'
    }
    client.send(Buffer.from(JSON.stringify(object)))
  });

})

subscriber.connect('tcp://localhost:8688')
subscriber.subscribe('')

client.connect('tcp://localhost:8888')
client.send(buf)

process.on('SIGINT', function() {
  subscriber.close()
  client.close()
})
