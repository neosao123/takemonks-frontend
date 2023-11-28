import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
  token?: any;
};
export default async function handler(req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      const clients = await Clients.find({});
      res.status(200).json({
        success: true,
        data: clients,
      });
      break;
    case "POST":
      try {
        const isAlready = await Clients.findOne({
          email: req.body.email,
        });

        if (!isAlready) {
          await Clients.create({
            ...req.body,
            status: "active",
          }); /* create a new model in the database */
          res.status(200).json({
            success: true,
            message: "Added successfully!",
          });
        } else {
          res.status(400).json({
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
