import React, { useState, useEffect } from "react";
import { apiGetProduct, apiUpdateProduct2 } from "@/apis";
import { EditProductForm, BackButton } from "@/components/admin/index";
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { message } from "antd";
function EditProduct() {
  const [product, setProduct] = useState(null);
  const [inputCount, setInputCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");


  const path = window.location.pathname;
  const pid = path.split('/').pop();

  const fetchProduct = async (pid) => {
    try {
      const res = await apiGetProduct(pid);
      if (res.data) {
        setProduct(res.data);
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

  const handleShowAddProduct = () => {
    setShowMessage(true);
    setInputCount(0);
    setMessageContent('');
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
    setMessageContent('');
    setInputCount(0);
  };

  const handleAdd = async () => {
    if (inputCount <= 0) {
      setMessageContent("Giá trị số bạn nhập nhỏ hơn hoặc bằng 1. Hãy nhập lại dữ liệu.");
      return;
    }

    const productToAddQuantity = {
      id: product?.id,
      productName: product?.productName,
      price: product?.price,
      quantity: Number(product?.quantity) + Number(inputCount),
      sold: product?.sold,
      description: product?.description,
      imageUrl: product?.imageUrl,
      category: { id: product?.category?.id },
    };

    const res = await apiUpdateProduct2(productToAddQuantity);

    if (res.statusCode !== RESPONSE_STATUS.SUCCESS) {
      message.error(res.message || "Có lỗi xảy ra khi cập nhật sản phẩm.");
    }

    message.success("Cập nhật sản phẩm thành công!");
    handleCloseMessage();
    await fetchProduct(pid);
  };

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
