import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import { jwtDecode } from "src/utils/jwt";
import Cors from "cors";
import Users from "models/Users";

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
      try {
        /* find all the data in our database */
        const { sub: _id } = jwtDecode<any>(req.headers.authorization as string);
        const orders = await Orders.find({ "user._id": _id });
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const user = await Users.create(
          req.body
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
