import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import payment from '@/assets/payment/payment.svg';
import { apiCreateOrder, apiGetSelectedCart, apiPaymentVNPay, getUserById } from "@/apis";
import { Button, InputForm } from "@/components";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaRegCreditCard } from "react-icons/fa6";
import vnpayLogo from "@/assets/vnpay_logo.png"
import { RESPONSE_STATUS } from "@/utils/responseStatus";

const Checkout = () => {
    const { current } = useSelector(state => state.user)
    const { handleSubmit, register, formState: { errors, isValid }, reset } = useForm()
    const [cart, setCart] = useState()
    const [user, setUser] = useState()
    const [isCart, setIsCart] = useState(false)
    const location = useLocation();
    const { selectedItems } = location.state || {};
    const navigate = useNavigate()

    const fetchCart = async () => {
        const response = await apiGetSelectedCart(selectedItems);
        const fetchedCart = response?.data;
        setCart(fetchedCart);
        // Cập nhật trạng thái isCart dựa trên fetchedCart
        setIsCart(fetchedCart && fetchedCart?.length > 0);
    }
    const fetchUserByCurrentId = async () => {
        try {
            const response = await getUserById(current?.id);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching avatar:", error);
        }
    }
    const handlePayment = async (data, event) => {
        const paymentMethod = event.nativeEvent.submitter.value;
        // Create the request object in the format expected by the backend
        const requestBody = {
            address: data.address,
            phone: data.phone,
            totalPrice: cart?.reduce((sum, el) => +el?.price * el.quantity + sum, 0),
            paymentMethod: paymentMethod,
            items: cart?.map((item) => ({
                productId: item?.id,
                productName: item?.productName,
                quantity: item?.quantity,
                unit_price: item?.price
            }))
        };

        if (paymentMethod === 'VNPAY') {
            // Mã hóa orderData trước khi gửi
            const orderData = btoa(encodeURIComponent(JSON.stringify(requestBody)));
            const vnpayRes = await apiPaymentVNPay({
                amount: requestBody.totalPrice,
                bankCode: import.meta.env.VITE_VNPAY_BANK_CODE,
                orderData: orderData
            });

            if (vnpayRes?.statusCode === RESPONSE_STATUS.SUCCESS && vnpayRes?.data?.data?.code === "ok") {
                const paymentUrl = vnpayRes?.data?.data?.paymentUrl;
                window.location.href = paymentUrl;
            }
           

        } else {
            const response = await apiCreateOrder(requestBody);
            const delay = 2000;
            if (response?.statusCode === RESPONSE_STATUS.CREATED) {
                message.success("Đặt hàng thành công")
                // Reset location state and navigate home
                location.state = {};
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, delay);
            } else {
                message.error(response?.data?.error, {
                    hideProgressBar: false,
                    autoClose: delay,
                });
            }
        }
    };
    useEffect(() => {
        if (current && selectedItems) {
            fetchCart()
            fetchUserByCurrentId()
            //console.log(cart)
        }
    }, [current])

    useEffect(() => {
        reset({
            address: user?.address,
            phone: user?.phone
        })
    }, [user])

    return (
        <div className="p-8 grid grid-cols-10 h-full max-h-screen overflow-y-auto gap-6">
            <div className="w-full flex justify-center items-center col-span-3">
                <img src={payment} alt="payment" className="h-[70%] object-contain" />
            </div>
            {!isCart &&
                <div className="flex flex-col gap-4 w-full justify-center items-center col-span-7">
                    <span className="text-2xl font-medium">
                        Xin hãy chọn sản phẩm để thanh toán
                    </span>
                    <Button
                        handleOnClick={() => navigate('/cart')}
                    >
                        Quay về giỏ hàng
                    </Button>
                </div>
            }
            {isCart &&
                <div className="flex w-full flex-col justify-center items-center col-span-7 gap-6">
                    <h2 className="text-3xl mb-6 font-semibold">Kiểm tra đơn hàng của bạn</h2>
                    <div className="grid grid-cols-10 h-full w-full gap-6">
                        <table className="table-auto w-full h-fit col-span-6 border-collapse border border-gray-300 rounded-lg">
                            <thead>
                                {/* border bg-gray-300 */}
                                <tr className=" border-b hover:bg-gray-50 transition duration-200">
                                    <th className="p-2 text-left">Sản phẩm</th>
                                    <th className="p-2 text-center">Số lượng</th>
                                    <th className="p-2 text-right">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart?.map((el, index) => (<tr className="border" key={el?.productId + "-" + index}>
                                    <td className="p-2 text-left">{el?.productName}</td>
                                    <td className="p-2 text-center">{el?.quantity}</td>
                                    <td className="p-2 text-right">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(+el?.price)}</td>
                                </tr>))}
                            </tbody>
                        </table>
                        {/* col-span-4 flex  flex-col gap-[35px] p-4 bg-gray-200 */}
                        <form onSubmit={handleSubmit(handlePayment)} className="p-6 bg-white rounded-lg shadow-md col-span-4 space-y-4">
                            <span className="font-medium">Thông tin thanh toán</span>
                            <div className="flex items-center justify-center mb-6">
                                <FaRegCreditCard className="w-16 h-16 text-primary" />
                            </div>
                            <div className="text-2xl font-bold text-center">
                                Tổng tiền:
                                <span className="text-green-500 ml-2">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(+cart?.reduce((sum, el) =>
                                        +el?.price * el.quantity + sum, 0))}
                                </span>
                            </div>
                            <InputForm
                                label='Địa chỉ:'
                                register={register}
                                errors={errors}
                                id='address'
                                validate={{
                                    required: 'Vui lòng nhập địa chỉ của bạn',
                                    minLength: {
                                        value: 5,
                                        message: 'Địa chỉ phải có ít nhất 5 ký tự'
                                    },
                                    pattern: {
                                        value: /^[0-9a-zA-ZÀÁÂÃÈÉÊỀẾỆÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêềếệìíòóôõùúăđĩũơưạ-ỹ\s,.-/]+$/,
                                        message: 'Địa chỉ không được chứa ký tự đặc biệt'
                                    }
                                }}
                            />
                            <InputForm
                                label='Số điện thoại'
                                register={register}
                                errors={errors}
                                id='phone'
                                validate={{
                                    required: 'Vui lòng điền thông tin',
                                    pattern: {
                                        value: /^0\d{9}$/, // Regex để kiểm tra số điện thoại bắt đầu bằng 0 và có 10 số
                                        message: 'Số điện thoại không hợp lệ',
                                    },
                                }}
                            />

                            {<button className={"px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-500 shadow-lg transition duration-300 w-full"} type="submit" name="paymentMethod" value="COD">Thanh toán khi nhận hàng</button>}
                            {<button
                                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 shadow-lg transition duration-300 w-full flex items-center justify-center gap-2"
                                type="submit"
                                name="paymentMethod"
                                value="VNPAY"
                            >
                                <span className="text-white">Thanh toán qua</span>
                                <img
                                    src={vnpayLogo}
                                    alt="VNPay"
                                    className="h-8"
                                />
                            </button>}
                        </form>
                    </div>
                </div>
            }

        </div>
    )
}

export default Checkout;