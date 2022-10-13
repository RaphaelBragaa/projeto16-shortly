import express from 'express'
import {signUp,sign} from "../controllers/authController.js"


const router = express.Router()


router.post('/signup', signUp)
router.post('/signin', sign)

export default router