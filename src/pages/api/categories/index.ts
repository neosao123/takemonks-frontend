import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Categories from "models/SubCategories";

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
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
        const categories = await Categories.find({});
        const uniqueIds: any[] = [];

        const unique = categories.filter((element) => {
          const isDuplicate = uniqueIds.includes(element.parentCategory);

          if (!isDuplicate) {
            uniqueIds.push(element.parentCategory);

            return true;
          }

          return false;
        });
        /* find all the data in our database */
        const filtered = unique?.map((key) => {
          return categories?.filter(
            (v) => v.parentCategory === key.parentCategory
          );
        });

        res.status(200).json({
          success: true,
          data: filtered,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
