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
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method } = req.body;

  await dbConnect();

  switch (method) {
    case "POST":
      await Newsletter.create({
        ...req.body,
        createdAt: new Date().getTime(),
      });

      res.status(200).json({
        success: true,
        message: "common:newsletter-added",
      });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
