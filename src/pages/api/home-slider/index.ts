import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import HomeSlider from "models/HomeSlider";

type Data = {
  success?: boolean;
  message?: string;
  data?: {
    cover: boolean;
    heading: string;
    description: string;
    enabled: boolean;
    btnPrimry: any;
    btnSecondary: any;
  }[];
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req.body;
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
    default:
      res.status(400).json({ success: false });
      break;
  }
}
