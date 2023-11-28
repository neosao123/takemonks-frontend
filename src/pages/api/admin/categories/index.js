import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Categories from "models/Categories";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
    query,
  } = req;
  await dbConnect();
  const { status } = jwtDecode(authorization);
  checkStatus(res, status);
  switch (method) {
    case "GET":
      try {
        var newQuery = { ...query };
        delete newQuery.page;
        const skip = query.limit || 10;
        const totalCategories = await Categories.find({
          name: { $regex: query.search, $options: "i" },
        });
        const categories = await Categories.find(
          {
            name: { $regex: query.search, $options: "i" },
          },
          null,
          {
            skip: skip * parseInt(+query.page - 1 || 0),
            limit: skip,
          }
        ).sort({
          createdAt: -1,
        }); /* find all the data in our database */

        res.status(200).json({
          success: true,
          data: categories,
          count: Math.ceil(totalCategories.length / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        await Categories.create({
          ...req.body,
          totalItems: 0,
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
