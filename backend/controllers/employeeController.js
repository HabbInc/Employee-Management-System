import EmployeeModel from "../models/employeeModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



//complete Registration Controller

export const completeRegistration = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ success: false, message: "Invalid request" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if user exists
        const user = await EmployeeModel.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Registration completed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Invalid or expired token" });
    }
};

//Login User Controller
export const login = async (req, res) => {

    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({success:false, message:"Email and Password are required"});
    }

    try {

        const employee = await EmployeeModel.findOne({email});
   

        if(!employee){
            return res.status(400).json({success:false, message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password,employee.password);


        if(!isMatch){
            return res.status(400).json({success:false, message:"Incorrect Password"});
        }

        const token = jwt.sign({id:employee._id},process.env.JWT_SECRET,{expiresIn:"7d"});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000
        })

        res.status(200).json({success:true, message:"Login successful",token});
        
    } catch (error) {
        res.status(500).json({success:false, message:"Login Failed..."});
    }
}


export const logout = async (req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({success:true, message:"Logged Out..."});
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
}

//Profile Controller

export const profile = async (req,res) =>{

    try {

        const userId = req.userId

        const employee = await EmployeeModel.findById(userId).select("-password");

        if(!employee){
            return res.status(400).json({success:false, message:"User does not exist"});
        }

        return res.status(200).json({success:true, employee});
        
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }

}

//Update User Profile Controller
export const updateProfile = async (req,res) =>{
    
   try {
    const userId = req.userId

    const {name,email,phone,address} = req.body;
    const image = req.file ? req.file.path : null;

    const updatedUser = await EmployeeModel.findByIdAndUpdate(
        userId,
        {name,email,image,phone,address},
        {new:true}
    ).select("-password");

    if(!updatedUser){
        return res.status(400).json({success:false, message:"User does not exist"});
    }

    return res.status(200).json({success:true, employee:updatedUser});
   } catch (error) {
    return res.status(500).json({success:false, message:error.message});
   }

}