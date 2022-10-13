import express from 'express'
import {authMiddleware} from '../middlewares/authorizationMiddleware.js'
import {Shorten} from '../controllers/urlController.js'

const router = express.Router()

router.post('/urls/shorten', authMiddleware, Shorten)

export default router