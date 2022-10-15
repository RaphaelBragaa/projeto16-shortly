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
	return res.status(422).send(isValid.error.details)
}

const encryptPassword = bcrypt.hashSync(password, 10)
console.log(encryptPassword + " ESSE")

try{
await	connection.query(`
INSERT INTO 
"public.users" (name,email,password) 
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
SELECT * FROM "public.users" 
WHERE email = $1 ;`,
[email])


console.log('1')


const isValidPass = bcrypt.compareSync(password, search.rows[0].password)
console.log('2')

if(!search.rows[0] || !isValidPass){
return res.send(401)
}

console.log(search.rows[0].id)

const token = uuid()
console.log(token + "ESSE É O TOKEN")
try{
		await connection.query(`
			INSERT INTO "public.sessions" ("userId" , token) VALUES ($1,$2)`,[search.rows[0].id, token])

			
return res.status(200).send(token)
		
		}catch(error){
console.log(error)
return res.send(500)
		}

}



export {signUp,sign}


