const zmq = require('zeromq')
const publisher = zmq.socket('pub')
const server = zmq.socket('rep')

const { isEmpty, parseJson } = require('./shared/util')
const Users = require('./services/user.service')

const WRONG_PWD = 'Wrong password'
const WRONG_FORMAT = 'Not all fiels are supplied or they are empty'
const KEYS_NUMBER = 4

server.on('message', request => {
  server.send('OK')
  const temp = JSON.parse(request.toString())
  console.log({ temp })
  if (Object.keys(temp).length !== KEYS_NUMBER || isEmpty(temp)) {
    return publisher.send(parseJson({ msg_id: temp.msg_id, status: 'error', error: WRONG_FORMAT }))
  }
  Users.findUserByEmail(temp.email, (err, user) => {
    console.log({ user })
    if (!user) {
      const result = parseJson({ error: "No such user try again" })
      return publisher.send(result)
    }

    const result = (temp.type === 'login' && user.passw === temp.pwd)
    ? parseJson({ msg_id: temp.msg_id, user_id: user.user_id, status: 'ok'})
    : (user.passw !== temp.pwd)
    ? parseJson({ msg_id: temp.msg_id, status: 'error', error: WRONG_PWD })
    : parseJson({ msg_id: temp.msg_id, status: 'error', error: WRONG_FORMAT })
    return publisher.send(result)
})
})

server.bind('tcp://*:8888', err => {
  if (err) console.log(err)
  else console.log('Listening on 8888...')
})

publisher.bind('tcp://*:8688', err => {
  if (err) console.log(err)
  else console.log('Listening on 8688...')
})

process.on('SIGINT', () => {
  publisher.close()
  server.close()
})
