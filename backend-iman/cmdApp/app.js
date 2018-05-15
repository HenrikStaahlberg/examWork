const commander = require('commander');
const mongoose = require('mongoose');
const config = require('../config.js');
const manual = require('./manual');
const excelWriter = require('../Tools/ExcelGeneratorUsabilityData');
const stats = require('../Tools/StatExtracter');
const usaData = require('./usabilityData');

mongoose.Promise = require('bluebird');
mongoose.connect(config.mongo.url);

// Specifying version
commander
  .version('1.0');

// Manuals subcommand
commander
.command('manuals')
.description('Handles manuals adding to the db')
.option('-c, --create [create]', 'Adds manual to database')
.option('-n, --name [name]', 'Specify file name, file must be in ../manualFiles folder')
.option('--drop', 'Drops manuals collection, deleting all data')
.action((flags) => {
  if (flags.list) {
  } 
  else if (flags.create) {
    if (!flags.name) {
      console.log('Please specify filename');
    } else {
      manual.create(flags.name);
    }
  } else if (flags.drop) {
      manual.drop(mongoose.connection);
  } else {
    console.log('No valid action found');
    mongoose.connection.close();
  }
});

// Usebility data subcommand
commander
.command('usaData')
.description('Handels usebility data functions')
.option('--drop', 'Drops the usability data deleting all data')
.option('-L --list', 'List all data')
.action((flags) => {
  if(flags.drop){
    usaData.drop(mongoose.connection);
  } else if(flags.list){
    usaData.list(mongoose.connection);
  } else {
    console.log('No valid action found');
    mongoose.connection.close();
  }
})

// Write usability excel file subcommand
commander
.command('writeExcel')
.description('Writes a excel file of usability data')
.action((flags) => {
  excelWriter.generate();
})

// Write usability excel file subcommand
commander
.command('exportStats')
.description('Writes a excel file of usability data')
.action((flags) => {
  stats.generate();
})

// Write usability excel file subcommand
commander
.command('singleLine')
.description('Writes a excel file of usability data')
.action((flags) => {
  stats.generateOneLinePerUser();
})

commander.parse(process.argv);