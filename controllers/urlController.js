import connection from '../src/database/db.js'
import { nanoid } from 'nanoid'

let userId;

async function Shorten(req, res) {
    const { url } = req.body

    const token = res.locals.token


    if (!url) {
        return res.send(401)
    }
    const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;



    if (!regex.test(url)) {
        return res.send(422)
    }
    try {
        const id = await connection.query(`
       SELECT "public.sessions"."userId" FROM "public.sessions"
       WHERE "public.sessions".token = $1
       `, [token])

        userId = id.rows[0].userId
        const shortUrl = nanoid(10)

        await connection.query(`
        INSERT INTO "public.urls" ("shortUrl", url, "visitLink", "userId") VALUES ($1,$2, 0,$3)
        `, [shortUrl, url, userId])




        return res.status(201).send(shortUrl)
    } catch (error) {
        console.log(error)
        return res.send(500)
    }


}

async function urlId(req, res) {
    const { id } = req.params

    try {
        const search = await connection.query(`
    SELECT id, "shortUrl", url FROM "public.urls"
    WHERE id = $1
    `, [id])
        if (search.rows.length === 0) {
            return res.send(404)
        } else {
            return res.status(200).send(search.rows)
        }

    } catch (error) {
        console.log(error)
        return res.send(500)
    }

}

async function shortUrl(req, res) {
    const { shortUrl } = req.params
    try {
        const searchUrl = await connection.query(`
        SELECT * FROM "public.urls"
        WHERE  "public.urls"."shortUrl" = $1
        `, [shortUrl])

        console.log(searchUrl.rows)

        if (searchUrl.rows.length === 0) {
            return res.send(404)
        }

        const url = searchUrl.rows[0].url

        let visitLink = searchUrl.rows[0].visitLink
        visitLink = visitLink + 1

        await connection.query(`
        UPDATE "public.urls" SET "visitLink" = $1 WHERE url = $2 
        `, [visitLink, url])


        res.redirect(url)
    } catch (error) {
        console.log(error)
        return res.status(500)
    }

}

async function urlDelete(req, res) {
    const { id } = req.params
    const token = res.locals.token

    try {
        const searchUser = await connection.query(`
        SELECT "userId" FROM "public.sessions" WHERE token = $1
        `, [token])

        const idUser = searchUser.rows[0].userId

        const domainUrlUser = await connection.query(`
       SELECT * FROM "public.urls" WHERE "userId" = $1 AND id = $2
       `, [idUser, id])
        if (domainUrlUser.rows.length === 0) {
            return res.send(402)
        }

        const checkUrl = await connection.query(`
       SELECT * FROM "public.urls" WHERE id = $1 
       `, [id])
        if (checkUrl.rows.length === 0) {
            return res.send(404)
        }

        await connection.query(`
       DELETE FROM "public.urls" WHERE id = $1
       `, [id])

        return res.send(204)


    } catch (error) {
        console.log(error)
        return res.send(500)
    }

}

async function userUrl(req, res) {
    const token = res.locals.token

    try {
        const searchUser = await connection.query(`
        SELECT "userId" FROM "public.sessions" WHERE token = $1
        `, [token])

        const idUser = searchUser.rows[0].userId

        if (!idUser) {
            return res.send(404)
        }
        const Soma = await connection.query(`
      SELECT SUM("visitLink") FROM "public.urls" WHERE "userId" = $1
      `, [idUser])

     

        const visitCount = Soma.rows[0].sum

        console.log(typeof (Number(visitCount)) + ' esse eo tipo')




        const user = await connection.query(`
      SELECT "public.users".id, "public.users".name
      FROM "public.users"
      WHERE "public.users".id = $1
      `, [idUser])

        const userMaster = user.rows[0]

        const urls = await connection.query(`
      SELECT "public.urls".id, "public.urls"."shortUrl" , "public.urls".url, "public.urls"."visitLink" AS "visitCount" 
      FROM "public.urls" WHERE "public.urls"."userId" = $1
      `, [idUser])

      await connection.query(`
      UPDATE "public.users" SET "visitCount" = 1$ WHERE id = $2
      `,[visitCount, idUser])
        

        return res.send({
            id: userMaster.id,
            name: userMaster.name,
            visitCount: visitCount,
            shortenedUrls: urls.rows
        })


    } catch (error) {
        console.log(error)
        return res.send(500)
    }
}

async function Ranking (req,res){
    
    const rank = await connection.query(`
    SELECT "public.users".id, "public.users".name, "public.urls"."visitLink" AS "LinkCount", "public.users"."visitCount"
    FROM "public.users" 
    JOIN "public.urls" ON "public.urls"."userId" = "public.users".id 
    ORDER BY "public.users"."visitCount" ASC
    LIMIT 10
    `)

    res.send(rank.rows)
}

export { Shorten, urlId, shortUrl, urlDelete, userUrl,Ranking } 