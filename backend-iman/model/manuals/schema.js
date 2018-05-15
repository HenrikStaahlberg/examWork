const mongoose = require('mongoose')
const Schema = mongoose.Schema

const manualsSchema = new Schema(
{
  title: { type: String, required: true },
  currentStep: { type: Number, default: 0 },
  steps: [
    {
      description: { type: String, default: '' },
      faultMessage: { type: String, default: '' },
      elementIds: [
        { type: String }
      ],
      canClickElement: { type: Boolean, default: false },
      buttons: [
        {
          label: { type: String, required: true },
          action: { type: String, enum: ['CONTINUE','SKIPTO','ANSWER_QUESTION', 'CLOSE'], default: 'CONTINUE' },
          actionValue: { type: Number, default: 0 }
        }
      ],
      canMoveForward: { type: Boolean, default: false },
      canMoveBackward: { type: Boolean, default: false },
      questions: [
        {
          question: { type: String, required: true },
          options: [{ type: String }],
          selectedOption: { type: String, default: ''}
        }
      ],
      acceptableALinks: [
        { type: String }
      ],
      overlayElements: [
        { type: String }
      ],
      disabledElements: [
        { type: String }
      ],
      requiredInputs: [
        {
          elementImanId: { type: String, required: true },
          type: { type: String, enum: ['CHECKBOX', 'TEXTAREA'] },
          notDoneMsg: { type: String, required: true }
        }
      ],
      infoPosition: { type: String, enum: ['CENTER','TOPRIGHT'], default: 'CENTER'},
      width: { type: Number, default: 450 }
    }
  ],
})


module.exports = manualsSchema;
