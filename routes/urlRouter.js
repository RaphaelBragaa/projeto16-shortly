import express from 'express'
import {authMiddleware} from '../middlewares/authorizationMiddleware.js'
import {Shorten,urlId,shortUrl,urlDelete} from '../controllers/urlController.js'

const router = express.Router()

router.post('/urls/shorten', authMiddleware, Shorten)
router.get('/urls/:id', urlId)
router.get('/urls/open/:shortUrl', shortUrl)
router.delete('/urls/:id', authMiddleware, urlDelete)


export default router