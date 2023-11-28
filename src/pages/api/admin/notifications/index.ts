import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Notifications from "models/Notifications";
import Cors from "cors";
import runMiddleware from "lib/cors";
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  notifications?: any;
  total?: any;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const page: any = req.query.page;
        const skip = page * 10;
        const notificationsTotal = await Notifications.find({}, null, {}).sort({
          createdAt: -1,
        });
        const notifications = await Notifications.find({}, null, {
          limit: skip,
        }).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({
          success: true,
          notifications: notifications,
          total: Math.ceil(notificationsTotal.length / 10),
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      await Notifications.create({
        ...req.body,
      });

      res.status(200).json({
        success: true,
        data: "Notification addedd!",
      });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
