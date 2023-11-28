import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import runMiddleware from "lib/cors";
import HomeSlider from "models/HomeSlider";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
  } = req;
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const slides = await HomeSlider.find({}).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: slides });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        await HomeSlider.create({
          ...req.body,
        });
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
