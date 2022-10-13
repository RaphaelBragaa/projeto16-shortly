import connection from '../src/database/db.js'
import  {  nanoid  }  from 'nanoid' 

async function Shorten (req,res){
    const {url} = req.body 
   // console.log(url)
    const token = res.locals.token
   // console.log(token)

    if(!url){
        return res.send(401)
    }
    const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    
    

    if (!regex.test(url)) {
     return res.send(422)
    }
    try{
       const id = await connection.query(`
       SELECT "public.sessions"."userId" FROM "public.sessions"
       WHERE "public.sessions".token = $1
       `,[token])

       const userId = id.rows[0].userId
       const shortUrl = nanoid(10)
     
        await connection.query(`
        INSERT INTO "public.urls" ("shortUrl", url, "visitLink", "userId") VALUES ($1,$2, 0,$3)
        `,[shortUrl, url, userId])
       
        
        
        
       return res.status(201).send(shortUrl)
    }catch(error){
        console.log(error)
      return  res.send(500)
    }


}

export {Shorten} //${token}