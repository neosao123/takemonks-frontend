import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import jwt from "jsonwebtoken";
import Cors from "cors";
import axios from "axios";
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
        const { email } = req.body;
        const usersData = await Clients.find({});

        const user = usersData.find((u: any) => u.email === email);

        if (!user) {
          res.status(400).json({
            message: "User not found.",
            status: false,
          });
        } else {
          // create a jwt token that is valid for 7 days
          const token = jwt.sign(
            {
              sub: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            },
            `secret key`,
            {
              expiresIn: 600,
            }
          );
          const url = process.env.DOMAIN;
          var data = JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_USER_ID,
            template_params: {
              to_email: user.email,
              from_name: "Commercehope",
              subject: "Forget password",
              message: `Your request to reset your password was submitted. If you did not make this request, simply ignore this email. If you did make this request just click the link below:
              ${url}/reset-password?token=${token}`,
              to_name: user.fullName,
            },
          });

          var config = {
            method: "post",
            url: "https://api.emailjs.com/api/v1.0/email/send",
            headers: {
              origin: "http://localhost",
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then(function (response) {
              res.status(200).json({
                success: true,
                message: "Email sent! Please check your email!",
              });
            })
            .catch(function (error) {
              res.status(400).json({
                success: false,
                message: "Something went wrong!",
              });
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
