const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usabilityDataSchema = new Schema({

  userId: { type: String },
  manual: { type: mongoose.Schema.Types.ObjectId, ref: 'manuals', required: true},
  step: { type: Number, required: true},

  startTime: { type: Date },
  finishTime: { type: Date },

  acceptableClicks: { type: Number },
  faults: { type: Number},

  answeredQuestions: [
    {
      question: { type: String, required: true },
      options: [{ type: String }],
      selectedOption: { type: String }
    }
  ],
  nrOfViews: { type: Number }
})

module.exports = usabilityDataSchema;
