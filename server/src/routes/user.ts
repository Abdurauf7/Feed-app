import express from 'express'
import { body } from 'express-validator'

import {getStatus, updateStatus} from '../controllers/user'

const router = express.Router()

router.get('/status/', getStatus)

router.put('/status/',[body('status').trim().notEmpty()],updateStatus)

export default router