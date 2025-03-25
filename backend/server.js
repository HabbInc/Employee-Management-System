import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import employeeRoute from "./routes/employeeRoute.js";

import adminRoute from "./routes/adminRoute.js";
import attendanceRoute from "./routes/attendanceRoutes.js";


const app = express();
const port = process.env.PORT || 5000

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true }));

connectDB()

app.use('/employee',employeeRoute)
app.use('/admin',adminRoute)
app.use('/api/attendance', attendanceRoute)



app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })