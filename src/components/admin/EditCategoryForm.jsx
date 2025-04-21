import { useState } from "react"
import { Form, Input, Button, Upload, Card, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { apiUploadImage, apiUpdateCategory } from "@/apis"
import category_default from "@/assets/category_default.png"
import { RESPONSE_STATUS } from "@/utils/responseStatus"

function EditCategoryForm({ initialData }) {
  const [form] = Form.useForm()
  const [categoryImage, setCategoryImage] = useState(null)
  const [previewCategoryImage, setPreviewCategoryImage] = useState(
    initialData?.imageUrl || category_default,
  )
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (categoryImage) => {
    if (!categoryImage) {
      return null;
    }

    const resUpLoad = await apiUploadImage(categoryImage, "category");
    if (resUpLoad?.statusCode === RESPONSE_STATUS.BAD_REQUEST) {
      message.error(resUpLoad.message || "Lỗi khi tải lên hình ảnh");
      return null;
    }

    return resUpLoad?.data?.fileName || initialData?.imageUrl;
  };

  const handleUpdateCategory = async (values) => {
    setUploading(true);

    const categoryToUpdate = {
      name: values.name,
      imageUrl: initialData?.imageUrl,
    };

    // Cập nhật hình ảnh nếu có
    const uploadedImageUrl = await uploadImage(categoryImage);

    // Nếu không có ảnh mới, giữ nguyên ảnh cũ
    if (uploadedImageUrl !== null) {
      categoryToUpdate.imageUrl = uploadedImageUrl;
    }

    try {
      const res = await apiUpdateCategory(initialData.id, categoryToUpdate);

      if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
        message.success("Sửa phân loại thành công!");
      } else {
        message.error(res.message || "Có lỗi xảy ra khi cập nhật phân loại.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (info) => {
    // Xử lý khi người dùng chọn file
    if (info.file) {
      const file = info.file.originFileObj || info.file
      if (file instanceof File) {
        // Tạo preview cho hình ảnh
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewCategoryImage(reader.result)
        }
        reader.readAsDataURL(file)
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
    <Card title="Sửa phân loại" className="max-w-2xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateCategory}
        initialValues={{
          id: initialData?.id,
          name: initialData?.name,
        }}
      >
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />} disabled={uploading}>
                Chọn ảnh
              </Button>
            </Upload>
            <div className="text-xs text-gray-500 mt-1 sm:mt-0 sm:ml-4">Hỗ trợ: JPG, PNG, JPEG (tối đa 5MB)</div>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            style={{ backgroundColor: "#10B981", color: "white" }}
            type="primary"
            htmlType="submit"
            block
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

export default EditCategoryForm