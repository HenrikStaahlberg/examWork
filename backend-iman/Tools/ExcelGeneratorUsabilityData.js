const json2xls = require('json2xls');
const mongoose      = require('mongoose');
const dataFacade = require('../model/usability-data/facade');
const fs = require('fs');



exports.generate = function() {


var fields = {
    fields: [
        'userId',
        'manual',
        'step',
        'timeTaken',
        'aborted',
        'nrOfViews',
        'okClicks',
        'faults'
    ]
}

const rawData = dataFacade.findAndPopulateManuals()
    .then(data => {
        let dataset = [];

        for(i = 0; i < data.length; i++)
        {
            if(data[i].manual !== null)
            {
            console.log(data[i].finishTime);
            let aborted = (data[i].finishTime === undefined || data[i].finishTime === null);
            let timeSec = -1;
            if (!aborted)
                timeSec = (data[i].finishTime.getTime() - data[i].startTime.getTime())/1000;

            let newData = {
                userId: data[i].userId,
                manual: data[i].manual.title,
                step: data[i].step,
                timeTaken: timeSec,
                aborted: aborted,
                okClicks: data[i].acceptableClicks,
                faults: data[i].faults,
                nrOfViews: data[i].nrOfViews
            }
            data[i].answeredQuestions.forEach(question => {
                newData[question.question] = question.selectedOption;
                fields.fields.push(question.question);
            });

            dataset.push(newData);
        }
        }

        let xls = json2xls(dataset, fields);
        
        ROOT_APP_PATH = fs.realpathSync('.');
        
        fs.writeFile('usabilit-data.xlsx', xls, 'binary',function(err) {
            if(err)
                return console.log(err);
            console.log('File written to ' + ROOT_APP_PATH);
        })
        
        mongoose.connection.close();
    })

}