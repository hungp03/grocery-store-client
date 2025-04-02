import React, { useState } from "react"
import { Form, Input, InputNumber, Button, Upload, Card, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { BackButton } from "@/components/admin"
import { CategoryComboBox } from "@/components/admin"
import product_default from "@/assets/product_default.png"
import { apiUploadImage, apiCreateProduct } from "@/apis"

const { TextArea } = Input

const AddProduct = () => {
  const [form] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [productImage, setProductImage] = useState(null)
  const [previewProductImage, setPreviewProductImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleCreateProduct = async (values) => {
    if (!selectedCategory?.id) {
      message.error("Vui lòng chọn phân loại sản phẩm!")
      return
    }

    setUploading(true)

    const productToCreate = {
      productName: values.productName,
      price: values.price,
      quantity: values.quantity,
      sold: 0,
      description: values.description,
      category: { id: selectedCategory?.id },
    }

    try {
      // Xử lý upload hình ảnh nếu có
      if (productImage) {
        try {
          const resUpLoad = await apiUploadImage(productImage, "product")
          if (resUpLoad?.statusCode === 400) {
            throw new Error(resUpLoad.message || "Lỗi khi tải lên hình ảnh")
          }
          productToCreate.imageUrl = resUpLoad?.data?.fileName || null
        } catch (uploadError) {
          message.error("Lỗi khi tải lên hình ảnh: " + uploadError.message)
          setUploading(false)
          return // Dừng quá trình tạo sản phẩm nếu upload thất bại
        }
      }

      // Tạo sản phẩm mới
      const resCreate = await apiCreateProduct(productToCreate)
      if (resCreate.statusCode === 400) {
        throw new Error(resCreate.message || "Có lỗi xảy ra khi tạo sản phẩm.")
      }

      message.success("Thêm sản phẩm thành công!")

      // Reset form và state
      form.resetFields()
      setPreviewProductImage(null)
      setProductImage(null)
      setSelectedCategory(null)
    } catch (err) {
      message.error("Có lỗi xảy ra: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (info) => {
    // Xử lý khi người dùng chọn file
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
    <div className="w-full">
      <div className="mb-4">
        <BackButton turnBackPage="/admin/product" header="Quay lại" />
      </div>

      <Card title="Thêm sản phẩm mới" className="max-w-3xl mx-auto">
        <Form form={form} layout="vertical" onFinish={handleCreateProduct}>
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

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Phân loại"
            required
            validateStatus={!selectedCategory ? "error" : "success"}
            help={!selectedCategory ? "Vui lòng chọn phân loại sản phẩm" : null}
          >
            <CategoryComboBox
              onSelectCategory={(value) => {
                setSelectedCategory(value)
              }}
            />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <div className="mb-4">
              <img
                src={previewProductImage || product_default}
                alt="Product preview"
                style={{
                  maxWidth: "100%",
                  height: "200px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  backgroundColor: "#f5f5f5",
                }}
              />
            </div>

            <div className="flex gap-4 flex-wrap sm:flex-nowrap">
              <Upload {...uploadProps} listType="picture">
                <Button icon={<UploadOutlined />} size="large" disabled={uploading}>
                  Chọn ảnh
                </Button>
              </Upload>
              <div className="w-full sm:w-auto">
                <Button
                  style={{ backgroundColor: "#10B981", color: "white", width: "100%" }}
                  htmlType="submit"
                  size="large"
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? "Đang xử lý..." : "Lưu sản phẩm"}
                </Button>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Hỗ trợ: JPG, PNG, JPEG (tối đa 5MB)</div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AddProduct

