const zmq = require('zeromq')
const subscriber = zmq.socket('sub')
const client = zmq.socket('req')
const inquirer = require('inquirer')

const questions = require('../questions')
const { parseJson } = require('./shared/util')

// example input
const obj = {
  type: 'login',
  email: 'user@gmail.com',
  pwd: 'xxxz',
  msg_id: 'yyy'
}

const buf = parseJson(obj)

subscriber.on('message', reply => {
  const response = JSON.parse(reply.toString())
  console.log('Received message: ', response)
  if (response.status === 'ok') {
    console.log('ok')
    process.exit(0)
  }
  if (response.status === 'error') {
    console.log(response.error)
  }

  inquirer.prompt(questions).then((answers) => {
    const object = {
      type: 'login',
      email: answers.email,
      pwd: answers.password,
      msg_id: response.msg_id || 'yyy'
    }
    client.send(parseJson(object))
  })

})

subscriber.connect('tcp://localhost:8688')
subscriber.subscribe('')

client.connect('tcp://localhost:8888')
client.send(buf)

process.on('SIGINT', () => {
  subscriber.close()
  client.close()
})
