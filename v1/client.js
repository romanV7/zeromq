var zmq = require('zeromq')
var subscriber = zmq.socket('sub')
var client = zmq.socket('req')

const obj = {
  type: 'login',
  //email: 'foo@bar.baz',
  email: 'user@gmail.com',
  pwd: 'xxxz',
  msg_id: 'yyy'
}

var buf = Buffer.from(JSON.stringify(obj));

subscriber.on('message', function(reply) {
  //console.log({ reply })
  const response = JSON.parse(reply.toString())
  console.log('Received message: ', response);
})

subscriber.connect('tcp://localhost:8688')
subscriber.subscribe('')

client.connect('tcp://localhost:8888')
client.send(buf)

process.on('SIGINT', function() {
  subscriber.close()
  client.close()
})
