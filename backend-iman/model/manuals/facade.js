const Facade = require('../../lib/facade')
const manualsSchema = require('./schema')

class ManualsFacade extends Facade {}

module.exports = new ManualsFacade('manuals', manualsSchema)
