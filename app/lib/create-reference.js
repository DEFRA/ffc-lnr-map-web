const { v4: uuid } = require('uuid')

module.exports = () => {
  const appRef = uuid().split('-').shift().toLocaleUpperCase('en-GB').match(/.{1,4}/g).join('-')
  return `LNR-${appRef}`
}
