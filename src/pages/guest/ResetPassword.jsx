import React from 'react';
import { Button } from '@/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiResetPassword} from '@/apis';
import { message } from 'antd';
import { useForm } from 'react-hook-form';
import path from '@/utils/path';
import { RESPONSE_STATUS } from "@/utils/responseStatus";
const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const newPassword = watch("password");

    const handleResetPassword = async (data) => {
        const response = await apiResetPassword({
            token,
            newPassword: data.password,
            confirmPassword: data.confirmPassword
        });
    
        if (response.statusCode !== RESPONSE_STATUS.SUCCESS) {
            if (response.message.toLowerCase().includes('jwt expired')) {
                message.info("Đã hết thời gian đặt lại mật khẩu, vui lòng thực hiện lại");
            } else {
                message.error("Có lỗi xảy ra, vui lòng thử lại sau");
            }
            navigate(`/${path.LOGIN}`);
        } else {
            message.success("Đổi mật khẩu thành công");
            navigate(`/${path.LOGIN}`);
        }
    };
    

    return (
        <div className="absolute animate-fade-in top-0 left-0 bottom-0 right-0 bg-overlay flex flex-col items-center justify-center py-8 z-50">
                <div className="p-6 bg-white rounded-md shadow-lg w-full max-w-lg">
                    <h2 className="text-2xl font-semibold text-center mb-4">Đặt lại mật khẩu</h2>
                    <form onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="password" className="block text-gray-700">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
                                {...register("password", {
                                    required: 'Vui lòng nhập mật khẩu',
                                    minLength: {
                                        value: 6,
                                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Mật khẩu không được quá 50 ký tự',
                                    },
                                })}
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full p-3 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
                                {...register("confirmPassword", {
                                    required: 'Vui lòng xác nhận mật khẩu',
                                    validate: value => value === newPassword || 'Mật khẩu không khớp',
                                })}
                            />
                            {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                        </div>
                        <div className="flex items-center justify-between gap-4 mt-4">
                            <span
                                className="text-gray-700 hover:text-blue-700 hover:underline cursor-pointer"
                                onClick={() => navigate(`/${path.HOME}`)}
                            >
                                Hủy bỏ
                            </span>
                            <Button type="submit">Xác nhận</Button>
                        </div>
                    </form>
                </div>
        </div>
    );
};

export default ResetPassword;
