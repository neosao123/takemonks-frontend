import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
type Data = {
  success?: boolean;
  message?: string;
  // type error
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    body: { query },
  } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const products = await Products.find(
          {
            name: {
              $regex: query,
              $options: "i",
            },
            status: { $ne: "disabled" },
          },
          null,
          { limit: 10 }
        ).select(["name", "priceSale", "cover", "_id", "category"]);
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "GET":
      res.status(400).json({ success: false });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
