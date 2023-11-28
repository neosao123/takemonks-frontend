import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import OrderwithAmcs from "models/OrderwithAmcs";
import Notifications from "models/Notifications";
type Data = {
  success?: boolean;
  message?: string;
  // type error
  orderId?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        console.log(
          "I am inside in the orderAmcs to  check where api hit or not hitting ********************* ",
          req.body
        );
        // const orderCreated = await OrderwithAmcs.create({
        //   ...req.body,
        //   user: {
        //     ...req.body.user,
        //     fullName:
        //       req.body.user.fullName ||
        //       req.body.user.firstName + " " + req.body.user.lastName,
        //   },
        //   status: "pending",

        // })
        const orderData = req.body; // Request body should contain the order data
        const order = new OrderwithAmcs(orderData);
        const savedOrder = await order.save();
        // const orderCreated = await Orders.create({
        //   ...req.body,
        //   createdAt: Date.now(),
        //   user: {
        //     ...req.body.user,
        //     fullName:
        //       req.body.user.fullName ||
        //       req.body.user.firstName + " " + req.body.user.lastName,
        //   },
        //   status: "pending",
        // });
        console.log(
          "I am inside in the orderAmcs to  check where api hit or not hitting ",
          savedOrder._id
        );
        res.status(200).json({
          success: true,
          message: "order-placed",
          orderId: savedOrder._id,
        });

        // await Notifications.create({
        //   opened: false,
        //   title: `<b>${req.body.user.fullName}</b> is placed an order from ${req.body.user.city}.`,
        //   paymentMethod: req.body.paymentMethod,
        //   orderId: orderCreated._id,
        //   avatar: req.body.user?.avatar?.url || "",
        //   createdAt: Date.now(),
        // });
        // const newName =
        //   req.body.user.fullName ||
        //   req.body.user.firstName + " " + req.body.user.lastName;

        // var data = JSON.stringify({
        //   service_id: process.env.EMAILJS_SERVICE_ID,
        //   template_id: process.env.EMAILJS_TEMPLATE_ID,
        //   user_id: process.env.EMAILJS_USER_ID,
        //   template_params: {
        //     to_email: req.body.user.email,
        //     from_name: "Commercehope",
        //     message: `Thanks ${newName} for placing an order. https://app.commercehope.com/orders/${orderCreated._id}`,
        //     to_name: newName,
        //     subject: "You have created a order at COMMERCEHOPE.!",
        //   },
        // });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
