import type { NextApiRequest, NextApiResponse } from "next";
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
    query: { id },
    method,
    headers: { authorization },
  } = req;
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const category = await Categories.findOne({
          _id: id,
        });
        if (!category) {
          return res
            .status(400)
            .json({ success: false, message: "Item could not found" });
        }
        res.status(200).json({
          success: true,
          data: category,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "Category could not find." });
      }
      break;
    case "DELETE" /* Delete a model by its ID */:
      try { 
        await Categories.deleteOne({ _id: id });
        return res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT" /* Edit a model by its ID */:
      try {
        await Categories.findByIdAndUpdate(
          id,
          {
            ...req.body,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
