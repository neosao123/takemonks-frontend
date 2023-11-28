import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Categories from "models/SubCategories";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import { paramCase } from "change-case";
import type { NextApiRequest, NextApiResponse } from "next";
import Amcs from "models/Amcs";
import product from "src/redux/slices/product";
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
    method,
    headers: { authorization },
    query,
  } = req;
  await dbConnect();
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);

  switch (method) {
    case "GET":
      try {
        // // Run the middleware
        var newQuery = { ...query };
        delete newQuery.page;
        const skip = 10;
        const totalProducts = await Products.countDocuments({
          name: { $regex: query.search, $options: "i" },
        });
        const page: any = req.query.page;
        const products = await Products.find(
          {
            name: { $regex: query.search, $options: "i" },
          },
          null,
          {
            skip: skip * (parseInt(page) - 1 || 0),
            limit: skip,
          }
        )
          .select([
            "_id",
            "cover",
            "price",
            "priceSale",
            "totalRating",
            "totalReview",
            "status",
            "available",
            "createdAt",
            "name",
            "isFeatured",
            'operatingSystem',
            'osArchitecture',
            'ramType',
            'ramCapacity',
            'storageType',
            'storageCapacity',
            'processor',
            'processorBrand',
            'processorGeneration',
            'clockSpeed',
            'ramFrequency',
            'cacheMemory',
            'graphicsProcessor',
            'numberOfCores',
            'usbPorts',
            'hdmiPorts',
            'micIn',
            'ethernetPort',
            'typeCPort',
            'touchScreen',
            'screenSize',
            'screenResolution',
            'screenType',
            'speakers',
            'internalMic',
            'soundProperties',
            'wirelessLan',
            'bluetooth',
            'weight',
            'dimensions',
            'salesPackage'
          ])
          .sort({
            createdAt: -1,
          })
          .exec(); /* find all the data in our database */

        const productIdArray = products.map((product) => product._id.toString());

        const productAmcs = await Amcs.find({ productId: { $in: productIdArray } }).select(["_id", "productId", "price", "durationType", "durationCount"]).exec();

        //console.log(productAmcs);

        for (let i = 0; products.length > i; i++) {
          const productId = products[i]._doc._id.toString();
          for (let j = 0; productAmcs.length > j; j++) {
            const amcProductId = productAmcs[j]._doc.productId.toString();
            if (amcProductId === productId) {
              products[i]._doc.productAmc = productAmcs[j];
            }
          }
        }

        res.status(200).json({
          success: true,
          data: products,
          count: Math.ceil(totalProducts / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {

        let productImages = req.body.images;
        let images = [];
        if (productImages !== null && productImages.length > 0) {
          images = productImages.map((v: any) => ({
            url: v.url,
            _id: v._id,
          }));
        }

        // const allCategories = await Categories.find({});
        // const filteredCategory = allCategories.find(
        //   (v) => v.name === req.body.category
        // );
        // await Categories.findByIdAndUpdate(filteredCategory._id, {
        //   $inc: { totalItems: 1 },
        // });

        // console.log("All Categories", allCategories);

        const category = await Categories.findOneAndUpdate({ name: req.body.category }, {
          $inc: { totalItems: 1 },
        }, { new: true });

        //console.log("Single Category", category);

        const dataProduct = {
          ...req.body,
          images: images,
          cover: images[0].url,
          totalRating: 0,
          likes: 0,
          totalReview: 0,
          ratings: [
            {
              name: "1 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "2 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "3 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "4 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "5 Star",
              starCount: 0,
              reviewCount: 0,
            },
          ],
        };

        //console.log(dataProduct);

        const product = await Products.create(dataProduct);
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
