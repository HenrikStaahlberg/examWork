const manualFacade = require('../model/manuals/facade');
const mongoose      = require('mongoose');
const Promise       = require('bluebird');

/**
* Create new account.
*/
exports.create = function(name) {
    let file;

    const promise = new Promise((resolve, reject) => {
        
        try {
            file = require('../manualFiles/' + name);
        }
        catch(e) {
            console.log(e);
            mongoose.connection.close();
            return;
        }

        manualFacade.create(file)
        .then((results) => {
            console.log('Manual added to database');
            console.log(JSON.stringify(results, null, 4));
        })
        .catch((err) => {
            console.log(err);
            reject(err);
        })
        .finally(() => {
            resolve();
        });

        });
    
      promise.finally(() => {
        mongoose.connection.close();
      });

      return promise;

};

/**
* Function to delete the manuals collection. Destroying all data of manuals
* in the database.
*/
exports.drop = function(connection) {
    const promise = new Promise((resolve, reject) => {
      connection.dropCollection('manuals', (err, result) => {
        if (err) reject(err);
        else {
          console.log('Manuals collection dropped');
          resolve(result);
        }
      });
    });
  
    promise.finally(() => {
      mongoose.connection.close();
    });
  
    return promise;
  };
