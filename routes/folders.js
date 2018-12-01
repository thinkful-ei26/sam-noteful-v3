'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Folder = require('../models/folder');
const Note = require('../models/note');

const router = express.Router();

router.get('/', (req, res, next) => {
  Folder.find()
    .sort({ name: 'asc' })
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
  Folder.findById(id)
    .then(results =>  {
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
    const err = new Error('Missing Name in the request');
    err.status = 400;
    return next(err);
  }
  const newFolder = { name };
  Folder.create(newFolder)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })

    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists you dummy');
        err.status = 400;
      }
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const {id} = req.params; 
  const {name} = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The id isn\'t valid');
    err.status = 400;
    return next(err);
  }
  if (!name) {
    const err = new Error('Missing a Name in request');
    err.status = 400;
    return next(err);
  }
  const updateFolder = {name};
    
  Folder.findByIdAndUpdate(id, updateFolder, {new: true})
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The folder name already exists you dummy');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  Note.deleteMany({folderId: id})
    .then(() => Folder.findByIdAndRemove(id))
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;