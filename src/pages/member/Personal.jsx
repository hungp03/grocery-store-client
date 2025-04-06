import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, Tag, Typography, Divider, message, Space } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { UploadOutlined, UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import avatar from "@/assets/avatarDefault.png";
import { apiGetCurrentUser, apiUpdateCurrentUser, getUserById } from "@/apis";
import { getCurrentUser } from "@/store/user/asyncActions";
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { el } from "date-fns/locale";
const { Title } = Typography;

const Personal = () => {
    const { control, handleSubmit, formState: { errors, isDirty }, reset } = useForm();
    const { current } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [user, setUser] = useState();
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchCurrentUser = async () => {
        try {
            const response = await apiGetCurrentUser();
            if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
                setUser(response.data);
            }
            else {
                message.error("Có lỗi khi lấy thông tin người dùng");
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, [current]);

    useEffect(() => {
        if (user) {
            reset({
                name: user?.name,
                email: user?.email,
                avatarUrl: user?.avatarUrl,
                phone: user?.phone,
                address: user?.address,
            });
        }
    }, [user, reset]);

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Bạn chỉ có thể tải lên tệp ảnh!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 5MB!');
            return false;
        }

        // Tạo preview URL cho ảnh mới
        const previewURL = URL.createObjectURL(file);
        setPreviewImage(previewURL);
        setSelectedFile(file);
        return false; // Ngăn Upload component tự động upload
    };

    const handleCancel = () => {
        // Reset ảnh preview
        setPreviewImage(null);
        setSelectedFile(null);
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }

        // Reset form về giá trị ban đầu
        reset({
            name: user?.name,
            email: user?.email,
            avatarUrl: user?.avatarUrl,
            phone: user?.phone,
            address: user?.address,
        });
    };

    const handleUpdateInfo = async (data) => {
        const formData = new FormData();

        // Thêm ảnh đại diện nếu có
        if (selectedFile) {
            formData.append('avatarUrl', selectedFile);
        }

        const userData = { ...data };
        // Tránh gửi field trùng lặp
        delete userData.avatarUrl;
        // Nếu email không cần cập nhật => xóa field email
        delete userData.email;

        formData.append("user", new Blob([JSON.stringify(userData)], { type: "application/json" }));

        const response = await apiUpdateCurrentUser(formData);
        const delay = 2000;

        if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
            message.success("Cập nhật thành công");
            setTimeout(() => {
                dispatch(getCurrentUser());
                setPreviewImage(null);
                setSelectedFile(null);
            }, delay);
        } else {
            message.error(response.message);
        }
    };


    const currentAvatar = user?.avatarUrl || avatar;

    const showUpdateButton = isDirty || selectedFile;

    return (
        <div className="w-full">
            <Title level={4} className="px-6 py-4 border-b">
                Trang cá nhân
            </Title>

            <Form layout="vertical" className="p-6 max-w-2xl mx-auto" onFinish={handleSubmit(handleUpdateInfo)}>
                <div className="mb-8 text-center">
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        className="mb-4"
                    >
                        <div className="relative inline-block group">
                            <img
                                src={previewImage || currentAvatar}
                                alt="avatar"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                            />
                            <Button
                                icon={<UploadOutlined />}
                                className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                shape="circle"
                            />
                        </div>
                        <div className="mt-2 text-gray-500 text-sm">
                            Click để tải ảnh lên (Tối đa 5MB)
                        </div>
                    </Upload>
                    {previewImage && (
                        <div className="flex justify-center gap-2 mt-2">
                            <Button danger onClick={handleCancel}>
                                Hủy
                            </Button>
                        </div>
                    )}
                </div>

                <Controller
                    name="name"
                    control={control}
                    rules={{
                        required: 'Vui lòng điền thông tin',
                        maxLength: { value: 100, message: 'Tên không được vượt quá 100 ký tự' },
                        pattern: {
                            value: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯăẠ-ỹ\s,.-/]+$/,
                            message: 'Tên không được chứa số hay ký tự đặc biệt',
                        },
                    }}
                    render={({ field }) => (
                        <Form.Item
                            label="Họ và tên"
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name?.message}
                        >
                            <Input {...field} prefix={<UserOutlined />} />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: 'Vui lòng điền thông tin',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|net|org|edu|gov|mil|int|info|biz|co\.uk|ac\.uk|io|vn|com\.vn|net\.vn)$/,
                            message: "Địa chỉ email không hợp lệ",
                        },
                    }}
                    render={({ field }) => (
                        <Form.Item
                            label="Email"
                            validateStatus={errors.email ? 'error' : ''}
                            help={errors.email?.message}
                        >
                            <Input {...field} disabled prefix={<MailOutlined />} />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="phone"
                    control={control}
                    rules={{
                        required: 'Vui lòng điền thông tin',
                        pattern: {
                            value: /^0\d{9}$/,
                            message: 'Số điện thoại không hợp lệ',
                        },
                    }}
                    render={({ field }) => (
                        <Form.Item
                            label="Số điện thoại"
                            validateStatus={errors.phone ? 'error' : ''}
                            help={errors.phone?.message}
                        >
                            <Input {...field} prefix={<PhoneOutlined />} />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="address"
                    control={control}
                    rules={{
                        required: 'Vui lòng điền thông tin',
                        minLength: { value: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự' },
                        pattern: {
                            value: /^[0-9a-zA-ZÀÁÂÃÈÉÊỀẾỆÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêềếệìíòóôõùúăđĩũơưạ-ỹ\s,.-/]+$/,
                            message: 'Địa chỉ không được chứa ký tự đặc biệt',
                        },
                    }}
                    render={({ field }) => (
                        <Form.Item
                            label="Địa chỉ"
                            validateStatus={errors.address ? 'error' : ''}
                            help={errors.address?.message}
                        >
                            <Input {...field} prefix={<HomeOutlined />} />
                        </Form.Item>
                    )}
                />

                <Divider />

                <div className="flex gap-4 mb-4">
                    <div>
                        <span className="text-gray-600 mr-2">Trạng thái:</span>
                        <Tag color={user?.status === 0 ? "error" : "success"}>
                            {user?.status === 0 ? "Block" : "Active"}
                        </Tag>
                    </div>
                </div>

                {showUpdateButton && (
                    <Form.Item className="flex justify-end mb-0">
                        <Space>
                            {(isDirty || previewImage) && (
                                <Button danger onClick={handleCancel}>
                                    Hủy thay đổi
                                </Button>
                            )}
                            <Button type="primary" htmlType="submit">
                                Cập nhật thông tin
                            </Button>
                        </Space>
                    </Form.Item>
                )}
            </Form>
        </div>
    );
};

export default Personal;
