const jwt = require('jsonwebtoken')
const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')

const MiddlewareController = {

    //verify token
    verifyToken(req , res , next){
        const token = req.headers.token;
        if(!token){
            return res.status(401).json("Bạn chưa có tokens")
        }
        const accessToken = token.split(' ')[1];
        jwt.verify(accessToken,process.env.TOKEN_ACCESS_KEY,(err,user)=>{
            if(err){
                return res.status(401).json('Token đã hêt thời hạn')
            }
            req.user = user;
            next();
        })
    },
     //verify token
     async authroles(req , res , next){
        try{
            const user = await UserModel.findOne({email: req.body.email});
            if(user?.admin){
                const validPassword = await bcrypt.compare(req.body.password,user.password);
                    if(!validPassword) {
                         return res.status(404).json("wrong password")
                    }else{
                        return res.status(200).json('admin')
                    }
            }else{
                next();
            }
        }catch(err){
            console.log(err);
            return res.status(401).json(err);
        }
    
    },
    //refresh token
    async refreshToken(req , res , next){
        const tokenAccess = req.headers.token;
        try{
            if(!tokenAccess){
                return res.status(403).json("token in valid")
            }else{
                return res.json(tokenAccess);
            }
        }catch(err){
            return res.status(401).json(err);
        }
    
    } 

}

module.exports = MiddlewareController;