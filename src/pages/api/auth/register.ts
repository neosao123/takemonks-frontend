import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";

type Data = {
  success?: boolean;
  message?: string;
  token?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      res.status(400).json({ success: false, message: "Invalid request." });

      break;
    case "POST":
      try {
        const isAlreadyEmail = await Users.findOne({
          email: req.body.email,
        });
        
        if (isAlreadyEmail) {
          return res.status(400).json({
            success: false,
            message: "Email already exist",
          });
        }

        const isAlreadyPhone = await Users.findOne({
          phone: req.body.phone,
        });
        
        if (isAlreadyPhone) {
          return res.status(400).json({
            success: false,
            message: "Phone Number already exist",
          });
        }

        const user = await Users.create({
          ...req.body,
          fullName: req.body.firstName + " " + req.body.lastName,
          status: "active",
          joined: Date.now(),
        }); /* create a new model in the database */
        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            status: user.status,
            phone: user.phone,
          },
          `security`,
          {
            expiresIn: "1d",
          }
        );
        res.status(200).json({
          success: true,
          token,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
