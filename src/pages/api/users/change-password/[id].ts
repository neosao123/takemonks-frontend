import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";

type Data = {
  message?: string;
  success?: boolean;
  // type error
  data?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id }).select("password");
        console.log("here in the passwords changes:", req.body.password);
        if (user.password === req.body.password) {
          const user = await Users.findByIdAndUpdate(
            id,
            { password: req.body.newPassword },
            {
              new: true,
              runValidators: true,
            }
          );
          const data1 = {
            message: "Password changed successfully!",
          };

          if (!user) {
            return res
              .status(400)
              .json({ success: false, message: "user-not-found" });
          }
          res.status(200).json({
            success: true,
            data: data1,
            message: "Password changed successfully!",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Incorrect old password, please try again",
          });
        }
        // 
      
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
