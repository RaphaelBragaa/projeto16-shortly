import connection from '../src/database/db.js'
import  {  nanoid  }  from 'nanoid' 

let userId;

async function Shorten (req,res){
    const {url} = req.body 
  
    const token = res.locals.token
  

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

       userId = id.rows[0].userId
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

async function urlId (req,res){
    const {id} = req.params
   
    try{
    const search = await connection.query(`
    SELECT id, "shortUrl", url FROM "public.urls"
    WHERE id = $1
    `,[id])  
    if(search.rows.length === 0){
         return res.send(404)
    }else{
        console.log(search.rows.length )
        return res.status(200).send(search.rows)
    }

    }catch(error){
        console.log(error)
       return res.send(500)
    }
   
}

async function shortUrl (req,res){
    const {shortUrl} = req.params
    try{
        const searchUrl = await connection.query(`
        SELECT * FROM "public.urls"
        WHERE  "public.urls"."shortUrl" = $1
        `,[shortUrl])

        console.log(searchUrl.rows)

        if(searchUrl.rows.length === 0){
           return res.send(404)
        }

        const url = searchUrl.rows[0].url
     
        let visitLink = searchUrl.rows[0].visitLink
        visitLink = visitLink + 1
        
        await connection.query(`
        UPDATE "public.urls" SET "visitLink" = $1 WHERE url = $2 
        `,[visitLink, url])


        res.redirect(url)
    }catch(error){
        console.log(error)
        return res.status(500)
    }
   
}

export {Shorten, urlId,shortUrl} 