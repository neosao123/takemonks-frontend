import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import { singleFileUploader } from "src/utils/uploader";
import Cors from "cors";
import Email from "@mui/icons-material/Email";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: Number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { search, page } = req.query;
        const Page: any = page;
        const skip = 10;
        const clientstoshow = await Clients.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } }
          ]
        }).countDocuments();
        const clients = await Clients.find(
          {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { phone: { $regex: search, $options: "i" } }
            ]
          },
          null,
          {
            skip: skip * (parseInt(Page) - 1 || 0),
            limit: skip,
          }
        ).sort({
          createdAt: -1,
        });
        res.status(200).json({ success: true, data: clients, count: Math.ceil(clientstoshow / 10) });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;
    case "POST":
      //console.log("cover", req.body.cover)
      // const uploaded = await singleFileUploader(req.body.profile.cover);
      const client = await Clients.create({
        name: req.body.firstName + " " + req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        status: "active",
        about: "",
        cover: req.body.cover,
        password: "123456",
        gender: req.body.gender
      }); /* create a new model in the database */
      res.status(201).json({ success: true, data: client });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
