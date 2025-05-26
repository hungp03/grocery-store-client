import React, { memo, useEffect, useState } from "react";
import { Modal, Button, Typography, Image } from "antd";
import { FaClock } from "react-icons/fa6";
import { apiGetOrderDetail, apiUpdateOrderStatus } from "@/apis";
import productDF from "@/assets/product_default.png";
import { RESPONSE_STATUS } from "@/utils/responseStatus";
const { Text, Title } = Typography;

const OrderCard = ({ order, onClose, updateOrderStatus }) => {
    const [isCancel, setIsCancel] = useState(false);
    const [resStatus, setResStatus] = useState(order?.status || 0);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await apiGetOrderDetail(order.id);
                if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            }
        };

        fetchOrderDetails();
    }, [order.id]);

    const handleCancelOrder = (oid) => {
        Modal.confirm({
            title: "Xác nhận hủy đơn hàng",
            content: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
            okText: "Hủy đơn hàng",
            cancelText: "Không",
            onOk: async () => {
                try {
                    const response = await apiUpdateOrderStatus(oid, 3);
                    if (response?.statusCode === RESPONSE_STATUS.SUCCESS) {
                        setIsCancel(true);
                        updateOrderStatus(oid, 3);
                        setResStatus(3);
                    }
                } catch (error) {
                    console.error("Lỗi khi hủy đơn hàng:", error);
                }
            },
        });
    };

    return (
        <Modal
            open={true}
            onCancel={onClose}
            footer={null}
            centered
            title={`Chi tiết đơn hàng #${order.id}`}
        >
            <div className="flex justify-between items-center mb-4">
                <Text type="success">
                    {resStatus === 0
                        ? "Chờ xác nhận"
                        : resStatus === 1
                        ? "Chờ giao hàng"
                        : resStatus === 2
                        ? "Giao hàng thành công"
                        : "Đã hủy"}
                </Text>
                <Text type="success">
                    {resStatus === 2 || resStatus === 3 ? "HOÀN THÀNH" : "CHƯA HOÀN THÀNH"}
                </Text>
            </div>

            <div className="overflow-y-auto max-h-80">
                {products?.map((product, index) => (
                    <div key={product.productId} className="flex space-x-4 items-center justify-start mb-4">
                        <Image
                            width={50}
                            height={50}
                            src={product.imageUrl || productDF}
                            alt={product.productName}
                            className="rounded-lg border shadow-md"
                        />
                        <div className="flex-1">
                            <Title level={5} className="m-0">{product.productName}</Title>
                            <p className="text-sm">x{product.quantity}</p>
                        </div>
                        <div className="text-right">
                            <Text strong>
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(+product.unitPrice)}
                            </Text>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t mt-4">
                <Text strong>Thành tiền:</Text>
                <Text strong type="danger" className="text-lg">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        products?.reduce((total, item) => total + item?.unitPrice * item?.quantity, 0)
                    )}
                </Text>
            </div>

            <div className="flex justify-between mt-4">
                <div className="flex items-center text-sm">
                    <FaClock className="w-4 h-4 mr-1" />
                    <Text>Thời gian đặt hàng: {new Date(order.orderTime).toLocaleString("vi-VN")}</Text>
                </div>
                <Button
                    danger
                    disabled={[1, 2, 3].includes(resStatus)}
                    onClick={() => handleCancelOrder(order.id)}
                >
                    Hủy đơn hàng
                </Button>
            </div>
        </Modal>
    );
};

export default memo(OrderCard);
