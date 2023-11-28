import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";
import Cors from "cors";
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
  updateOtp?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method, query } = req;
  await dbConnect();

  //   MONGO_URI="mongodb+srv://testingneosaoservices:dHTp0CGRvK8NI0Hl@cluster0.9vmhrdd.mongodb.net/?retryWrites=true&w=majority"
  // # MONGO_URI="mongodb://0.0.0.0:27017/takemonks"
  // DOMAIN="electricon.com"
  // CLOUDINARY_PUBLISHABLE_KEY="817564768646284"
  // CLOUDINARY_SECRET_KEY="4nAZurPH2FUP5BBtauH1FLVKklU"
  // CLOUDINARY_CLOUD_NAME="desnk9ize"
  // BASE_URL=https://takemonks.neosao.online
  // STRIPE_PUBLISHABLE_KEY=
  // STRIPE_SECRET_KEY=
  // EMAILJS_SERVICE_ID="service_0k7o6xi"
  // EMAILJS_TEMPLATE_ID="template_wo6ek1k"
  // EMAILJS_USER_ID="testing.neosaoservices@gmail.com"
  // PASSWORD=""
  // WHATSAPP_NUMBER=7038317038
  // SHIPPING_FEE=0
  // CURRENCY="INR"
  // CASHFREE_MODE="TEST"
  // CASHFREE_CLIENT_ID="4901049bb1d0599867dbd845b01094"
  // CASHFREE_CLIENT_SECRET="b957cacd5a8f4619073c91d7c258eddee807f289"
  // CASHFREE_URL="https://sandbox.cashfree.com/pg/orders"

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
        const usersData = await Users.find({});

        const user = usersData.find((u) => u.email === email);

        if (!user) {
          res.status(400).json({
            message: "common:user-not-found",
            status: false,
          });
        } else {
          const {
            _id,
            email: userEmail,
            fullName,
            cover,
            status,
            firstName,
          } = user;
          // create a jwt token that is valid for 7 days

          const token = jwt.sign(
            {
              _id: _id,
              email: userEmail,
              fullName: fullName,
              firstName: firstName,
              cover: cover ? cover : null,
              status: status,
            },
            `secret key`,
            {
              expiresIn: "10m",
            }
          );

          const sixDigitOTP = await generateOTP();

          const updateOtp = await Users.findOneAndUpdate(
            { _id: user._id }, 
            { $set: { otp: sixDigitOTP } }, 
            { new: true } 
          );

          const url = process.env.DOMAIN;
          var data = JSON.stringify({
            template_params: {
              to_email: email,
              from_name: "TakeMonks",
              subject: "Forget password",
              message: `Your request to reset your password was submitted. If you did not make this request, simply ignore this email. If you did make this request just click the link below:
              ${url}/reset-password?token=${updateOtp.otp}`,
              to_name: fullName,
            },
          });

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
            to: user.email,
            subject: "Forgot password",
            html: `
 <div style="color: black;">
    <p>Hello ${user.firstName} ${user.lastName},</p>
    <p>Your request to reset your password was submitted. If you did not make this request, simply ignore this email. If you did make this request, please fill in the OTP (One-Time Password) and create a new password:</p>
    <p>OTP: ${updateOtp.otp}</p>
    <p>Best regards,<br/>TAKEMONKS</p>
</div>
  `,
          };

          const mail = await transporter.sendMail(MailOptins, (error, info) => {
            if (error) {
              console.log("error:", error);
            } else {
              res.status(200).json({
                success: true,
                message: "Email sent! Please check your email!",
                updateOtp: updateOtp.email,
              });
            }
          });

          

        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}


    // service_id: process.env.EMAILJS_SERVICE_ID,
            // template_id: process.env.EMAILJS_TEMPLATE_ID,
            // user_id: process.env.EMAILJS_USER_ID,
// const url = process.env.DOMAIN;

          // var data = JSON.stringify({
          //   service_id: process.env.EMAILJS_SERVICE_ID,
          //   template_id: process.env.EMAILJS_TEMPLATE_ID,
          //   user_id: process.env.EMAILJS_USER_ID,
          //   template_params: {
          //     to_email: email,
          //     from_name: "Commercehope",
          //     subject: "Forget password",
          //     message: `Your request to reset your password was submitted. If you did not make this request, simply ignore this email. If you did make this request just click the link below:
          //     ${url}/reset-password?token=${token}`,
          //     to_name: fullName,
          //   },
          // });
          // const { email: emailUser } = user;
          // res.status(200).json({
          //   success: true,
          //   message: "common:email-sent",
          //   email: emailUser,
          //   token: token,
          // });
          // var config = {
          //   method: "post",
          //   url: "https://api.emailjs.com/api/v1.0/email/send",
          //   headers: {
          //     origin: "http://localhost",
          //     "Content-Type": "application/json",
          //   },
          //   data: data,
          // };

          // axios(config)
          //   .then(function (response) {
          //     res.status(200).json({
          //       success: true,
          //       message: "Email sent! Please check your email!",
          //     });
          //   })
          //   .catch(function (error) {
          //     res.status(400).json({
          //       success: false,
          //       message: "Something went wrong!",
          //     });
          //   });