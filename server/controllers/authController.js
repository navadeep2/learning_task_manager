 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const User = require('../models/User');
 const SECRET = process.env.JWT_SECRET; //|| 'your_jwt_secret_key';

//Signup
exports.signup = async (req,res) => {
    try{
        const {email,password, role, teacherId} = req.body;
        //Role logic
        if(role === 'student' && !teacherId){
            return res.status(400).json({success:false, message:'Student must have teacherId.'});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({success:false, message:'Email already exists'});

        }

        const passwordHash= await bcrypt.hash(password, 10);
        const user = new User({email, passwordHash, role, ...(role ==='student' && {teacherId})});

        await user.save();
        res.status(201).json({success:true , message:'Signup successful'});

    }
    catch(err){
        res.status(500).json({success:false, message: err.message});
    }
};

//Login
exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({success:false, message:'Invalid credentials.'});
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            return res.status(401).json({success:false, message:'Invalid credentials.'});
        }

        const token = jwt.sign({userId: user._id, role: user.role}, SECRET, {expiresIn:'1d'});
        
        // 💡 FIX: Explicitly set teacherId for teachers to their own userId, 
        // allowing them to view and share it easily on the frontend.
        const teacherIdToSend = user.role === 'teacher' ? user._id : user.teacherId;

        res.json({
            success:true, 
            token, 
            role: user.role, 
            userId: user._id, 
            teacherId: teacherIdToSend // Use the determined ID
        });
    }
    catch(err){
        res.status(500).json({success:false, message: err.message});
    }
};
