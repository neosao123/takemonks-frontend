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
    case "GET":
      res.status(400).json({ success: false, message: "Invalid request." });

      break;
    case "POST":
      try {
        const isAlreadyAdmin = await Clients.findOne({
          role: "Owner",
        });
        const isAlready = await Clients.findOne({
          email: req.body.email,
        });

        if (!isAlready && !isAlreadyAdmin) {
          const client = await Clients.create({
            ...req.body,
            status: "active",
            role: "Owner",
          }); /* create a new model in the database */
          const token = jwt.sign(
            {
              _id: client._id,
              email: client.email,
              name: client.name,
              cover: client.cover,
              status: client.status,
            },
            `secret`,
            {
              expiresIn: "7d",
            }
          );
          res.status(200).json({
            success: true,
            token,
          });
        } else {
          isAlreadyAdmin
            ? res.status(400).json({
              success: true,
              message: "Admin can create another role after login.",
            })
            : res.status(400).json({
              success: true,
              message: "Email already exists",
            });
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
