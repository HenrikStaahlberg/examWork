const Controller = require('../../lib/controller')
const manualsFacade = require('./facade')

class ManualsController extends Controller {}

module.exports = new ManualsController(manualsFacade)
