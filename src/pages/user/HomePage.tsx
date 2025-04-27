import React, { useState } from "react";

import ProductList from "@/components/feature/user/product/ProductList";

const HomePage: React.FC = () => {
  const [page, setPage] = useState(1);
  return (
    <div>
      <ProductList page={page} setPage={setPage} />
    </div>
  );
}
export default HomePage