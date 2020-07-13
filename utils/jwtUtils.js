const jwt = require("jsonwebtoken");
const {AuthenticationError} = require("apollo-server");

require("dotenv").config({ path: ".env" });


module.exports.jwtGenerate = (user)=>{
    return jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
}


module.exports.checkAuth = (context) =>{
    const authHader = context.req.headers.authorization

    if (authHader) {
        const token = authHader.split('Bearer ')[1]
        if (token) {
            try {
                const user = jwt.verify(token, process.env.SECRET)
                return user
            } catch (error) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }

        throw new Error('Authentication token must be \'Bearer [token] ')
    }
    throw new Error('Authentication header must be provided')

}