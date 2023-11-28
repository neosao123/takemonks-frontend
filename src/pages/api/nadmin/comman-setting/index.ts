import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import commanSetting from "models/CommanSetting";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import Cors from "cors";

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
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const data = await commanSetting.find({});
        res.status(200).json({ success: true, data: data });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        const { settingId, settingName, settingValue } = req.body;
        const setting = new commanSetting({
          settingId: settingId,
          settingName: settingName,
          settingValue: settingValue,
        });
        const data = await setting.save();
        res.status(200).json({ success: true, data });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
