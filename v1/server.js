var zmq = require('zeromq')
var publisher = zmq.socket('pub')
var server = zmq.socket('rep')
var pending = 0

var sqlite = require('sqlite3')
let db = new sqlite.Database('../sample.db', (err) => {
  if (err) console.log('error occured')
  console.log('connected successfuly')
});

db.all('select * from Users', (err, results) => {
  console.log({ results })
})

const user = {
  id: 1,
  email: 'foo@bar.baz',
  pssw: 'xxx',
}

const success = {
  msg_id: 'yyy',
  user_id: 'N', // user id from database
  status: 'ok'
}

const failure = {
  msg_id: 'yyy',
  status: 'error',
  error: 'xxx'
}



server.on('message', function(request) {
    //console.log({ request })
    pending++
    server.send('OK')
    const temp = JSON.parse(request.toString())
    console.log({ temp })
    console.log({ user })
//  ----------------varient 2 -------------
/*
    const result = (temp.type === 'login' && user.pssw === temp.pwd) ? Buffer.from(JSON.stringify(success)) : Buffer.from(JSON.stringify(failure))
    publisher.send(result)
*/
// -----------veriant 1 -------------

    if (temp.type === 'login') {
      if (user.pssw === temp.pwd) {
        console.log('client is lucky today ---> success')
        return publisher.send(Buffer.from(JSON.stringify(success)))
      } else {
        console.log('not client"s dat today ---> failure')
        publisher.send(Buffer.from(JSON.stringify(failure)))
      }
    }
    publisher.send(Buffer.from(JSON.stringify(failure)))
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
