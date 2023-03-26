const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: [true, 'An item must have an id'],
  },
  name: {
    type: String,
    required: [true, 'An item must have a name'],
  },
  imageUrl: {
    type: String,
    required: [true, 'An item must have an image'],
  },
  price: {
    type: Number,
    required: [true, 'An item must have a price'],
  },
  category: {
    type: String,
    required: [true, 'An item must have a category'],
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
