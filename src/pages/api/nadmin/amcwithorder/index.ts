import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
import AMCModel from "models/OrderwithAmcs";
import { string } from "yup";

const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count: Number;
};
type QueryParams = {
  page?: string;
  search?: string;
};
type condition = {
  serialKey?: {};
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
    query,
  } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { page, search } = query as QueryParams;
        const limit = 10;
        let skip;
        if (page) {
          skip = +page - 1;
        } else {
          skip = 0;
        }
        const conditions: condition = {};
        if (search) {
          conditions.serialKey = { $regex: query.search, $options: "i" };
        }
        const amcRequest = await AMCModel.find({
          serialKey: { $ne: "" },
          ...conditions,
        })
          .populate({ path: "orderId", model: "Order" })
          .populate({ path: "amcId", model: "Amcs" })
          .skip(skip * 10)
          .limit(10);
        const count = await AMCModel.countDocuments({
          serialKey: { $ne: "" },
        });
        res.status(200).json({
          success: true,
          count: Math.ceil(count / 10),
          data: amcRequest,
        });
      } catch (error) {
        res.status(400).json({ success: false, count: 0, data: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, data: null, count: 0 });
      break;
  }
}
