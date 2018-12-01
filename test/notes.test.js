'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');

const Note = require('../models/note');

const { notes } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Notes API resource', function() {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Note.insertMany(notes);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });


  describe('GET /api/notes', function () {
    it('should return correnct notes with correct data', function () {
    // 1) Call the database **and** the API
    // 2) Wait for both promises to resolve using `Promise.all`
      return Promise.all([
        Note.find().sort({ updatedAt: 'desc' }),
        chai.request(app).get('/api/notes')
      ])
      // 3) then compare database results to API response
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          // res.body.forEach((note, i) => {
          //   expect(note).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt','folderId');
          //   expect(note.id).to.equal(data[i].id);
          //   expect(note.title).to.equal(data[i].title);
          //   expect(note.content).to.equal(data[i].content);
          // });
        });
    });
    it('should work with a searchTerm query', function () {
      const searchTerm = 'gaga';
      const dbPromise = Note.find({
        title: { $regex: searchTerm, $options: 'i' }});
      const apiPromise = chai.request(app)
        .get(`/api/notes?searchTerm=${searchTerm}`);
      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(1);
          res.body.forEach( (note, i) => {
            expect(note).to.be.a('object');
            expect(note).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt','folderId', 'tags');
            expect(note.id).to.equal(data[i].id);
            expect(note.title).to.equal(data[i].title);
            expect(note.content).to.equal(data[i].content);
            expect(new Date(note.createdAt)).to.deep.equal(data[i].createdAt);
            expect(new Date(note.updatedAt)).to.deep.equal(data[i].updatedAt);
          });
        });
    });
  });

  
  describe('GET /api/notes/:id', function () {
    it('should return correnct note with a  id', function () {
      let data;
      return Note.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/notes/${data.id}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('id', 'title', 'content', 'createdAt', 'updatedAt','folderId', 'tags');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.deep.equal(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.deep.equal(data.updatedAt);
        });
    });
    it('should respond with a 404 for an id that does not exist', function () {
      return chai.request(app)
        .get('/api/notes/DOESNOTEXIST')
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  });



  describe('POST', function() {
    it('should create and return a new item when provided valid data', function () {
      const newNote = {
        'title': 'hello!',
        'content': 'how are you',
        'folderId': '111111111111111111111102'
      };
      let res;
      return chai.request(app)
        .post('/api/notes')
        .send(newNote)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt','folderId', 'tags');
          return Note.findById(res.body.id);
        })
        .then(note => {
          expect(res.body.id).to.equal(note.id);
          expect(res.body.title).to.equal(note.title);
          expect(res.body.content).to.equal(note.content);
          expect(new Date(res.body.createdAt)).to.deep.equal(note.createdAt);
          expect(new Date(res.body.updatedAt)).to.deep.equal(note.updatedAt);
        });
    });

    it('should return an error when missing "title" field', function () {
      const newNote = {
        'content': 'dogs are great'
      };
      return chai.request(app)
        .post('/api/notes')
        .send(newNote)
        .then(res => {
          expect(res).to.have.status(400);
        });
    });
  });


  describe('PUT /api/notes/:id', function () {

    it('should update the note when provided valid data', function () {
      const updateNote = {
        'title': 'What about dogs?!',
        'content': 'woof woof',
        'folderId': '111111111111111111111102'
      };
      let res, orig;
      return Note.findOne()
        .then(_orig => {
          orig = _orig;
          return chai.request(app)
            .put(`/api/notes/${orig.id}`)
            .send(updateNote);
        })
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.keys('id', 'title', 'content', 'createdAt', 'updatedAt','folderId', 'tags');
          return Note.findById(res.body.id);
        })
        .then( data => {
          expect(res.body.title).to.equal(data.title);
          expect(res.body.content).to.equal(data.content);
          expect(new Date(res.body.createdAt)).to.deep.equal(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.deep.equal(data.updatedAt);
          // expect note to have been updated
          expect(new Date(res.body.updatedAt)).to.greaterThan(orig.updatedAt);
        });
    });
  
    it('should respond with status 400 and an error message when `id` is not valid', function () {
      const updateNote = {
        'title': 'What about dogs?!',
        'content': 'woof woof'
      };
      return chai.request(app)
        .put('/api/notes/NOT-A-VALID-ID')
        .send(updateNote)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });
  
    it('should respond with a 404 for an id that does not exist', function () {
      // The string "DOESNOTEXIST" is 12 bytes which is a valid Mongo ObjectId
      const updateNote = {
        'title': 'What about dogs?!',
        'content': 'woof woof',
        'folderId':'111111111111111111111102'
      };
      return chai.request(app)
        .put('/api/notes/DOESNOTEXIST')
        .send(updateNote)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });
  
    it('should return an error when missing "title" field', function () {
      const updateNote = {
        'content': 'woof woof',
        'folderId':'111111111111111111111102'
      };
      let data;
      return Note.findOne()
        .then(_data => {
          data = _data;
  
          return chai.request(app)
            .put(`/api/notes/${data.id}`)
            .send(updateNote);
        })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Missing `title` in request body');
        });
    });
  
  });

  describe('DELETE /api/notes/:id', function () {

    it('should delete an existing document and respond with 204', function () {
      let data;
      return Note.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/notes/${data.id}`);
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          return Note.countDocuments({ _id: data.id });
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });

  });
}); 





