'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');
const Folder = require('../models/folder');
const { folders } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Folders API resource', function() {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });
  
  beforeEach(function () {
    return Folder.insertMany(folders);
  });
  
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function () {
    return mongoose.disconnect();
  });
  describe('GET /api/folders', function () {
    it('should return correnct folders with correct data', function () {
      
      return Promise.all([
        Folder.find().sort({ name: 'asc' }),
        chai.request(app).get('/api/folders')
      ])
      
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.length(data.length);
          res.body.forEach((folder, i) => {
            expect(folder).to.include.all.keys('name', 'createdAt', 'updatedAt');
            expect(folder.id).to.equal(data[i].id);
            expect(folder.name).to.equal(data[i].name);
          });
        });
    });
  });

  describe(' GET /api/folders/id', function () {
    it('should return correct folder when givin an id', function () {
      let data;
      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/folders/${data.id}`);
        })
        .then((res) => {
          expect(res.body.name).to.equal(data.name);
        });
    });
  });

  describe(' POST /api/folders', function (){
    it('sould make and return a new folder with valid data', function() {
      const newFolder = {'name': 'chicken shit'};
      let res;
      return chai.request(app)
        .post('/api/folders')
        .send(newFolder)
        .then(function (_res) {
          res = _res;
          expect(res.body).to.have.all.keys('name', 'id', 'createdAt', 'updatedAt');
          return Folder.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id); 
          expect(res.body.name).to.equal(data.name);
        });
      
    });
  });

  describe('PUT /api/folders', function(){
    it('should update a folder when givin a valid id', function (){
      const upFolder = {'name': 'cicken scratch'};
      let res;
      let orig;
      return Folder.findOne()
        .then(_orig => {
          orig = _orig;
          return chai.request(app)
            .put(`/api/folders/${orig.id}`)
            .send(upFolder);
        })
        .then(function (_res) {
          res = _res;
          expect(res.body).to.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
          return Folder.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.name).to.equal(data.name);
          expect(res.body.id).to.equal(data.id);
        });
    });
  });

  describe('DELETE /api/folders', function() {
    it('should delete a folder and its notes when givin an id', function (){
      let data;
      return Folder.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app)
            .delete(`/api/folders/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Folder.countDocuments({_id: data.id});
        })
        .then(count => {
          expect(count).to.equal(0);
        });

    });
  });

});