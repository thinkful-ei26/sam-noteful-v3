'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Tag = require('../models/tag');
const router = express.Router();
const Note = require('../models/note');

router.get('/', (req, res, next) => {
  Tag.find()
    .sort({name: 'asc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
    .then(results => {
      if (results) {
        res.json(results);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    const err = new Error('You are missing a Tag');
    err.status = 400;
    return next(err);
  }
  const newTag = {name};
  Tag.create(newTag)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists you dummy');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const{name} = req.body;

  if (!name) {
    const err = new Error('Missing tag name');
    err.status= 400;
    return next(err);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Not a valid Id');
    err.status = 400;
    return next(err);
  }
  const updateTag = {name};
  Tag.findByIdAndUpdate(id, updateTag, {new: true})
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The tag name already exists you dummy');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Tag.findByIdAndRemove(id)
    .then(() => Note.updateMany({tags: id},{$pull: {tags: id }}))
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });

});

module.exports = router;