import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AMCS from "models/OrderwithAmcs";
import Cors from "cors";
// import emailjs from "@emailjs/nodejs";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const {
    query: { id },
    headers: { authorization },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "PUT" /* Get a model by its ID */:
      try {
        const amcs = await AMCS.findByIdAndUpdate(
          id,
          { status: req.body.status, amcExpriry: req.body.amcExpriry },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!amcs) {
          return res
            .status(400)
            .json({ success: false, message: "Item could not found" });
        }
        var templateParams;
        if (req.body.status === "rejected") {
          templateParams = {
            orderId: req.body.orderId,
            status: "Rejected",
            AMCTitle: req.body.AMCtitle,
            serialKeyValue: req.body.serialKeyValue,
            amcExpriry: "N/A",
            Message: req.body.message,
            email: req.body.email,
          };
        } else {
          templateParams = {
            orderId: req.body.orderId,
            status: "Approved",
            AMCTitle: req.body.AMCtitle,
            serialKeyValue: req.body.serialKeyValue,
            amcExpriry: req.body.amcExpriry,
            email: req.body.email,
            Message: "Congratulation!",
          };
        }
        // const serviceId = process.env.EMAILJS_SERVICE_ID_A ?? "service_e3m4jwj";
        // const templateId =
        //   process.env.EMAILJS_TEMPLATE_ID_A ?? "template_xm8a0tm";
        // const publicKey = process.env.EMAILJS_PUBLIC_KEY ?? "ex5PJoHhwxEHw6EL5";
        // const privateKey =
        //   process.env.EMAILJS_PRIVATE_KEY ?? "DUFdpz0t4RTn_07zTX_1z";
        // const response = await emailjs.send(
        //   serviceId,
        //   templateId,
        //   templateParams,
        //   {
        //     publicKey: publicKey,
        //     privateKey: privateKey,
        //   }
        // );
        res.status(200).json({ success: true });
      } catch (error) {
        console.log("Err", error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
