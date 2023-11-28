import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import users from "models/Clients";
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
  try {
    const generateOTP = () => {
      const digits = "0123456789";
      let OTP = "";
      for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      return OTP;
    };

    const { email } = req.body;
    const usersData = await users.find({});
    const user = usersData.find((u) => u.email === email);
    console.log("email",email,user)

    if (!user) {
      res.status(400).json({
        message: "common:user-not-found",
        status: false,
      });
    } else {
      // create a jwt token that is valid for 7 days

      // const token = jwt.sign(
      //   {
      //     _id: _id,
      //     email: userEmail,
      //     fullName: fullName,
      //     firstName: firstName,
      //     cover: cover ? cover : null,
      //     status: status,
      //   },
      //   `secret key`,
      //   {
      //     expiresIn: "10m",
      //   }
      // );

      const sixDigitOTP = await generateOTP();
      const updateOtp = await users.findByIdAndUpdate(
        { _id: user._id }, 
        { $set: { otp: sixDigitOTP } }, 
        { new: true } 
        );
        console.log()
        console.log(updateOtp,"here is a otp")

      // const url = process.env.DOMAIN;
      // var data = JSON.stringify({
      //   template_params: {
      //     to_email: email,
      //     from_name: "TakeMonks",
      //     subject: "Forget password",
      //     message: `Your request to reset your password was submitted. If you did not make this request, simply ignore this email. If you did make this request just click the link below:
      //     ${url}/reset-password?token=${updateOtp.otp}`,
      //     to_name: fullName,
      //   },
      // });

      const transporter = nodemailers.createTransport({
        host: "smtpout.secureserver.net",
        port: 587,
        secure: false,
        debug:true,
        auth: {
          user: "support@indiansabroad.online",
          pass: "#Exponate23",
        },
        tls: {
          rejectUnauthorized: false, 
        },
      });

      const MailOptins: any = {
        from: "support@indiansabroad.online",
        to:user.email,
        subject: "Forgot password",
        html: `
<div style="color: black;">
<p>Hello ${user.name} ,</p>
<p>Your request to reset your password was submitted. If you did not make this request, simply ignore this email. If you did make this request, please fill in the OTP (One-Time Password) and create a new password:</p>
<p>OTP: ${updateOtp.otp}</p>
<p>Best regards,<br/>TAKEMONKS</p>
</div>
`,
      };

       transporter.sendMail(MailOptins, (error, info) => {
        if (error) {
          console.log("error:", error);
        } else {
          res.status(200).json({
            success: true,
            message: "Email sent! Please check your email!",
    
          });
        }
      });

      

    }
  } catch (error) {
    res.status(400).json({ success: false ,message:error});
  }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
