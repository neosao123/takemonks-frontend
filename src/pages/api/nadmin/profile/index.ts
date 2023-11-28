import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import { singleFileDelete } from "src/utils/uploader";
import Cors from "cors";
import { checkStatus } from "src/utils/checkStatus";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
  token?: any;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    headers: { authorization },
    method,
  } = req;
  const { status, _id } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const client = await Clients.findOne({ _id: _id });
        if (!client) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: client });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const updated = await Clients.findByIdAndUpdate(
          { _id: _id },
          { ...req.body }
        );
        if (!updated) {
          return res.status(400).json({ success: false });
        }
        const token = await jwt.sign(
          {
            _id: updated._id,
            email: req.body.email,
            name: req.body.name,
            cover: req.body.cover,
            status: req.body.status,
          },
          `security`,
          {
            expiresIn: "7d",
          }
        );
        res.status(200).json({ success: true, token });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedUser = await Clients.findByIdAndDelete(_id);
        if (!deletedUser) {
          return res.status(400).json({ success: false });
        }
        await singleFileDelete(deletedUser.profile.cover._id);
        res.status(200).json({ success: true, data: deletedUser });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
