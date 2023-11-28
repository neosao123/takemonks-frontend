import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import { Message } from "emailjs";
type Data = {
  message?: string;
  success?: boolean;
  // type error
  data?: any;
  token?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    headers: { authorization },
    method,
  } = req;

  await dbConnect();
  // type error
  const { _id } = jwtDecode<any>(authorization as any);
  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ _id: _id });
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
const userData=await Users.findById({_id:_id})

if(userData.phone ==req.body.phone){
  return res.status(200).json({ success: true });
}


const updated = await Users.findByIdAndUpdate(
          { _id: _id },
          {
            ...req.body,
          }
        );

        if (!updated) {
          return res.status(400).json({ success: false });
        }

        const token = await jwt.sign(
          {
            _id: _id,
            email: updated.email,
            fullName: req.body.fullName,
            avatar: req.body.avatar,
          },
          `security`,
          {
            expiresIn: "7d",
          }
        );
        res.status(200).json({ success: true, token });
        return;
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
