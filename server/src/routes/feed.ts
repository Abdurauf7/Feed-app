import express from 'express'
import {body} from 'express-validator'

import { getPosts, createPost } from '../controllers/feed'

const router = express.Router()

router.get('/posts',getPosts)

router.post('/post',[
    body('title', 'The title should be more than 5 character')
    .isLength({
    min: 5,
    })
    .isString()
    .trim(),
    body('content', 'The content should be more than 5 character')
    .isLength({
    min: 5,
    })
    .isString()
    .trim(),
], createPost)


export default router