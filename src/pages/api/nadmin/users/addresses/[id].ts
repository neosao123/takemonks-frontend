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
  addresses?: any
};

export default async function handler(req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id });
        res.status(200).json({ success: true, addresses: user.addresses });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id });
        const isActive = req.body.active;
        if (isActive) {
          const filtered = user.addresses.map((v: any) => ({
            ...v,
            active: false,
          }));
          const newAddresses = [...filtered, req.body];
          const newUser = await Users.findByIdAndUpdate(
            id,
            { addresses: newAddresses },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(200).json({ success: true, data: newUser });
        } else {
          const newAddresses = [...user.addresses, req.body];
          const newUser = await Users.findByIdAndUpdate(
            id,
            { addresses: newAddresses },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(200).json({ success: true, data: newUser });
        }
        if (!user) {
          return res.status(400).json({ success: false });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id });
        if (req.body.active) {
          const oldAddresses = user.addresses.filter(
            (v: any) => v._id !== req.body._id
          );
          const filtered = oldAddresses.map((v: any) => ({
            ...v,
            active: false,
          }));
          const newAddresses = [...filtered, { ...req.body }];
          const newUser = await Users.findByIdAndUpdate(
            id,
            { addresses: newAddresses },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(200).json({
            success: true,
            data: newUser,
            message: "Address updated!",
          });
          return;
        } else {
          const noMatched = user.addresses.filter(
            (v: any) => v._id !== req.body._id
          );
          const newAddresses = [...noMatched, { ...req.body }];
          const newUser = await Users.findByIdAndUpdate(
            id,
            { addresses: newAddresses },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(200).json({ success: true, data: newUser });
        }
        // res.status(200).json({ success: true, data: filtered });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id });
        const { addresses } = user;
        const filtered = addresses?.filter((v: any) => v._id !== req.body._id);
        await Users.findByIdAndUpdate(
          id,
          { addresses: filtered },
          {
            new: true,
            runValidators: true,
          }
        );
        res.status(200).json({ success: true, message: "Address Deleted!" });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "Something went wrone!" });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
