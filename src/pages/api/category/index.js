import dbConnect from "lib/dbConnect";
import NewCategories from "models/NewCategories";
import ChildCategories from "models/ChildCategories";
import GrandChildCategories from "models/GrandChildCategories";
export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const parentCategory = await NewCategories.create({
          name: "new parent Category",
        });

        const childCategory = await ChildCategories.create({
          name: "Child Category",
          parent: parentCategory._id,
        });

        const grandchildCategory = await GrandChildCategories.create({
          name: "Grandchild Category",
          parent: childCategory._id,
        });

        const grandchildCategoryData = await GrandChildCategories.findOne(
          grandchildCategory._id,
          {}
        ).populate({
          path: "parent",
          populate: { path: "parent" },
        });

        res.status(200).json({ success: true, data: grandchildCategoryData });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
