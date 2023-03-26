const fs = require('fs');
const mongoose = require('mongoose');
const Item = require('./../../models/itemModel');

//mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(
  'mongodb+srv://staelp:killacam18@cluster0.rw2xn.mongodb.net/crownclothing?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.');
    } else {
      console.log('Error in DB connection: ' + err);
    }
  }
);

const items = JSON.parse(fs.readFileSync(`${__dirname}/store.json`, 'utf8'));

const importData = async () => {
  try {
    await Item.create(items);
    console.log('Store items created successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

importData();
