import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Categories from "models/SubCategories";
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
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
    query,
  } = req;
  await dbConnect();
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  switch (method) {
    case "GET":
      try {
        const categories = await Categories.find({});
        const uniqueIds: string[] = [];

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
