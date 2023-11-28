import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Reviews from "models/Reviews";
import Products from "models/Products";
import Orders from "models/Orders";
import Users from "models/Users";
import JWTDecode from "jwt-decode";

type Data = {
  message?: string;
  // type error
  success?: any;
  data?: any;
  uid?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const reviews = await Reviews.findById({ _id: id });
        if (!reviews) {
          return res
            .status(200)
            .json({ success: true, data: { ratings: [], reviews: [] } });
        }

        res.status(200).json({
          success: true,
          data: { ...reviews, reviews: reviews.reviews.reverse() },
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const review = req.body;
        const uniqueId = new Date().getTime;
        const isReview = await Reviews.findById(id);
        const product = await Products.findById(id);
        // type error
        const uid = JWTDecode<any>(req.headers.authorization as string)._id;
        const user = await Users.findById(uid);
        res.status(201).json({ success: true, data: user, uid: uid });

        const orders = await Orders.find({
          "user.email": user.email,
        });
        const isPurchased = orders.filter((v) =>
          // type error
          v.items.some((val: { _id: string }) => val._id === id)
        );

        await Products.findByIdAndUpdate(
          id,
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
          const existingReviewIndex = isReview.reviews.findIndex(
            (revi: any) => revi.email === user.email
          );
          if (existingReviewIndex !== -1) {
            isReview.reviews.splice(existingReviewIndex, 1);
          }
          const filtered = isReview.ratings.filter(
            (v: any) => v.name === `${review.rating} Star`
          )[0];
          const notFiltered = isReview.ratings.filter(
            (v: any) => v.name !== `${review.rating} Star`
          );

          const alreadyReview = await Reviews.findByIdAndUpdate(
            id,
            {
              ratings: [
                ...notFiltered,
                {
                  name: `${review.rating} Star`,
                  reviewCount: filtered.reviewCount + 1,
                  starCount: filtered.starCount + 1,
                },
              ],
              reviews: [
                ...isReview.reviews,
                {
                  ...review,
                  _id: uniqueId,

                  isPurchased: orders && isPurchased.length > 0 ? true : false,
                  fullName: user.fullName,
                  avatar: user.avatar ? user.avatar.url : "",
                  email: user.email,
                  createdAt: new Date().getTime(),
                },
              ],
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
              _id: id,
              ratings: [
                ...notFiltered,
                {
                  name: `${review.rating} Star`,
                  reviewCount: filtered.reviewCount + 1,
                  starCount: filtered.starCount + 1,
                },
              ],
              reviews: [
                {
                  ...review,
                  _id: uniqueId,
                  isPurchased: orders && isPurchased.length > 0 ? true : false,
                  fullName: user.fullName,
                  avatar: user.avatar ? user.avatar.url : "",
                  email: user.email,
                  createdAt: new Date().getTime(),
                },
              ],
            },
          ]);
          res.status(201).json({ success: true, data: newreview });
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
