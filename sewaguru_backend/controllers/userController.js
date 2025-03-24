import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export function saveUser(req, res) {

    if(req.body.role== "admin"){     //ony admin can create another admin
        if(req.user==null){     //if user is not logged in
            res.status(403).json({
                message:"Please login as admin before creating admin account"
            })
            return;
        }
        if(req.user.role!="admin"){     //if user is not admin
            res.status(403).json({
                message:"You are not authorized to create admin account"
            })
            return;
        }
    }
    
    //to create a hash password
    const hashedPassword = bcrypt.hashSync(req.body.password,10)
    const user = new User({
        email: req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        password: hashedPassword,
        role:req.body.role,
    })

    user.save().then(()=>{
        res.json({
            message:"User saved successfully"
        })
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ message: "User not saved" 

        })
    });
    
} 

export function loginUser(req, res) {
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({
        email:email
    }).then((user)=>{
        if(user==null){
            res.status(404).json({
                message:"User not found"
            })
        }else{
            const isPasswordCorrect= bcrypt.compareSync(password,user.password);
            if(isPasswordCorrect){
                
                const userData={
                    email: user.email,
                    firstName:user.firstName,
                    lastName:user.lastName,
                    role:user.role,
                    phone:user.phone,
                    isDisabled:user.isDisabled,
                    isEmailVerified:user.isEmailVerified

                }
                console.log(userData)

                const token=jwt.sign(userData,"random456")
                res.json({
                    message:"Login successful",
                    token:token
                })


            }else{
                res.status(403).json({
                    message:"Password is incorrect"
                })
            }
        }  
        
    })
}