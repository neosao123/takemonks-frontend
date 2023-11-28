import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Users from "models/Users";
import Products from "models/Products";

import Cors from "cors";
import { isValidToken } from "src/utils/jwt";
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
export default async function handler(req, res) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
  } = req;
  const isValid = isValidToken(authorization);
  // checkStatus(res, status);
  !isValid &&
    res
      .status(400)
      .json({ success: false, data: null, message: "Invalid token" });
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        function getDaysInMonth(month, year) {
          return new Date(year, month, 0).getDate();
        }

        function getLastWeeksDate() {
          const now = new Date();
          return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        }

        const users = await Users.find({
          // createdAt: { $gte: startOfToday },
        }).select("createdAt");

        const totalProducts = await Products.countDocuments({});

        const lastYearDate = new Date(
          `${new Date().getFullYear - 1}-12-31`
        ).getTime();
        const todayDate = new Date().getTime();
        const ordersByYears = await Orders.find({
          createdAt: { $gt: lastYearDate, $lt: todayDate },
        }).select(["createdAt", "status", "basePrice"]);
        // const ordersForDaily = await Orders.find({
        //   createdAt: { $gt: lastYearDate, $lt: todayDate },
        //   status: { $ne: "returned" ,$ne: "cancelled",$ne:"in transit",$ne:"shipped"}
        // }).select(["createdAt", "status", "basePrice"]);

        const ordersForDaily = await Orders.find({
          createdAt: { $gt: lastYearDate, $lt: todayDate },
          status: { $in: ["delivered", "pending"] }
        }).select(["createdAt", "status", "basePrice"]);
        const dataforSaleReport = await Orders.find({
          createdAt: { $gt: lastYearDate, $lt: todayDate },
          status: { $in: ["delivered"] }
        }).select(["createdAt", "status", "basePrice"]);
        
        console.log(ordersForDaily.length,"here is a length")

        function getOrdersReport() {
          const getDays = dataforSaleReport?.map(
            (v) => new Date(v.createdAt).getMonth() + 1
          );
// console.log(getDays)
          const getData = [...new Array(12)].map(
            (day, i) => getDays?.filter((v) => v === 1 + i).length
          );
          return getData;
        }

        function getIncomeReport(prop) {
          const newData = ordersForDaily.filter((item) => {
            return prop === "year"
              ? item
              : prop === "week"
              ? new Date(item.createdAt).getMonth() === new Date().getMonth() &&
                new Date(item.createdAt).getTime() >
                  getLastWeeksDate().getTime()
              : new Date(item.createdAt).getMonth() === new Date().getMonth();
          });

          const getData = [
            ...new Array(
              prop === "week"
                ? 7
                : prop === "year"
                ? 12
                : getDaysInMonth(
                    new Date().getMonth() + 1,
                    new Date().getFullYear()
                  )
            ),
          ].map((day, i) =>
            prop === "week"
              ? newData
                  ?.filter(
                    (v) =>
                      new Date(v.createdAt).getDate() ===
                      new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        getLastWeeksDate().getDate() + 1 + i
                      ).getDate()
                  )
                  .reduce(
                    (partialSum, a) => partialSum + Number(a.basePrice),
                    0
                  )
              : prop === "year"
              ? newData
                  ?.filter((v) => new Date(v.createdAt).getMonth() === i)
                  .reduce(
                    (partialSum, a) => partialSum + Number(a.basePrice),
                    0
                  )
              : newData
                  ?.filter((v) => new Date(v.createdAt).getDate() === i + 1)
                  .reduce(
                    (partialSum, a) => partialSum + Number(a.basePrice),
                    0
                  )
          );
          return getData;
        }
// console.log(ordersByYears)
const todaysOrders = ordersByYears.filter(
  (v) =>
    new Date(v.createdAt).toLocaleDateString() === new Date().toLocaleDateString() &&
    (v.status === "pending" || v.status === "delivered")
);

        const data = {
          salesReport: getOrdersReport(),
          ordersReport: [
            ordersByYears.filter((v) => v.status === "pending").length,
            ordersByYears.filter((v) => v.status === "in transit").length,
            ordersByYears.filter((v) => v.status === "shipped").length,
            ordersByYears.filter((v) => v.status === "delivered").length,
            ordersByYears.filter((v) => v.status === "returned").length,
            ordersByYears.filter((v) => v.status === "cancelled").length,
          ],
          incomeReport: {
            week: getIncomeReport("week"),
            month: getIncomeReport("month"),
            year: getIncomeReport("year"),
          },
          dailyUsers: users.length,
          totalProducts: totalProducts,
          dailyOrders: todaysOrders.length,
          dailyEarning: todaysOrders.reduce(
            (partialSum, a) => partialSum + a.basePrice,
            0
          ),
        };

        /* find all the data in our database */
        res.status(200).json({ success: true, data: data });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
  }
}
