import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Clients";
import jwt from "jsonwebtoken";
import Cors from "cors";
import axios from "axios";
import nodemailers from "nodemailer";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  status?: boolean;
  email?: string;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "POST":
 try{
    const data = req.body;

        const users = await Users.find({});
        const user = users.find((u: any) => u.email === data.email);
        if (user.otp == data.otp) {
          res.status(200).json({ success: true,message:"OTP is valid. Proceed with the next steps." });
        } else {
          res.status(200).json({ success: false,message:"Invalid OTP. Please try again." });
        }

 }catch(error) {
    res.status(400).json({ success: false ,message:error});
  }
  case "PUT":
    try {
      const data = req.body;
    
      const users = await Users.find({});
      const user = users.find((u: any) => u.email === data.email);
      if(!user){
        res.status(400).json({ success: true ,message:"User Not Found"});
      }
      const userid = await Users.findByIdAndUpdate(
        user._id,
        { password: data.password },
        { new: true }
      );
      res.status(200).json({ success: true ,message:"Password updated successfully"});
    } catch (error) {
      res.status(400).json({ success: false });
    }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
