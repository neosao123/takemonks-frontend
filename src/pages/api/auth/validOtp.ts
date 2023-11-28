import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";
import Cors from "cors";
import nodemailers from "nodemailer";
import { Query } from "react-query";
import { paramCase } from "change-case";
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
        const data = req.body;

        const users = await Users.find({});
        const user = users.find((u: any) => u.email === data.email);
        if (user.otp == data.otp) {
          res.status(200).json({ success: true });
        } else {
          res.status(200).json({ success: false });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const data = req.body;
      
        const users = await Users.find({});
        const user = users.find((u: any) => u.email === data.email);
        const userid = await Users.findByIdAndUpdate(
          user._id,
          { password: data.pass },
          { new: true }
        );
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
    default:
      res.status(400).json({ success: false });
      break;
  }
}
