const Router = require('express').Router
const router = new Router()

const manuals = require('./model/manuals/router')
const usabilityData = require('./model/usability-data/router')

router.route('/').get((req, res) => {
  res.json({ message: 'Welcome to iman API!' })
})

router.use('/manuals', manuals)
router.use('/usability-data', usabilityData)

module.exports = router
