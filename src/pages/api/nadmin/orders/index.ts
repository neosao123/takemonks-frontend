import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";

const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type QueryParams = {
  search?: string;
  startDate?: string;
  endDate?: string;
  productName?: string;
  deliveryStatus?: string;
  page?: string;
};

type Data = {
  success?: boolean;
  error?: string;
  data?: any;
  count?: number;
  phone?: string;
};

const MAX_RESULTS_PER_PAGE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  try {
    await runMiddleware(req, res, cors);
    await dbConnect();

    const {
      method,
      headers: { authorization },
      query,
    } = req;
    const { status } = jwtDecode<any>(authorization as any);
    checkStatus(res, status);

    switch (method) {
      case "GET":
        try {
          const {
            search,
            startDate,
            endDate,
            productName,
            deliveryStatus,
            page,
          } = query as QueryParams;
          var newQuery = { ...query };
          delete newQuery.page;

          const searchRegex = search ? { $regex: search, $options: "i" } : /.*/;
          const filters: any = {};
          let date: any = {};
          if (startDate) {
            const parsedStartDate = new Date(startDate);
            date["$gte"] = new Date(parsedStartDate);
          }
          if (endDate) {
            const parsedEndDate = new Date(endDate);
            parsedEndDate.setHours(23);
            parsedEndDate.setMinutes(59);
            parsedEndDate.setSeconds(59);
            parsedEndDate.setMilliseconds(999);
            date["$lte"] = new Date(parsedEndDate);
          }
          if (startDate || endDate) {
            filters.createdAt = date;
          }

          if (deliveryStatus) {
            filters.status = deliveryStatus;
          }
          const skip = MAX_RESULTS_PER_PAGE * (parseInt(page || "1") - 1);
          const limit = MAX_RESULTS_PER_PAGE;

          const totalOrders = await Orders.find({
            $or: [
              {
                "user.fullName": { $regex: productName, $options: "i" },
              },
              {
                "user.phone": { $regex: productName, $options: "i" },
              },
            ],
            ...filters,
          });
          const orders = await Orders.find(
            {
              $or: [
                {
                  "user.fullName": { $regex: productName, $options: "i" },
                },
                {
                  "user.phone": { $regex: productName, $options: "i" },
                },
              ],
              ...filters,
            },
            null,
            {
              skip: skip,
              limit: limit,
            }
          ).sort({
            createdAt: -1,
          });

          res.status(200).json({
            success: true,
            data: orders,
            count: Math.ceil(totalOrders.length / MAX_RESULTS_PER_PAGE),
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, error: error.message });
        }
        break;

      default:
        res
          .status(400)
          .json({ success: false, error: "Invalid request method" });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}
