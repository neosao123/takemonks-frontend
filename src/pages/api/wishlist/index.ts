import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Wishlist from "models/Wishlist";
import Products from "models/Products";
import JWTDecode from "jwt-decode";

interface MyToken {
  _id: string;
}

type Data = {
  success: boolean;
  message?: string;
  data?: {
    createdAt: string;
    _id: string;
    name: string;
    cover: object;
    price: number;
    priceSale: number;
    category: string;
    available: number;
    colors: any;
    sizes: any;
    likes: number;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, headers } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const uid = JWTDecode<MyToken>(headers.authorization as string)._id;
        const wishlist = await Wishlist.findOne({
          userId: uid,
        });
        const allLikedProducts = await Products.find({
          _id: {
            $in: wishlist?.wishlist || [],
          },
        }).select([
          "createdAt",
          "_id",
          "name",
          "cover",
          "price",
          "priceSale",
          "category",
          "available",
          "colors",
          "sizes",
          "likes",
        ]);

        res.status(200).json({
          success: true,
          data: allLikedProducts,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        const uid = JWTDecode<MyToken>(headers.authorization as string)._id;
        const allWishlist = await Wishlist.findOne({
          userId: uid,
        });

        const beforeFilter = allWishlist?.wishlist || [];
        const isAlready =
          beforeFilter.filter((item: string) => item === req.body.pid).length >
          0;
        const filtered = isAlready
          ? beforeFilter.filter((item: string) => item !== req.body.pid)
          : [...beforeFilter, req.body.pid];

        if (isAlready) {
          await Products.findByIdAndUpdate(req.body.pid, {
            $inc: { likes: -1 },
          });
        } else {
          await Products.findByIdAndUpdate(req.body.pid, {
            $inc: { likes: 1 },
          });
        }
        const updated = Boolean(allWishlist)
          ? await Wishlist.findOneAndUpdate(
              {
                userId: uid,
              },
              {
                wishlist: filtered,
              },
              {
                new: true,
                runValidators: true,
              }
            )
          : await Wishlist.create({
              userId: uid,
              wishlist: [req.body.pid],
            });

        const allLikedProducts = await Products.find({
          _id: {
            $in: updated?.wishlist || [],
          },
        }).select([
          "createdAt",
          "_id",
          "name",
          "cover",
          "price",
          "priceSale",
          "available",
          "category",
          "colors",
          "sizes",
          "likes",
        ]);

        res.status(200).json({
          success: true,
          data: allLikedProducts,
          message: isAlready
            ? "common:removed-from-wishlist"
            : "common:added-to-wishlist",
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
