import { useState } from "react"
import { Form, Input, Button, Upload, Card, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { BackButton } from "@/components/admin"
import category_default from "@/assets/category_default.png"
import { apiCreateCategory, apiUploadImage, apiUpdateCategory } from "@/apis"
import { RESPONSE_STATUS } from "@/utils/responseStatus"

const AddCategory = () => {
  const [form] = Form.useForm()
  const [categoryImage, setCategoryImage] = useState(null)
  const [previewCategoryImage, setPreviewCategoryImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleCreateCategory = async (values) => {
    setUploading(true)

    const categoryToCreate = {
      name: values.name,
    }

    try {
      // Tạo phân loại mới
      const response = await apiCreateCategory(categoryToCreate)
      if (response.statusCode === RESPONSE_STATUS.DUPLICATE) {
        throw new Error("Phân loại đã tồn tại trong hệ thống")
      } else if (response.statusCode !== RESPONSE_STATUS.CREATED && response.statusCode !== RESPONSE_STATUS.SUCCESS) {
        throw new Error("Có lỗi xảy ra khi tạo phân loại")
      }

      // Upload ảnh nếu có
      if (categoryImage) {
        try {
          const resUpload = await apiUploadImage(categoryImage, "category")
          if (resUpload?.statusCode === RESPONSE_STATUS.BAD_REQUEST) {
            throw new Error(resUpload.message || "Lỗi khi tải lên hình ảnh")
          }

          // Cập nhật phân loại với hình ảnh mới
          categoryToCreate.id = response.data.id
          categoryToCreate.imageUrl = resUpload?.data?.fileName

          const updateResponse = await apiUpdateCategory(categoryToCreate)
          if (updateResponse.statusCode !== RESPONSE_STATUS.SUCCESS) {
            throw new Error("Đã tạo phân loại nhưng không thể cập nhật hình ảnh")
          }
        } catch (uploadError) {
          // Vẫn hiển thị thông báo thành công vì phân loại đã được tạo
          message.warning("Đã tạo phân loại nhưng có lỗi khi tải lên hình ảnh: " + uploadError.message)
          setUploading(false)
          // Reset form và state
          form.resetFields()
          setCategoryImage(null)
          setPreviewCategoryImage(null)
          return
        }
      }

      message.success("Thêm phân loại thành công!")

      // Reset form và state
      form.resetFields()
      setCategoryImage(null)
      setPreviewCategoryImage(null)
    } catch (err) {
      message.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (info) => {
    // Xử lý khi người dùng chọn file
    if (info.file) {
      // Trong Ant Design Upload, file có thể nằm ở info.file hoặc info.file.originFileObj
      const file = info.file.originFileObj || info.file

      if (file instanceof File) {
        // Tạo preview cho hình ảnh
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewCategoryImage(reader.result)
        }
        reader.readAsDataURL(file)

        // Lưu file để upload sau
        setCategoryImage(file)
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
        <BackButton turnBackPage="/admin/category" header="Quay lại" />
      </div>

      <Card title="Thêm phân loại mới" className="max-w-2xl mx-auto">
        <Form form={form} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item
            label="Tên phân loại"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên phân loại!" }]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item label="Hình ảnh">
            <div className="mb-4">
              <img
                src={previewCategoryImage || category_default}
                alt="Category preview"
                style={{
                  maxWidth: "100%",
                  height: "200px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  border: "1px solid #d9d9d9",
                  backgroundColor: "#f5f5f5",
                  padding: "8px",
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
                  {uploading ? "Đang xử lý..." : "Lưu phân loại"}
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

export default AddCategory

