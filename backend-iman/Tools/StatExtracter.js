const json2xls = require('json2xls');
const mongoose      = require('mongoose');
const dataFacade = require('../model/usability-data/facade');
const fs = require('fs');



exports.generate = async function() {


var fields = {
    fields: [
        'userId',
        'step',
        'timeTaken',
        'nrOfViews',
        'okClicks',
        'faults',
        'group'
    ]
}
let dataset = [];

const rawData = dataFacade.find()
    .then(async data => {

        for(i = 0; i < data.length; i++)
        {       
            let currentData = data[i];
            
            let aborted = (data[i].finishTime === undefined || data[i].finishTime === null);
            let timeSec = -1;
            if (!aborted)
                timeSec = (data[i].finishTime.getTime() - data[i].startTime.getTime())/1000;

            let group = 'aborted';

            //console.log(data[i]);

            await dataFacade.find({userId: data[i].userId, step: 33})
                .then(result => {
                    // console.log(currentData);
                    // console.log(result[0]);
                    if (result[0])
                    {
                        // console.log(result[0].answeredQuestions[0]);
                        group = result[0].answeredQuestions[0].selectedOption;
                        // console.log(group);
                    }

                    let newData = {
                        userId: currentData.userId,
                        step: currentData.step,
                        timeTaken: timeSec,
                        nrOfViews: currentData.nrOfViews,
                        okClicks: currentData.acceptableClicks,
                        faults: currentData.faults,
                        group: group
                    }
            
                    dataset.push(newData);
                    // console.log("in result");
                    // console.log(dataset);

                });
                
        }
        return 1;
    })
    .then( (get) => {
        // console.log(get);
        // console.log(dataset);
        let xls = json2xls(dataset, fields);
        
        ROOT_APP_PATH = fs.realpathSync('.');
        
        fs.writeFile('stats.xlsx', xls, 'binary',function(err) {
            if(err)
                return console.log(err);
            console.log('File written to ' + ROOT_APP_PATH);
        })
        
        mongoose.connection.close();
    })

}

exports.generateOneLinePerUser = async function() {
    var fields = {
        fields: [     
        ]
    }

    fields.fields.push('userid');

    for(i = 1; i< 35; i++)
    {        
        let headline = 'step'+i;
        fields.fields.push(headline+' timeTaken');
        fields.fields.push(headline+' nrOfViews');
        fields.fields.push(headline+' okClicks');
        fields.fields.push(headline+' faults');      
    }

    fields.fields.push('group');

    let dataset = [];

    new Promise(async (resolve) => {
            for(n = 1; n<50; n++)
            {
            let group = 0;
            await dataFacade.find({userId: n})
                .then(result => {
                    if(result.length > 0)
                    {
                        
                        console.log(result[32]);
                        if(result[32] && result[32].answeredQuestions.length > 0)
                        {
                            group = Number(result[32].answeredQuestions[0].selectedOption);
                        }
                        let data = {
                            userid: n,
                            group: group
                        }
        
                        for(m = 1; m < 35; m++)
                        {
                            if(result[m]){
                                let headline = 'step'+m;
                                let timeSec = -1;
                                let aborted = (result[m].finishTime === undefined || result[m].finishTime === null);
        
                                if (!aborted)
                                    timeSec = (result[m].finishTime.getTime() - result[m].startTime.getTime())/1000;
        
                                data[headline+' timeTaken'] = timeSec;
                                data[headline+' nrOfViews'] = result[m].nrOfViews;
                                data[headline+' okClicks'] = result[m].acceptableClicks;
                                data[headline+' faults'] = result[m].faults;
                            }
                        }
                        dataset.push(data);
                    }
                    
                    return 1;
                });
            }
            console.log("Pos 1");
            resolve(true);
        })
        .then(()=>{
            console.log("Pos 2");

            let xls = json2xls(dataset, fields);
            console.log("Pos 3");

            ROOT_APP_PATH = fs.realpathSync('.');
        
            fs.writeFile('statsSingleLine.xlsx', xls, 'binary',function(err) {
                if(err)
                    return console.log(err);
                console.log('File written to ' + ROOT_APP_PATH);
            })

            mongoose.connection.close();
        });

}