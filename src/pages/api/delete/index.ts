import type { NextApiRequest, NextApiResponse } from "next";
import { singleFileDelete } from "src/utils/uploader";
import emailjs from "@emailjs/browser";
type Data = {
  success?: boolean;
  message?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    body: { _id },
    method,
  } = req.body;
  switch (method) {
    case "DELETE" /* Get a model by its ID */:
      try {
        console.log(_id, "Here the deletedId");
        const result = await singleFileDelete(_id);
        res.status(200).json({ success: true, message: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
