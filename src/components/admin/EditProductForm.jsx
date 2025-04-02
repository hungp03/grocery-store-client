import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Upload, Card, message, Select } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import { apiUploadImage, apiUpdateProduct2 } from "@/apis"
import product_default from "@/assets/product_default.png"
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { ca } from "date-fns/locale";

const { TextArea } = Input

const EditProductForm = ({ initialProductData }) => {
  const categories = useSelector((state) => state.app.categories);
  console.log(categories)
  const [form] = Form.useForm()
  const [productData, setProductData] = useState(initialProductData)
  const [productImage, setProductImage] = useState(null)
  const [previewProductImage, setPreviewProductImage] = useState(
    initialProductData?.imageUrl || product_default,
  )
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (initialProductData) {
      setProductData(initialProductData)
      setPreviewProductImage(
        initialProductData?.imageUrl || product_default,
      )
      form.setFieldsValue({
        id: initialProductData?.id,
        productName: initialProductData?.product_name || initialProductData?.productName,
        price: initialProductData?.price,
        quantity: initialProductData?.quantity,
        description: initialProductData?.description,
        rating: initialProductData?.rating,
        unit: initialProductData?.unit,
        sold: initialProductData?.sold,
      })
    }
  }, [initialProductData, form])

  const handleUpdateProduct = async (values) => {
    setUploading(true)

    const productToUpdate = {
      id: initialProductData?.id,
      productName: values.productName,
      price: values.price,
      imageUrl: initialProductData?.imageUrl,
      quantity: values.quantity,
      description: values.description,
      unit: values.unit,
      category: { id: values.categoryId },
    }
    
    console.log("productToUpdate", productToUpdate)

    // Xử lý upload hình ảnh nếu có
    if (productImage) {
      try {
        const resUpLoad = await apiUploadImage(productImage, "product")
        if (resUpLoad?.statusCode === RESPONSE_STATUS.BAD_REQUEST) {
          throw new Error(resUpLoad.message || "Lỗi khi tải lên hình ảnh")
        }
        productToUpdate.imageUrl = resUpLoad?.data?.fileName || initialProductData?.imageUrl
      } catch (uploadError) {
        message.error("Lỗi khi tải lên hình ảnh: " + uploadError.message)
        setUploading(false)
        return // Dừng quá trình cập nhật nếu upload thất bại
      }
    }

    // Cập nhật thông tin sản phẩm
    const resUpdate = await apiUpdateProduct2(productToUpdate)

    if (resUpdate.statusCode == RESPONSE_STATUS.SUCCESS) {
      // Cập nhật state local với dữ liệu mới
      setProductData({
        ...productData,
        ...productToUpdate,
      })

      message.success("Sửa sản phẩm thành công!")
    }
    else
      message.error(resUpdate.message || "Có lỗi xảy ra khi cập nhật sản phẩm.")
    setUploading(false)
  }

  const handleImageChange = (info) => {
    if (info.file) {
      const file = info.file.originFileObj || info.file

      if (file instanceof File) {
        // Tạo preview cho hình ảnh
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewProductImage(reader.result)
        }
        reader.readAsDataURL(file)

        // Lưu file để upload sau
        setProductImage(file)
      } else {
        console.error("Invalid file object:", file)
        message.error("Không thể đọc file. Vui lòng thử lại.")
      }
    }
  }

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("Bạn chỉ có thể tải lên file hình ảnh!")
        return false
      }

      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        message.error("Hình ảnh phải nhỏ hơn 5MB!")
        return false
      }

      return false // Prevent auto upload
    },
    onChange: handleImageChange,
    maxCount: 1,
    showUploadList: false,
    accept: "image/*",
  }

  return (
    <Card title="Chỉnh sửa sản phẩm" className="max-w-3xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateProduct}
        initialValues={{
          id: productData?.id,
          productName: productData?.product_name || productData?.productName,
          price: productData?.price,
          quantity: productData?.quantity,
          description: productData?.description,
          rating: productData?.rating,
          sold: productData?.sold,
        }}
      >
        <Form.Item
          label="Tên sản phẩm"
          name="productName"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input className="rounded-md text-sm" />
        </Form.Item>

        <Form.Item label="Giá" name="price" rules={[{ required: true, message: "Vui lòng nhập giá!" }]}>
          <InputNumber
            className="w-full"
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>

        <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}>
          <InputNumber className="w-full" min={0} precision={0} />
        </Form.Item>

        <Form.Item label="Đơn vị tính" name="unit">
          <Input className="w-full rounded-md text-sm"/>
        </Form.Item>

        <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Phân loại (không chọn nếu không cần cập nhật)" name="categoryId" >
          <Select
            className="w-full"
            options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
            onChange={(value) => {
              form.setFieldsValue({ categoryId: value })
            }}
            placeholder="Chọn phân loại"
          />
        </Form.Item>
        <Form.Item label="Đánh giá" name="rating">
          <InputNumber disabled className="w-full" min={0} max={5} precision={1} />
        </Form.Item>

        <Form.Item label="Số lượng đã bán" name="sold">
          <InputNumber disabled className="w-full" min={0} />
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <div className="mb-4">
            <img
              src={previewProductImage || "/placeholder.svg"}
              alt="Product preview"
              style={{
                maxWidth: "100%",
                height: "200px",
                objectFit: "contain",
                marginBottom: "1rem",
              }}
            />
          </div>
          <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          <div className="mt-2 text-xs text-gray-500">Hỗ trợ: JPG, PNG, JPEG (tối đa 5MB)</div>
        </Form.Item>

        <Form.Item>
          <Button
            style={{ backgroundColor: "#10B981", color: "white" }}
            htmlType="submit"
            block
            size="large"
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? "Đang xử lý..." : "Lưu thay đổi"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default EditProductForm

