"use client";

import React from "react";
import FnbFilterCollapse from "../common/FnbFilterCollapse";

export default function FilterBar() {
  return (
    <FnbFilterCollapse
      buttonText="Filter"
      searchPlaceholder="SKU or keyword..."
    />
  );
}
