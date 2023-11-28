import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Reviews from "models/Reviews";

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
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const reviews = await Reviews.find({}, null, {
          limit: 1,
        }).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: reviews });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
