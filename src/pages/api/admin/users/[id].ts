import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import Orders from "models/Orders";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();
  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id });
        var newQuery = { ...req.query };
        delete newQuery.page;
        const skip = 10;
        const totalOrders = await Orders.find({ "user._id": id });
        const page: any = req.query.page;
        const orders = await Orders.find(
          {
            "user._id": id,
          },
          null,
          {
            skip: skip * (parseInt(page) - 1 || 0),
            limit: skip,
          }
        ).sort({
          createdAt: -1,
        });

        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({
          success: true,
          data: {
            user,
            orders: orders,
            count: Math.ceil(totalOrders.length / skip),
          },
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const { status } = req.body;
        const emailExist = await Users.findOne({
          _id: { $ne: id },
          email: req.body.email,
        });
        if (emailExist) {
          return res
            .status(400)
            .json({ success: false, message: "email already exists!" });
        }
        const phoneExist = await Users.findOne({
          _id: { $ne: id },
          phone: req.body.phone,
        });
        if (phoneExist) {
          return res
            .status(400)
            .json({ success: false, message: "phone number already exists!" });
        }
        const user = await Users.findByIdAndUpdate(
          id,
          { ...req.body },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "No user found!" });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const findUser = await Users.findByIdAndUpdate(
          id,
          { isUserDeleted: true },
          { new: true }
        );
        console.log(findUser, "INSIDE IN THE ");
        if (!findUser) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
