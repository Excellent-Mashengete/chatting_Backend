const db = require("../../Models");
const users = db.Users;

module.exports.logout = async (req, res) => {
    const { identifier } = req.body;
    try{
        await users.update({ 
                isLoogedIn: false 
            },{ 
                where: { 
                    email: identifier
                }
            }
        );

        return res.status(200).send({ message: "You've been signed out!" });
    }catch(e) {
        return res.status(500).json({message: "Database error while logging out user!" });
    }
}