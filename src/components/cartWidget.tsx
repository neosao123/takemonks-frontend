// react
import { useState, useEffect } from "react";

// next
import { useRouter } from "next/router";

// lodash
import { sum } from "lodash";

// material
import { Badge, IconButton } from "@mui/material";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
// ----------------------------------------------------------------------

export default function CartWidget({ ...props }) {
  const { checkout } = props;
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const totalItems = sum(cart.map((item: any) => item.quantity));

  useEffect(() => {
    setCart(checkout.cart);
  }, [checkout]);

  return (
    <IconButton onClick={() => router.push("/checkout")}>
      <Badge badgeContent={totalItems} color="primary">
        <ShoppingBasketOutlinedIcon />
      </Badge>
    </IconButton>
  );
}
