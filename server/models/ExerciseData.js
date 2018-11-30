const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DataModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  minutes: {
    type: Number,
    min: 0,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DataSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  minutes: doc.minutes,
});

DataSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DataModel.find(search).select('name minutes date').exec(callback);
};

DataModel = mongoose.model('ExerciseData', DataSchema);

module.exports.DataModel = DataModel;
module.exports.DataSchema = DataSchema;
