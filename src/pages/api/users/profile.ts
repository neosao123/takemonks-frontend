import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import Orders from "models/Orders";
import jwtDecode from "jwt-decode";
import { filter } from "lodash";
import Filter from "../../../components/_main/products/filter";
// Initializing the cors middleware
type QueryParams = {
  search?: string;
  startDate?: string;
  endDate?: string;
  orderNumber?: string;
  deliveryStatus?: string;
  page?: string;
};
type Data = {
  message?: string;
  success?: boolean;
  // type error
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    headers: { authorization },
    method,
    query,
  } = req;

  await dbConnect();
  // type error
  const { _id } = jwtDecode<any>(authorization as any);
  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ _id: _id });
        const { startDate, endDate, deliveryStatus, orderNumber } =
          query as QueryParams;
        const page: any = req.query.page;
        const filters: any = {};
        if (startDate || endDate) {
          filters.createdAt = {};
          if (startDate) {
            filters.createdAt["$gte"] = new Date(startDate);
          }
          if (endDate) {
            const parsedEndDate = new Date(endDate);
            parsedEndDate.setHours(23, 59, 59, 999);
            filters.createdAt["$lte"] = parsedEndDate;
          }
        }

        if (deliveryStatus) {
          filters.status = new RegExp(deliveryStatus, "i");
        }
        if (orderNumber) {
          filters.orderNumber = new RegExp(orderNumber, "i");
        }

        const skip = parseInt("1");
        const limit = 10;

        const totalOrdersCount = await Orders.countDocuments({
          "user._id": _id,
          ...filters,
        });

        const orders = await Orders.find({ "user._id": _id, ...filters })
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: -1 });

        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({
          success: true,
          data: {
            user,
            orders,
            count: Math.ceil(totalOrdersCount / limit),
          },
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
