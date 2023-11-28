import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import { singleFileDelete } from "src/utils/uploader";
import dbConnect from "lib/dbConnect";
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
        const slide = await HomeSlider.findOne({
          _id: id,
        });
        if (!slide) {
          return res
            .status(400)
            .json({ success: false, message: "Item could not found" });
        }
        res.status(200).json({
          success: true,
          data: slide,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "Category could not find." });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        await HomeSlider.findByIdAndUpdate(
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
      case "DELETE":
        try {
          await HomeSlider.deleteOne(
         {  _id: id}
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
