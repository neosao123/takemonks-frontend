import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Newsletter from "models/Newsletter";
import Cors from "cors";
import runMiddleware from "lib/cors";
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const skip = 10;
        const NewsletterTotal = await Newsletter.find({}, null, {}).sort({
          createdAt: -1,
        });
        const page: any = req.query.page;
        const data = await Newsletter.find({}, null, {
          skip: skip * (parseInt(page) - 1 || 0),
          limit: skip,
        }).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({
          success: true,
          data: data,
          count: Math.ceil(NewsletterTotal.length / 10),
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
