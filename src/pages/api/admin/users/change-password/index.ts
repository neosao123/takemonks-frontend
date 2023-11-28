import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import Cors from "cors";
import { checkStatus } from "src/utils/checkStatus";
import type { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
};


export default async function handler(req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    headers: { authorization },
    method,
  } = req;
  const { _id: clientId, status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const client = await Clients.findOne({
          clientId: clientId,
        }).select("password");
        if (client.password === req.body.password) {
          const updated = await Clients.findOneAndUpdate(
            { clientId: clientId },
            { "password": req.body.newPassword },
            {
              new: true,
              runValidators: true,
            }
          );
          if (!updated) {
            return res
              .status(400)
              .json({ success: false, message: "User not found!" });
          }
          res.status(200).json({ success: true, message: "Password changed successfully!" });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Incorrect old password try again" });
        }

        res.status(200).json({ success: true, data: client });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
