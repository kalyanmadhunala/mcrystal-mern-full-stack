import jwt from "jsonwebtoken"



//Route for admin login
const adminLogin = async (req, res) => {

    try {


        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, msg: "Invalid credentials"})
        }


    } catch (error) {
        console.log(error);        
        res.json({success: false, msg: error.message})
    }

};

export { adminLogin };
