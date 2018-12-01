'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../server');
const { TEST_MONGODB_URI } = require('../config');
const Tag = require('../models/tag');
const { tags } = require('../db/seed/data');

const expect = chai.expect;
chai.use(chaiHttp);


describe('Tag API resource', function() {

  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => mongoose.connection.db.dropDatabase());
  });
  
  beforeEach(function () {
    return Tag.insertMany(tags);
  });
  
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  
  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/tags', function () {
    it('should return correnct tags with correct data', function () {
      
      return Promise.all([
        Tag.find().sort({ name: 'asc' }),
        chai.request(app).get('/api/tags')
      ])
      
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.have.length(data.length);
          res.body.forEach((tag, i) => {
            expect(tag).to.include.all.keys('name', 'createdAt', 'updatedAt');
            expect(tag.id).to.equal(data[i].id);
            expect(tag.name).to.equal(data[i].name);
          });
        });
    });
  });

  describe(' GET /api/tags/id', function () {
    it('should return correct tag when givin an id', function () {
      let data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/tags/${data.id}`);
        })
        .then((res) => {
          expect(res.body.name).to.equal(data.name);
        });
    });
  });

  describe(' POST /api/tags', function (){
    it('sould make and return a new tag with valid data', function() {
      const newFolder = {'name': 'chicken shit'};
      let res;
      return chai.request(app)
        .post('/api/tags')
        .send(newFolder)
        .then(function (_res) {
          res = _res;
          expect(res.body).to.have.all.keys('name', 'id', 'createdAt', 'updatedAt');
          return Tag.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.id).to.equal(data.id); 
          expect(res.body.name).to.equal(data.name);
        });
      
    });
  });

  describe('PUT /api/tags', function(){
    it('should update a tag when givin a valid id', function (){
      const upTag = {'name': 'cicken scratch'};
      let res;
      let orig;
      return Tag.findOne()
        .then(_orig => {
          orig = _orig;
          return chai.request(app)
            .put(`/api/tags/${orig.id}`)
            .send(upTag);
        })
        .then(function (_res) {
          res = _res;
          expect(res.body).to.have.all.keys('id', 'name', 'createdAt', 'updatedAt');
          return Tag.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.name).to.equal(data.name);
          expect(res.body.id).to.equal(data.id);
        });
    });
  });

  describe('DELETE /api/tags', function() {
    it('should delete a tag and its notes when givin an id', function (){
      let data;
      return Tag.findOne()
        .then(_data => {
          data = _data;
          return chai.request(app)
            .delete(`/api/tags/${data.id}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          return Tag.countDocuments({_id: data.id});
        })
        .then(count => {
          expect(count).to.equal(0);
        });

    });
  });

});