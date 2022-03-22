const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config/keys")
const requireLogin = require("../middleware/requireLogin")


router.post('/signup', (req,res) => {
    const { name, email, password, pic} = req.body;
    if (!name || !password || !email) {
        return res.status(422).json({error: "Please add all fields"});
    }
    User.findOne({email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error: "User already exists!"});
        }

        bcrypt.hash(password, 1)
        .then((hashedPassword) => {
            const user = new User({
                email,
                password: hashedPassword,
                name,
                pic 
            })
    
            user.save()
            .then(user => {
                res.json({message: "User Saved Successfully!"});
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err);
        })
    })
    .catch((err) => {
        console.log(err);
    })
});

router.post("/signin", (req, res) => {
    const { email, password} = req.body;
    if(!email || !password){
        return res.status(422).json({error: "Provide email/password!"})
    }
    User.findOne({email})
    .then((savedUser) => {
        if(!savedUser){
            return res.status(422).json({error: "Invalid email/password!"});
        }
        bcrypt.compare(password, savedUser.password)
        .then( didItMatch => {
            if(didItMatch){
                // res.json({message: "Successfully signed in!"});
                const token = jwt.sign({_id: savedUser._id} , JWT_SECRET); 
                const {_id, name, email, followers, following, pic} = savedUser;
                res.json({token, user: {_id, name, email, followers, following, pic}});
            }
            else{
                return res.status(422).json({error: "Invalid email/password!"});
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

module.exports = router;