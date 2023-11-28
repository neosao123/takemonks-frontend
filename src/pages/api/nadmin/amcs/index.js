import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Amcs from "models/Amcs";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(req, res) {
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
        var newQuery = { ...query };
        delete newQuery.page;
        const skip = query.limit || 10;

        const totalAmcs = await Amcs.find({
          title: { $regex: query.search, $options: "i" },
        });

        /* find all the data in our database */
        console.log(totalAmcs, "totals ");
        const amcs = await Amcs.find(
          {
            title: {
              $regex: "^" + query.search + ".*",
              $options: "i",
            },
          },
          null,
          {
            skip: skip * parseInt(+query.page - 1 || 0),
            limit: skip,
          }
        )
          .populate({
            path: "productId",
            $match: {
              name: {
                $regex: "^" + query.search + ".*",
                $options: "i",
              },
            },
            // select: {
            //   name: 1,
            //   cover: 1,
            // },
          })
          .sort({
            createdAt: -1,
          });
        res.status(200).json({
          success: true,
          data: amcs,
          count: Math.ceil(totalAmcs.length / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        const { productId } = req.body;
        const documents = await Amcs.find({ productId: productId });
        if (documents.length > 0) {
          res.status(400).json({
            success: true,
            data: "AMC for the selected product exits",
          });
        } else {
          await Amcs.create({
            ...req.body,
            totalItems: 0,
          });
          res.status(201).json({ success: true });
        }
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
