'use strict';

const express = require('express');
const mongoose = require('mongoose');

const Note = require('../models/note');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId } = req.query;

  let filter = {};

  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };
  }
  if (tagId) {
    filter.tags = tagId;
  }
  if(folderId) {
    filter.folderId = folderId;
  }

  Note.find(filter)
    .sort({ updatedAt: 'desc' })
    .populate('tags', 'name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findById(id)
    .populate('tags', 'name')
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('Missing `folderID` in request body');
    err.status = 400;
    return next(err);
  }

  if (tags) {
    tags.forEach(element => {
      if(!mongoose.Types.ObjectId.isValid(element)) {
        const err = new Error('Missing `tags` in request body');
        err.status = 400;
        return next(err);
      }
    });    
  }


  const newNote = { title, content, folderId, tags };

  if(folderId === '') {
    newNote.folderId = null;
  }


  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});


/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, folderId, tags } = req.body;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('Missing `folderID` in request body');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  if (tags) {
    tags.forEach(element => {
      if(!mongoose.Types.ObjectId.isValid(element)) {
        const err = new Error('Missing `tags` in request body');
        err.status = 400;
        return next(err);
      }
    });    
  }


  const updateNote = { title, content, folderId, tags};


  if(folderId === '') {
    delete updateNote.folderId;
    updateNote.$unset = {folderId: ''
    };
  }


  Note.findByIdAndUpdate(id, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;