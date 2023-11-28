import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import productKey from "models/ProductSerialKey";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
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
    method,
    headers: { authorization },
  } = req;
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        console.log(id);

        const product = await productKey
          .findOne({
            _id: id,
          })
          .populate({ path: "productId", select: "name cover" });

        if (!product) {
          return res
            .status(400)
            .json({ success: false, message: " Product key not found " });
        }
        res.status(200).json({
          success: true,
          data: product,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: " Product find with serial Number found",
        });
      }
      break;
    case "DELETE" /* Delete a model by its ID */:
      try {
        await productKey.deleteOne({ _id: id });
        return res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        const updatedProductKey = await productKey.findOneAndUpdate(
          { _id: id },
          { ...req.body },
          { new: true }
        );
        console.log(updatedProductKey + "I am here ");
        if (!updatedProductKey) {
          return res
            .status(404)
            .json({ success: false, message: "ProductId not found" });
        }

        return res.status(200).json({ success: true, data: updatedProductKey });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
