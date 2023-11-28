import React from "react";
// next
import dynamic from "next/dynamic";
const Search = dynamic(() => import("src/components/search"));

export default function Searchs() {
  return <Search mobile />;
}
