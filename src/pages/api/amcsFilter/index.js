import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Amcs from "models/Amcs";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        var newQuery = { ...query };
        delete newQuery.page;
        const skip = 10;

        const totalAmcs = await Amcs.find({
          title: { $regex: query.search, $options: "i" },
        });
        const page = query.page;
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
            select: {
              name: 1,
              cover: 1,
            },
          })
          .sort({
            createdAt: -1,
          });
        const abc = {};

        res.status(200).json({
          success: true,
          data: amcs,
          count: Math.ceil(totalAmcs.length / skip),
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
