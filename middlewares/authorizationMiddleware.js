import connection from "../src/database/db";

async function authMiddleware(req,res,next){
    const token = req.headers.authorization?.replace('Bearer ', '');
    const session = await connection.query(`SELECT token FROM users WHERE token = $1`,[token] )
    if (!token || !session) {
      return res.send(401);
    }

    try{
    
     res.locals.token = token
     next()
    } 
    catch(error){

    }
}