import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import Orders from "models/Orders";

type Data = {
  message?: string;
  success?: boolean;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, body, query } = req; // Destructure body and query from req

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { _id } = body; // Extract _id from the request body
        const user = await Users.findOne({ _id: _id });

        // Extract limit and page from query parameters
        const limit: number = parseInt(query.limit as string) || 10;
        const page: number = parseInt(query.page as string) || 1;

        const totalOrders = await Orders.find({
          "user._id": _id,
        });

        const skip: number = limit * (page - 1);
        const orders = await Orders.find(
          {
            "user._id": _id,
          },
          null,
          {
            skip: skip,
            limit: limit,
          }
        ).sort({
          createdAt: -1,
        });

        if (!user) {
          return res.status(400).json({ success: false });
        }
        const orderSData = [];
        for (let order of orders) {
          console.log(order.items, "orders");
          if (order.items && order.status == "delivered") {
            for (let tempdata of order.items) {
              const dataObj = {
                id: tempdata._id,
                status: order.status,
              };
              orderSData.push(dataObj);
            }
          }
        }
        res.status(200).json({
          success: true,
          data: orderSData,
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
