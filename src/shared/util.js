
const isEmpty = object => Object.values(object).every(x => (x === null || x === ''))
const parseJson = object => Buffer.from(JSON.stringify(object))

module.exports = { isEmpty, parseJson }
