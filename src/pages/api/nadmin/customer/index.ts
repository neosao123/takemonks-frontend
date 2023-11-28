import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Categories from "models/Categories";
import Cors from "cors";
import Users from "models/Users";
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: Number;
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

  switch (method) {
    case "GET":
      try {
        var newQuery = { ...query };
        const customers = await Users.find({});
        const total = await Users.find({}).countDocuments();
        //console.log("customer:", customers)
        res.status(200).json({ success: true, data: customers, count: total });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    // case "POST":
    //   try {
    //     await Categories.create({
    //       ...req.body,
    //       totalItems: 0,
    //     });
    //     res.status(201).json({ success: true });
    //   } catch (error) {
    //     res.status(400).json({ success: true, data: error.message });
    //   }
    //   break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
