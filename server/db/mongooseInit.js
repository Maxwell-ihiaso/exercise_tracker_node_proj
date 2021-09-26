const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('database base connection started...'))
  .catch(err => console.log(err.message));

mongoose.connection.on('connected', () => console.log("connected to database"));

mongoose.connection.on('error', (err) => {
  console.log(err.message)
});

mongoose.connection.on('disconnected', () => console.log('Database disconnected.'));

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
})

