var zmq = require('zeromq')
var publisher = zmq.socket('pub')
var server = zmq.socket('rep')

const Users = require('../shared/util')

const isEmpty = object => Object.values(object).every(x => (x === null || x === ''))

const WRONG_PWD = 'Wrong password'
const WRONG_FORMAT = 'Not all fiels are supplied or they are empty'
const KEYS_NUMBER = 4

server.on('message', function(request) {
    server.send('OK')
    const temp = JSON.parse(request.toString())
    console.log({ temp })
    if (Object.keys(temp).length !== KEYS_NUMBER || isEmpty(temp)) {
      return publisher.send(Buffer.from(JSON.stringify({ msg_id: temp.msg_id, status: 'error', error: WRONG_FORMAT })))
    }
    Users.findUserByEmail(temp.email, (err, user) => {
      console.log({ user })
      if (!user) {
        const result = Buffer.from(JSON.stringify({ error: "No such user try again" }))
        return publisher.send(result)
      }

      const result = (temp.type === 'login' && user.passw === temp.pwd)
      ? Buffer.from(JSON.stringify({ msg_id: temp.msg_id, user_id: user.user_id, status: 'ok'}))
      : (user.passw !== temp.pwd)
      ? Buffer.from(JSON.stringify({ msg_id: temp.msg_id, status: 'error', error: WRONG_PWD }))
      : Buffer.from(JSON.stringify({ msg_id: temp.msg_id, status: 'error', error: WRONG_FORMAT }))
      return publisher.send(result)
  })
})

server.bind('tcp://*:8888', function(err) {
  if(err)
    console.log(err)
  else
    console.log('Listening on 8888...')
})

publisher.bind('tcp://*:8688', function(err) {
  if(err)
    console.log(err)
  else
    console.log('Listening on 8688...')
})

process.on('SIGINT', function() {
  publisher.close()
  server.close()
})
