import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Reviews from "models/Reviews";
import Products from "models/Products";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: any;
  message?: string;
  data?: any;
  count?: number
  token?: any;
};

export default async function handler(req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const reviews = await Reviews.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: reviews });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { _id, review } = req.body;
        const isReview = await Reviews.findOne({ _id: _id });
        const product = await Products.findOne({ _id: _id });
        await Products.findByIdAndUpdate(
          _id,
          {
            totalReview: product.totalReview + 1,
            totalRating: product.totalRating + review.rating,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        if (isReview) {
          const filtered = isReview.ratings.filter(
            (v: any) => v.name === `${review.rating} Star`
          )[0];
          const notFiltered = isReview.ratings.filter(
            (v: any) => v.name !== `${review.rating} Star`
          );

          const alreadyReview = await Reviews.findByIdAndUpdate(
            _id,
            {
              ratings: [
                ...notFiltered,
                {
                  name: `${review.rating} Star`,
                  reviewCount: filtered.reviewCount + 1,
                  starCount: filtered.starCount + 1,
                },
              ],
              reviews: [...isReview.reviews, { ...review }],
            },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(201).json({ success: "true", data: alreadyReview });
        } else {
          const ratingData = [
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
          ];
          const filtered = ratingData.filter(
            (v) => v.name === `${review.rating} Star`
          )[0];
          const notFiltered = ratingData.filter(
            (v) => v.name !== `${review.rating} Star`
          );
          const newreview = await Reviews.create([
            {
              _id: _id,
              ratings: [
                ...notFiltered,
                {
                  name: `${review.rating} Star`,
                  reviewCount: filtered.reviewCount + 1,
                  starCount: filtered.starCount + 1,
                },
              ],
              reviews: [{ ...review }],
            },
          ]);
          res.status(201).json({ success: "true", data: newreview });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
