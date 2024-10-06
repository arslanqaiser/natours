const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtexception', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 334,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('error:', err);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listing on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!');
  server.close(() => {
    process.exit(1);
  });
});
