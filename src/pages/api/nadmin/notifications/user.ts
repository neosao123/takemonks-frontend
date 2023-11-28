import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Notifications from "models/UserNotifications";
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
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method, query } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const notifications = await Notifications.find({}, null, {}).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({
          success: true,
          notifications: notifications,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      await Notifications.create({
        ...req.body,
        createdAt: new Date().getTime(),
      });

      res.status(200).json({
        success: true,
        data: "Notification added!",
      });
      break;
    case "PUT":
      const _id: any = req.query.id;
      await Notifications.findOneAndUpdate(
        _id,
        {
          ...req.body,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        success: true,
        data: "Notification updated!",
      });
      break;
    case "DELETE":
      await Notifications.deleteOne({ _id: query.id });

      res.status(200).json({
        success: true,
        data: "Notification deleted!",
      });
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
