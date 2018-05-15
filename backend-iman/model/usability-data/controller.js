const Controller = require('../../lib/controller')
const usabilityDataFacade = require('./facade')

class UsabilityDataController extends Controller {

    createOrUpdate(req, res, next) {

        if(!req.body.manual){
            res.status(500).json("Inproper request");
            return;
        };

        // Check if exist
        return this.facade.findOne({
            manual: req.body.manual._id,
            step: req.body.manual.currentStep,
            userId: req.body.userId
            }).then(data => {
            // Create if not exist
            if(data === null){
                return this.facade.createData(req.body)
                    .then(doc => {
                        res.status(201).json(doc)
                    });
            } // Update if exist
            else {
                return this.facade.updateData(req.body, data._id)
                    .then(doc => {
                        res.status(204).json(doc);
                    })
            }
            })
            .catch(err => {
                res.status(500).json(err);
                console.log(err);
            })
    }
}

module.exports = new UsabilityDataController(usabilityDataFacade)
