import React, { useEffect, useState } from "react";
import { Table, Select, Button, Modal, Typography, Space, Tag, Tooltip, message } from "antd";
import { useForm } from "react-hook-form";
import { apiGetOrders, apiGetOrderDetail } from "@/apis";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { statusOrder } from "@/utils/constants";
import withBaseComponent from "@/hocs/withBaseComponent";
import { FaEye } from "react-icons/fa6";
import { showModal } from "@/store/app/appSlice";
import { OrderCard } from "@/components";

const { Title } = Typography;
const { Option } = Select;

const History = ({ navigate, location }) => {
    const { current } = useSelector(state => state.user);
    const { handleSubmit, register, formState: { errors }, watch, setValue } = useForm();
    const [paginate, setPaginate] = useState(null);
    const [ordersPage, setOrdersPage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [paramPage, SetParamPage] = useState();
    const [params] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const status = watch("status");

    const fetchOrders = async (page, status = {}) => {
        setLoading(true);
        let response;
        if (status?.status === "default" || status?.status === undefined) {
            response = await apiGetOrders({ page });
            setPaginate(response.data?.meta);
            setCurrentPage(page);
        } else if (!isNaN(+status?.status)) {
            response = await apiGetOrders({ page, status: status?.status });
            setPaginate(response.data?.meta);
            setCurrentPage(page);
        }
        setOrdersPage(response?.data?.result);
        setLoading(false);
    };

    useEffect(() => {
        if (current) {
            fetchOrders(currentPage, paramPage);
        }
    }, [current, currentPage]);

    useEffect(() => {
        const pr = Object.fromEntries([...params]);
        SetParamPage(pr);
        fetchOrders(1, pr);
    }, [params]);

    const handleChangeStatusValue = (value) => {
        const currentParams = Object.fromEntries(params.entries());
        navigate({
            pathname: location.pathname,
            search: createSearchParams({
                ...currentParams,
                status: value
            }).toString()
        });
    };

    const handleViewDetail = async (order) => {
        try {
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <OrderCard
                    order={order}
                    onClose={() => dispatch(showModal({ isShowModal: false }))}
                    updateOrderStatus={updateOrderStatus}
                />
            }));
        } catch (error) {
            console.error("Lỗi khi mở modal:", error);
        }
    };



    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = ordersPage.map(order =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
        );
        setOrdersPage(updatedOrders);
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        fectOrders(pagination.current, paramPage);
    };

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            align: "center"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => (
                <Tag color={status === 0 ? "processing" : status === 1 ? "warning" : status === 2 ? "success" : "error"}>
                    {status === 0 ? "Pending" : status === 1 ? "In delivery" : status === 2 ? "Succeed" : "Cancelled"}
                </Tag>
            ),
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_price",
            key: "total_price",
            align: "right",
            render: (text) => text.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        },
        {
            title: "Xem chi tiết",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Tooltip title="Xem chi tiết" key={`action-${record.orderId}`}>
                    <Button
                        type="text"
                        icon={<FaEye size={20} color="green" />}
                        onClick={() => handleViewDetail(record)}
                    />
                </Tooltip>
            ),
        }
    ];

    return (
        <div className="w-full relative px-4 flex flex-col gap-6">
            <Title level={4} className="py-4 border-b border-b-blue-200">
                Lịch sử mua hàng
            </Title>

            <div className="flex justify-end items-center px-4">
                <Space>
                    <span>Lọc theo trạng thái:</span>
                    <Select
                        style={{ width: 200 }}
                        value={status}
                        onChange={handleChangeStatusValue}
                        placeholder="Chọn trạng thái"
                    >
                        {statusOrder.map((item) => (
    <Option key={item.value} value={item.value}>{item.label}</Option>
))}
                    </Select>
                </Space>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={ordersPage}
                    loading={loading}
                    rowKey={(record) => record.id}
                    pagination={{
                        current: currentPage,
                        pageSize: paginate?.pageSize || 10,
                        total: paginate?.total || 0,
                    }}
                    onChange={handleTableChange}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }
                />
            </div>
        </div>
    );
};

export default withBaseComponent(History);