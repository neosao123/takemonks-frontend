import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import ProductSerialKeyModel from "models/ProductSerialKey";
import product_Schema from "models/Products";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import handler from ".";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function myhandler(req, res) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
    query,
  } = req;
  await dbConnect();
  const { status } = jwtDecode(authorization);
  checkStatus(res, status);
  switch (method) {
    case "GET":
      try {
        const { search, page, limit } = query;
        const pageInt = page ? parseInt(page) : 1;
        const skip = limit ? (pageInt - 1) * parseInt(limit) : 0;
        const total = await ProductSerialKeyModel.countDocuments();
        const productwithSerial = await ProductSerialKeyModel.find()
          .populate({ path: "productId", select: "_id name cover" })
          .limit(limit)
          .skip(skip)
          .sort({
            createdAt: -1,
          });
        console.log(productwithSerial);
        res.status(200).json({
          success: true,
          data: productwithSerial,
          count: Math.ceil(total / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const { productSerialNumber } = req.body;
        let countofInsertedRecode = 0;
        console.log(productSerialNumber);
        const collectDuplicateKeyData = [];
        for (const data of productSerialNumber) {
          console.log(data.productSerialNo);
          const documents = await ProductSerialKeyModel.find({
            productSerialNo: data.productSerialNo,
          });
          if (documents.length > 0) {
            collectDuplicateKeyData.push(data);
          } else {
            countofInsertedRecode += 1;

            await ProductSerialKeyModel.create({
              productId: data.productId,
              productSerialNo: data.productSerialNo,
              isUsed: data.isUsed,
            });
          }
        }

        res.status(200).json({
          success: true,
          dataInsertcount: countofInsertedRecode,
          duplicateData: collectDuplicateKeyData,
        });
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
