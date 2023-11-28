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
        const conditions:any={};
        if(query.search){
            conditions["fullName"]={$regex:".*"+query.search+".*",$options:"i"}
        }
        const totalUsers = await Users.find(conditions);
        const page: any = req.query.page;
        const pageNumber = parseInt(page) - 1 || 0;
        const skip = pageNumber * 10;
        const searchText = query.search;
        const users = await Users.find(
          {
            ...conditions
          },
          null,
          {
            skip: skip,
            limit: 10,
          }
        ).sort({
          createdAt: -1,
        });


        res.status(200).json({
          success: true,
          data: users,
          count: Math.ceil(totalUsers.length / 10),
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
            message: "Email Already Exist",
          });
        }
        const isAlreadyPhone = await Users.findOne({
          phone: req.body.phone,
        });
        if (isAlreadyPhone) {
          return res.status(400).json({
            success: false,
            message: "Phone Already Exist",
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
