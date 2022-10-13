
import joi from 'joi'

const signUpSchema = joi.object({
	name:joi.string().min(1).max(20).required(),
	email:joi.string().email().required(),
	password:joi.string().min(1).max(20).required(),
	confirmPassword:joi.ref('password')
})

const signSchema = joi.object({
	name:joi.string().required(),
	email:joi.string().email().required(),
	password:joi.string().required()
})

export {signUpSchema, signSchema}