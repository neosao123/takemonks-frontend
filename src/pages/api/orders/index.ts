import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import User from "models/Users";
import Products from "models/Products";
import Notifications from "models/Notifications";
import axios from "axios";
import orderwithAmcs from "models/OrderwithAmcs";
import runMiddleware from "lib/cors";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  // type error
  orderId?: any;
};
interface data1Type {
  orderNumber: string;
  paymentMethod: string;
  total: number;
  shipping: number;
  discount: number;
  subTotal: number;
  basePrice: number;
  currency: string;
  items: any[];
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    avatar: string;
    address: string;
    city: string;
    billingAddressField: string;
    state: string;
    country: string;
    billingCity: string;
    billingCountry: string;
    billingZip: string;
    billingState: string;
    zip: string;
    gst: string;
  };
  amcsItems: any[];
}

interface amcItemsType {
  _id: string;
  producttype: string;
  color: string;
  cover: string;
  name: string;
  price: number;
  priceSale: number;
  quantity: number;
  size: string;
  subTotal: string;
  sku: string;
  durationType: number;
  durationCount: number;
  amcProductId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const items = req.body.items;
        console.log(items);
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          await Products.findOneAndUpdate(
            {
              _id: item.id,
              available: { $gte: 0 },
            },
            {
              $inc: {
                available: -item.quantity,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          ).exec();
        }
        const data = req.body;
        const userId = data.user._id;
        let orderNumber = "3000";

        // Fetch the latest order based on orderDate in descending order

        const user = await User.findById(userId);
        console.log(user, "this is user");
        let latestOrder = await Orders.findOne(
          {},
          {},
          { sort: { createdAt: -1 } }
        );

        if (latestOrder) {
          const lastOrderDate = latestOrder.createdAt;
          const formattedLastOrderDate = lastOrderDate
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");

          if (formattedLastOrderDate === currentDate) {
            const lastOrderNo = parseInt(latestOrder.orderNumber.slice(-3), 10);
            if (!isNaN(lastOrderNo)) {
              orderNumber = `ORD${formattedLastOrderDate}${String(
                lastOrderNo + 1
              ).padStart(3, "0")}`;
            } else {
              // Handle the case where the last 3 digits are not a valid number
              console.error(
                "Invalid order number format:",
                latestOrder.orderNumber
              );
            }
          } else {
            // If there is no order with today's date, start a new series from 0001
            orderNumber = `ORD${currentDate}0001`;
          }
        } else {
          const currentDate = new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");
          orderNumber = `ORD${currentDate}0001`;
        }

        let data1: data1Type = {
          orderNumber: orderNumber,
          paymentMethod: data.paymentMethod,
          total: data.total,
          shipping: data.shipping,
          discount: data.discount,
          subTotal: data.subTotal,
          basePrice: data.basePrice,
          currency: data.currency,

          items: [],
          user: {
            _id: data.user._id,
            fullName: data.user.fullName,
            email: data.user.email,
            phone: data.user.phone,
            avatar: data.user.avatar,
            address: data.user.address,
            city: data.user.city,
            billingAddressField: data.user.billingAddressField,
            state: data.user.state,
            country: data.user.country,
            billingCity: data.user.billingCity,
            billingCountry: data.user.billingCountry,
            billingZip: data.user.billingZip,
            billingState: data.user.billingState,
            zip: data.user.zip,
            gst: user?.gst || "",
          },
          amcsItems: [],
        };

        const itemsa: any = [];
        for (let amcs of data.amcsItems) {
          if (amcs.priceofAmcs) {
            const amcsDatas: amcItemsType = {
              _id: amcs.id,
              producttype: "amc",
              color: "",
              cover: amcs.priceofAmcs.cover,
              name: amcs.priceofAmcs.title,
              price: amcs.priceSale,
              priceSale: amcs.priceSale,
              quantity: amcs.quantity,
              size: "",
              subTotal: Number(amcs.priceSale * amcs.quantity).toFixed(2),
              sku: amcs.sku,
              durationType: amcs.priceofAmcs.durationType,
              durationCount: amcs.priceofAmcs.durationCount,
              amcProductId: amcs.priceofAmcs.productId,
            };
            data1.amcsItems.push(amcsDatas);
            itemsa.push(amcsDatas);
          } else {
            const amcsDatas: amcItemsType = {
              _id: amcs.id,
              producttype: "amc",
              color: "",
              cover: amcs.cover,
              name: amcs.name,
              price: amcs.priceSale,
              priceSale: amcs.priceSale,
              quantity: amcs.quantity,
              size: "",
              subTotal: Number(amcs.priceSale * amcs.quantity).toFixed(2),
              sku: amcs.sku,
              durationType: amcs.durationType,
              durationCount: amcs.durationCount,
              amcProductId: amcs.productId,
            };
            data1.amcsItems.push(amcsDatas);
            itemsa.push(amcsDatas);
          }
        }

        for (let item1 of data.items) {
          const itemsDatas: any = {
            _id: item1.id,
            producttype: "product",
            color: item1.color,
            cover: item1.cover,
            name: item1.name,
            price: item1.price,
            priceSale: item1.priceSale,
            quantity: item1.quantity,
            size: item1.size,
            subTotal: item1.subTotal,
            sku: item1.sku,
            durationType: "",
            durationCount: "",
          };
          data1.items.push(itemsDatas);
        }

        const orderCreated = await Orders.create({
          ...data1,
          status: "pending",
        });

        if (itemsa.length > 0) {
          for (let j = 0; j < itemsa.length; j++) {
            const item = itemsa[j];
            for (let i = 1; i <= item.quantity; i++) {
              const amc = new orderwithAmcs({
                orderId: orderCreated._id,
                amcId: item._id,
                createdAt: Date.now(), // Add parentheses to invoke Date.now as a function
                duration: item.durationCount,
                period: item.durationType,
              });
              try {
                await amc.save();
              } catch (error) {
                console.error("Error saving AMC:", error);
              }
            }
          }
        }

        // const orderCreated = await Orders.create({
        //   ...req.body,
        //   createdAt: Date.now(),
        //   user: {
        //     ...req.body.user,
        //     fullName:
        //       req.body.user.fullName ||
        //       req.body.user.firstName + " " + req.body.user.lastName,
        //   },
        //   status: "pending",
        // });
        await Notifications.create({
          opened: false,
          title: `<b>${req.body.user.fullName}</b> is placed an order from ${req.body.user.city}.`,
          paymentMethod: req.body.paymentMethod,
          orderId: orderCreated._id,
          avatar: req.body.user?.avatar?.url || "",
          createdAt: Date.now(),
        });
        const newName =
          req.body.user.fullName ||
          req.body.user.firstName + " " + req.body.user.lastName;

        var data2 = JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_USER_ID,
          template_params: {
            to_email: req.body.user.email,
            from_name: "Commercehope",
            message: `Thanks ${newName} for placing an order. https://app.commercehope.com/orders/${orderCreated._id}`,
            to_name: newName,
            subject: "You have created a order at COMMERCEHOPE.!",
          },
        });
        res.status(200).json({
          success: true,
          message: "order-placed",
          orderId: orderCreated._id,
        });
        // var config = {
        //   method: "post",
        //   url: "https://api.emailjs.com/api/v1.0/email/send",
        //   headers: {
        //     "Content-Type": "application/json",
        //     origin: "http://localhost",
        //   },
        //   data: data,
        // };

        // axios(config)
        //   .then(function (response) {
        //     res.status(200).json({
        //       success: true,
        //       message: "Order placed! Please check your email!",
        //       orderId: orderCreated._id,
        //     });
        //   })
        //   .catch(function (error) {
        //     res.status(400).json({
        //       success: false,
        //       message: "Something went wrong!",
        //     });
        //   });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
