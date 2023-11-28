import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import Orders from "models/Orders";
import OrdersofAmcs from "models/OrderwithAmcs";
import product from "models/Products";
import Amcs from "models/Amcs";
import jwtDecode from "jwt-decode";

type Data = {
  message?: string;
  success?: boolean;
  data?: any;
  count?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    headers: { authorization },
    method,
  } = req;

  await dbConnect();
  // type error
  const { _id } = jwtDecode<any>(authorization as any);
  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ _id: _id });
        var newQuery = { ...req.query };
        delete newQuery.page;

        const skip: any = 10;
        const totalOrders = await Orders.countDocuments({
          "user._id": _id,
          status: "delivered",
          amcsItems: { $exists: true, $not: { $size: 0 } },
        });
        console.log(totalOrders, "totalOrders");
        const page: any = req.query.page;
        const orders = await Orders.find(
          {
            "user._id": _id,
            status: "delivered",
            amcsItems: { $exists: true, $not: { $size: 0 } },
          },
          null,
          {
            skip: (page - 1 || 0) * skip,
            limit: 10,
          }
        ).sort({
          createdAt: -1,
        });

        const amcsData = [];
        // amcsData.push(totalOrders)
        for (const order of orders) {
          const data = await OrdersofAmcs.find({ orderId: order._id });
          let amcsDatas = {
            amcId: "",
            orderId: "",
            orderDate: "",
            appliedDate: "",
            expryDate: "",
            ProductName: "",
            amcsTitel: "",
            duration: "",
            serialkey: "",
            status: "",
            price: "",
          };
          for (let ja of data) {
            const amcsId = ja.amcId;
            const tempdat = await Amcs.find({ _id: amcsId });
            const proId = tempdat[0]?.productId;
            const dataofProduct = await product.findById(proId);

            amcsDatas = {
              amcId: ja._id,
              orderId: ja.orderId,
              orderDate: order.createdAt,
              appliedDate: "",
              ProductName: dataofProduct.name,
              amcsTitel: tempdat[0]?.title,
              duration: ja.duration + " " + ja.period,
              price: tempdat[0]?.price,
              serialkey: ja.serialKey,
              status: ja.status,
              expryDate: ja.amcExpriry,
            };
            amcsData.push(amcsDatas);
          }
        }

        if (!user) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({
          success: true,
          data: amcsData,
          count: Math.ceil(totalOrders / skip || 1),
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      {
        const { serialNo, amc } = req.body;
        const id = amc.amcId;
        const amcsData = await OrdersofAmcs.findByIdAndUpdate(
          id,
          { serialKey: serialNo, status: "pending", appliedAt: Date.now() },
          { new: true }
        );

        res.status(200).json({
          success: true,
          data: 1,
        });
      }
      //65290422f5a32a9cb7d1a05f
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
