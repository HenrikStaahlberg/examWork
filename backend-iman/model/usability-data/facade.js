const Facade = require('../../lib/facade')
const usabilityDataSchema = require('./schema')

class UsabilityDataFacade extends Facade {
    createData(body){
        const data = new this.Model({
            userId: body.userId,
            manual: body.manual._id,
            step: body.manual.currentStep,
          
            startTime: body.startTime,
            finishTime: body.finishTime,
          
            acceptableClicks: body.acceptableClicks,
            faults: body.faults,
          
            answeredQuestions: body.answeredQuestions
        });

        return data.save();
    }

    updateData(body, id){
        let answeredQuestions = body.questions ? body.questions : [];
        
        const data = {
            userId: body.userId,
            manual: body.manual._id,
            step: body.manual.currentStep,
          
            startTime: body.startTime,
            finishTime: body.finishTime,
          
            acceptableClicks: body.acceptableClicks,
            faults: body.faults,
          
            nrOfViews: body.nrOfViews,
            answeredQuestions: answeredQuestions
        };

        return this.Model.findByIdAndUpdate(id, data,{new: true}).exec();
    }

    findAndPopulateManuals(...args){
        return this.Model
        .find(...args)
        .populate('manual')
        .exec()
    }
}

module.exports = new UsabilityDataFacade('UsabilityData', usabilityDataSchema)
