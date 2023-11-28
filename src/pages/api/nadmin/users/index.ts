import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method, headers, query } = req;
  await dbConnect();
  await runMiddleware(req, res, cors);
  switch (method) {
    case "GET":
      try {
        var newQuery = { ...query };
        delete newQuery.page;
        const skip = 10;
        const totalUsers = await Users.countDocuments({
          fullName: { $regex: query.search, $options: "i" },
        });
        const page: any = req.query.page;
        const users = await Users.find(
          {
            fullName: { $regex: query.search, $options: "i" },
          },
          null,
          {
            skip: skip * (parseInt(page) - 1 || 0),
            limit: skip,
          }
        ).sort({
          createdAt: -1,
        });
console.log(totalUsers,"here is the total record")
        res.status(200).json({
          success: true,
          data: users,
          count: Math.ceil(totalUsers / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const isAlreadyEmail = await Users.findOne({
          email: req.body.email,
        });

        if (isAlreadyEmail) {
          return res.status(400).json({
            success: false,
            message: "common:email-already-exist",
          });
        }
        const isAlreadyPhone = await Users.findOne({
          phone: req.body.phone,
        });
        if (isAlreadyPhone) {
          return res.status(400).json({
            success: false,
            message: "common:phone-already-exist",
          });
        }
        const user = await Users.create({
          ...req.body,
          fullName: req.body.name,
          password: "123456",
          status: "active",
          joined: Date.now(),
          isUserDeleted: false,
        });
        res.status(200).json({ success: true, data: user });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
      break;
    // case "DELETE":
    //   {
    //     try {
    //       const findUser = await Users.findByIdAndUpdate(
    //         req.body._id,
    //         { isUserDeleted: true },
    //         { new: true }
    //       );
    //       console.log(findUser);
    //       if (findUser) {
    //         res.status(200).json({
    //           success: true,
    //           message: "User Deleted Successfully",
    //         });
    //       } else {
    //         res.status(404).json({ success: false, message: "User Not Found" });
    //       }
    //     } catch (error) {
    //       res.status(500).json({ success: false, message: error.message });
    //     }
    //   }
    //   break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
