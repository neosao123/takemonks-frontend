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
  // type error
  notifications?: {
    opened: boolean;
    title: string;
    orderId: string;
    avatar: string;
    city: string;
    paymentMethod: string;
    createdAt: any;
  }[];
  total?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method, query } = req.body;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const notifications = await Notifications.find({}, null, {}).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({
          success: true,
          notifications,
          total: notifications.length,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
