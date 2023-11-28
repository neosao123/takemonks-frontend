import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Clients from "models/Clients";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import { singleFileDelete } from "src/utils/uploader";
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

export default async function handler(req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    query: { id },
    method,
    headers: { authorization },
  } = req;
  //   const { status } = jwtDecode(authorization);
  //   checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "DELETE" /* Delete a model by its ID */:
      try {
        const client = await Clients.findOne({ _id: id });
        if (client?.role === "Owner") {
          res
            .status(400)
            .json({ success: false, message: "Can't delete all the roles." });
        } else {
          client?.cover?._id && (await singleFileDelete(client.cover._id));
          const deleteRole = await Clients.deleteOne({
            _id: id,
          });
          if (!deleteRole) {
            return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, message: "Deleted Success!" });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
