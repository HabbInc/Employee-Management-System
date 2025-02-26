import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {

    
    //const {token } = req.cookies;
    const {token } = req.headers;
    
    if(!token){
        return res.status(401).json({success:false, message:"Not Unauthorized Login Again"});
    }

    try {

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)

        if(tokenDecode.id){
            req.userId = tokenDecode.id;
            console.log("Decoded User ID:", req.userId);
        }else{
            return res.status(401).json({success:false, message:"Not Unauthorized Login Again"});
        }

        next();
        
    } catch (error) {
        res.status(401).json({success:false, message:"Not Unauthorized Login Again"});
    }
}

export default userAuth;