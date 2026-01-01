import jwt from 'jsonwebtoken'

const getAuthUser = async (req, res, next) => {
    const {token} = req.cookies
    if(!token) {
        return res.json({success: false, msg: "Session Expired!"})
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.user = {id: tokenDecode.id}
        }else {
            return res.json({success: false, msg: "Not Authorized."})
        }
        next();
    } catch (error) {
        return res.json({success: false, msg: error.message})
    }
}

export default getAuthUser;