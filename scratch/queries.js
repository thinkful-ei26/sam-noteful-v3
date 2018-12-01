// 'use strict';

// const mongoose = require('mongoose');
// const { MONGODB_URI } = require('../config');

// const Note = require('../models/note');

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     const searchTerm = 'lady gaga';
//     let filter = {};

//     if (searchTerm) {
//       filter.title = { $regex: searchTerm, $options: 'i' };
//     }

//     return Note.find(filter).sort({ updatedAt: 'desc' });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

//   mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     return Note.findById('000000000000000000000002')
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     return Note.create({title:'i loooooove cats', content: 'they are sooo soft'});
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });


// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     return Note.findByIdAndUpdate('5bfda73adeef4b20ccdded61' ,
//       {title:'i love cats', content: 'they are so soft'}, 
//       { new: true, upsert: true });
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });

// mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
//   .then(() => {
//     return Note.findByIdAndDelete('5bfda4420f1788552846cc5b');
//   })
//   .then(results => {
//     console.log(results);
//   })
//   .then(() => {
//     return mongoose.disconnect()
//   })
//   .catch(err => {
//     console.error(`ERROR: ${err.message}`);
//     console.error(err);
//   });