import { sentenceCase } from "change-case";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import _ from "lodash";
export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();
  switch (method) {
    case "GET":
      try {
        // // Run the middleware
        var newQuery = { ...query };
        delete newQuery.page;
        delete newQuery.prices;
        delete newQuery.sizes;
        delete newQuery.colors;
        delete newQuery.name;
        delete newQuery.date;
        delete newQuery.price;
        delete newQuery.top;
        delete newQuery.category;
        delete newQuery.unit;
        for (const [key, value] of Object.entries(newQuery)) {
          newQuery = { ...newQuery, [key]: value.split("_") };
        }
        const skip = query.limit || 12;
        const totalProducts = await Products.countDocuments({
          ...newQuery,
          ...(query.sizes && { sizes: { $in: query.sizes.split("_") } }),
          ...(query.colors && { colors: { $in: query.colors.split("_") } }),
          ...(query.category && {
            category: {
              $regex: sentenceCase(query.category),
              $options: "i",
            },
          }),

          priceSale: {
            $gt: query.prices ? query.prices.split("_")[0] : 1,
            $lt: query.prices ? query.prices.split("_")[1] : 1000000,
          },
          status: { $ne: "disabled" },
        }).select([""]);
        const products = await Products.find(
          {
            ...newQuery,
            ...(query.sizes && { sizes: { $in: query.sizes.split("_") } }),
            ...(query.colors && { colors: { $in: query.colors.split("_") } }),
            ...(query.category && {
              category: {
                $regex: sentenceCase(query.category),
                $options: "i",
              },
            }),
            priceSale: {
              $gt: query.prices
                ? Number(query.prices.split("_")[0]) / Number(query.unit)
                : 1,
              $lt: query.prices
                ? Number(query.prices.split("_")[1]) / Number(query.unit)
                : 10000000,
            },
            status: { $ne: "disabled" },
          },
          null,
          {
            skip: skip * parseInt(query.page ? query.page[0] - 1 : 0),
            limit: skip,
          }
        ).sort({
          ...((query.date && { createdAt: query.date }) ||
            (query.price && { priceSale: query.price }) ||
            (query.name && { name: query.name }) ||
            (query.top && { totalRating: query.top })),
        });
        /* find all the data in our database */
        res.status(200).json({
          success: true,
          data: products,
          total: totalProducts,
          count: Math.ceil(totalProducts / skip),
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
