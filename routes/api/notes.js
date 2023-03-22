const express = require('express');
const router = express.Router();
const notesController = require('../../controllers/notesController');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLE_LIST = require('../../config/roles_list');
const verifyRole = require('../../middleware/verifyRoles')


router.route('/')
    .get(verifyJWT, verifyRole(ROLE_LIST.ADMIN), notesController.getAllNotes)
    .post(notesController.createNewNote)
    .put(verifyJWT, notesController.updateNote) 
    .delete(verifyJWT, verifyRole(ROLE_LIST.ADMIN), notesController.deleteNote)

    router.route('/getNote')
    .get(notesController.getNote)

    module.exports =router;