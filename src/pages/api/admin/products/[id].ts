import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import { paramCase } from "change-case";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import { multiFilesDelete } from "src/utils/uploader";
import type { NextApiRequest, NextApiResponse } from "next";
import Amcs from "models/Amcs";
import { filter } from "lodash";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
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
        const products = await Products.find({});
        const filtered = products.filter((v) => paramCase(v.name) === id)[0];
        const productAmc = await Amcs.findOne({ productId: filtered._id }).select(["_id", "productId", "price", "durationType", "durationCount"]).exec();
        if (productAmc) {
          filtered._doc.productAmc = productAmc;
        }
        if (!filtered) {
          return res
            .status(400)
            .json({ success: false, message: "Item could not found" });
        }
        res.status(200).json({ success: true, data: filtered });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Get a model by its ID */:
      try {
        const images = req.body?.images?.map((v: any) => ({
          url: v.url,
          _id: v._id,
        }));

        const updated = await Products.findByIdAndUpdate(
          id,                                               
          {
            ...req.body,
            ...(images && {
              cover: images[0].url,
              images: images,
            }),
          },
          {
            new: true,
            runValidators: true,
          }
        );
        res.status(200).json({ success: true, data: updated });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const product = await Products.findOne({ _id: id });
        await multiFilesDelete(product.images);
        const deleteProduct = await Products.deleteOne({
          _id: id,
        });
        if (!deleteProduct) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, message: "Deleted Success!" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
