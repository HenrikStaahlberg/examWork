const dataFacade = require('../model/usability-data/facade');
const mongoose      = require('mongoose');
const Promise       = require('bluebird');

/**
* Function to delete the usability data collection. Destroying all data 
* in the database.
*/
exports.drop = function(connection) {
    const promise = new Promise((resolve, reject) => {
      connection.dropCollection('usabilitydatas', (err, result) => {
        if (err) reject(err);
        else {
          console.log('Usability data collection dropped');
          resolve(result);
        }
      });
    });
  
    promise.finally(() => {
      mongoose.connection.close();
    });
  
    return promise;
  };

  exports.list = function() {
    dataFacade.find()
    .then((results) => {
      results.forEach((data) => {
        console.log(JSON.stringify(data, null, 4));
      });
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      mongoose.connection.close();
    });
  };