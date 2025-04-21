import React, { useState, useEffect } from "react";
import { apiGetProduct } from "@/apis";
import { EditProductForm, BackButton } from "@/components/admin/index";
import { message } from "antd";
function EditProduct() {
  const [product, setProduct] = useState(null);

  const path = window.location.pathname;
  const pid = path.split('/').pop();

  const fetchProduct = async (pid) => {
    try {
      const res = await apiGetProduct(pid);
      if (res.data) {
        setProduct(res.data);
        console.log(res.data)
      } else {
        throw new Error("Không tìm thấy sản phẩm.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải sản phẩm.");
    }
  };

  useEffect(() => {
    fetchProduct(pid);
  }, [pid]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <BackButton turnBackPage="/admin/product" header="Quay lại" />
      <EditProductForm initialProductData={product} />
    </div>
  );
}

export default EditProduct;
