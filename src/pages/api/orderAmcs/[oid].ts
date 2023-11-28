import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Orders from "models/OrderwithAmcs";
import { differenceInMinutes } from "date-fns";

type Data = {
  success?: boolean;
  message?: string;
  // type error
  data?: any;
  total?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    query: { oid },
  } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        console.log("here i am to checking a flow  of a order[id]", oid);
        const orderCreated = await Orders.find({ orderId: oid });

        res.status(200).json({
          success: true,
          data: orderCreated,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
