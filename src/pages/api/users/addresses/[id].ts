import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
interface Address {
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
  active: boolean;
  billingAddress: string;
  billingAddressField: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingCountry: string;
  _id: any; // Assuming _id is a string, you can adjust the type accordingly
}




type Data = {
  message?: string;
  success?: boolean;
  // type error
  data?: any;
  addresses?: any;
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
        console.log(req.body,"here the address")

        const {
          address,
          city,
          state,
          country,
          zip,
          phone,
          active,
          billingAddress,
          billingAddressField,
          billingCity,
          billingState,
          billingZip,
          billingCountry,
          _id,
        } = req.body; // Destructure properties from req.body
     
        let addAddress: Address = {
          address,
          city,
          state,
          country,
          zip,
          phone,
          active,
          billingAddress,
          billingAddressField,
          billingCity,
          billingState,
          billingZip,
          billingCountry,
          _id:user.addresses.length+1,
        };
                if (isActive) {
          // type error
          const filtered = user.addresses.map((v: any) => ({
            ...v,
            active: false,
          }));
          const newAddresses = [...filtered,addAddress];

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
          const newAddresses = [...user.addresses, addAddress];
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
            // type error
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
            message: "updated-address",
          });
          return;
        } else {
          const noMatched = user.addresses.filter(
            // type error
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
        // type error

        if(req.body._id){
          const filtered: any = addresses.filter(
            (v: any) => v._id != req.body._id
          );
          console.log(req.body._id, "this is");
          await Users.findByIdAndUpdate(
            id,
            { addresses: filtered },
            {
              new: true,
              runValidators: true,
            }
          );
        }
       
        res
          .status(200)
          .json({ success: true, message: "common:deleted-address" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
