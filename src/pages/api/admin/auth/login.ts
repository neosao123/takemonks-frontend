import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import jwt from "jsonwebtoken";
import Cors from "cors";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  status?: boolean;
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
        const { email, password } = req.body;
        const user = await Clients.findOne({
          email: email,
          password: password,
        }).select("+password");

        if (!user) {
          res.status(404).json({
            message: "Email or Password is incorrect",
            status: false,
          });
        } else {
          // create a jwt token that is valid for 7 days
          if (user.status === "active") {
            const token = jwt.sign(
              {
                _id: user._id,
                email: user.email,
                name: user.name,
                cover: user.cover || null,
                status: user.status,
                role: user.role || "",
              },
              `secret key`,
              {
                expiresIn: "7d",
              }
            );
            res.status(200).json({
              success: true,
              token,
            });
          } else {
            res.status(200).json({
              success: false,
              message: "Your account is not active",
            });
          }
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
