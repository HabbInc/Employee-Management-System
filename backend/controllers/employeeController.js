import EmployeeModel from "../models/employeeModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { REGISTRATION_TEMPLATE } from "../config/emailTempletes.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {

    const {name,email,password,role } = req.body;

    const userRole = role || 'employee';

    if(!name || !email || !password ){
        return res.status(400).json({success:false, message:"All fields are required"});
    }

    try {

        const existingUser = await EmployeeModel.findOne({email});

        if(existingUser){
            return res.status(400).json({success:false, message:"User already exists"});
        }

        const companyName = "HABB.";

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new EmployeeModel({name,email,password:hashedPassword,role:userRole});

        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});

         res.cookie('token',token,{
           httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge:7*24*60*60*1000
         })

        //Sending welcome email
      
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: `Welcome, ${name}! Your POS Employee Account is Ready 🚀`,
                text: `Hello ${name},\n\nWelcome to the POS Employee Management System! 🎉\n\nYour account has been successfully created.\n\nLogin here:\nhttps://yourposapp.com/login\n\nFor support, contact: support@yourposapp.com.`,
                html: REGISTRATION_TEMPLATE(name,companyName)
            };
            
        

        await transporter.sendMail(mailOptions);

        res.status(201).json({success:true, message:"User created successfully"});



    } catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"});
        console.error(error);
    }
}

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

        res.status(200).json({success:true, message:"Login successful"});
        
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