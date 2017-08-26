const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Entry', entrySchema);
