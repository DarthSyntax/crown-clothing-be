const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

mongoose
  .connect(
    process.env.MDBCONNECTSTRING,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(console.log('DB Connection established!'));

let port = 8000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
