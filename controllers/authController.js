const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const JWT_SECRET = require('../config/keys').JWT_SECRET;
const JWT_EXPIRES = require('../config/keys').JWT_EXPIRES;
const {promisify} = require("util");

const signJwt = (id) => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    });
};

const encryptPw = async (password) => {
    return await bcrypt.hash(password, 8);
};

const sendToken = (user, statusCode, req, res) => {
    const token = signJwt(user._id);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token: token,
    })
}

exports.signup = async (req, res) => {
    const {username, password, email } = req.body;
    const pw = await encryptPw(password);
    try {
        const newUser = await User.create({
            username,
            password: pw,
            email
        });
        sendToken(newUser,201,req,res)
    }
    catch(err){
        res.status(401).json(err.message);
    }
}

exports.login = async (req, res) =>{
    const {password, email} = req.body;
    try{
        const user = await User.findOne({email}).select('+password');
        if(user === null){
            res.status(401).json({message: "Login Failed"});
            return;
        }
        const compared = await bcrypt.compare(password, user.password);
        compared
        ? sendToken(user, 200, req, res)
        : res.status(401).json({message: "Login Failed"});
    } catch (err) {
        console.log(err)
        res.status(401).json(err.message);
    }
}

const decryptJwt = async (token) => {
    const jwtVerify = promisify(jwt.verify);
    return await jwtVerify(token,JWT_SECRET);
}

exports.checkUser = async (req,res) =>{
    const {token} = req.body;
    if(!token){
        res.status(401).json({
            status: 'unauthorized',
            message: 'You are not allowed to visit this page'
        });
        return;
    }
    const jwtInfo = await decryptJwt(token);
    try{
        const user = await User.findById(jwtInfo.id);
        res.status(201).json({
            user:user.username,
            email:user.email
        })
    }
    catch(err){
        console.log(err)
        res.status(401).json(err.message);
    }
}