const db = require("../Models");
const users = db.Users;
const Sequelize = db.Sequelize;
const cloudinary = require('../Cloudinary/cloudinary');

module.exports.getProfile = async (req, res) => {
    const id = req.userId;
    try{
        const person = await users.findOne({ 
            where: { 
                id: id,
                isLoogedIn: {[Sequelize.Op.is]: true},
            },
            attributes: [
                "id", "username", "firstname", "lastname", "email", "phone", "avatar"
            ] 
        });
        
        return res.status(200).json((person));
    }catch(e){
        return res.status(500).json({message: "Database error while retrieving user!" }); 
    }
}

module.exports.updateProfile = async (req, res) => {
    const id = req.userId;
    const { firstname,  lastname, email, phone } = req.body

    try{
        if(req.file){
            
            const image = await cloudinary.uploader.upload(req.file.path)

            await users.update({
                firstname: firstname,  
                lastname: lastname, 
                email: email, 
                phone: phone,
                avatar: image.url

            },{ 
                where: { 
                    id: id
                }
            });
            return res.status(200).json({message: "user updated successfully"})
        }else{
            await users.update({
                firstname: firstname,  
                lastname: lastname, 
                email: email, 
                phone: phone
            },{ 
                where: { 
                    id: id
                }
            });
            return res.status(200).json({message: "user updated successfully"})
       }
    }catch(e){
        return res.status(500).json({message: "Database error while retrieving user!" }); 
    }
}

