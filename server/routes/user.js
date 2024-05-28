const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const userContoller = require('../controllers/user')
const router = express.Router()

router.get('/status/',isAuth,userContoller.getStatus)

router.put('/status/',[body('status').trim().notEmpty()],
isAuth,
userContoller.updateStatus)


module.exports = router