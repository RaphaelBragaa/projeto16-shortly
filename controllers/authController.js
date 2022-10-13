import {signUpSchema, signSchema} from "../schemas/authSchema.js"
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'
import connection from '../src/database/db.js'

async function signUp(req,res) {
 const {name, email, password,confirmPassword} = req.body
const isValid = signUpSchema.validate({
	name,
	email,
	password,
	confirmPassword
})

if(isValid.error){
	return res.status(402).send(isValid.error.details)
}

const encryptPassword = bcrypt.hashSync(password, 10)
console.log(encryptPassword + " ESSE")

try{
await	connection.query(`
INSERT INTO 
users (name,email,password) 
VALUES ($1,$2,$3)`,
[name,email,encryptPassword]
)
res.send(201)
}catch(error){
console.log(error)
res.send(409)
}}


async function sign(req,res){
 const {email, password} = req.body

	const isValid = signSchema.validate({
	email,
    password
    })

if(isValid.error){
	return res.status(422).send(isValid.error.details)
}

const search = await connection.query(`
SELECT * FROM users 
WHERE email = $1`,
[email])

const isValidPass = bcrypt.compareSync(password, search.password)

if(!search || !isValidPass){
return res.send(401)
}

const token = uuid()
try{
		await connection.query(`
			INSERT INTO sessions (${token}) 
			SELECT id 
			FROM users
			WHERE id = "userId"
			`)
return res.status(200).send(token)
		
		}catch(error){
console.log(error)
return res.send(500)
		}

}

export {signUp,sign}


