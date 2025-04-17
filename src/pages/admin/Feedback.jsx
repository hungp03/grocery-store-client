import React, { useEffect, useState } from "react";
import { Button, Select, Table, Modal, message } from "antd";
import { apiGetAllRatingsPage, apiChangeRatingStatus } from "@/apis";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from '@/store/app/appSlice';
import { useSearchParams } from "react-router-dom";
import { sortFeedbackOrder, statusHideOrder } from "@/utils/constants";
import withBaseComponent from "@/hocs/withBaseComponent";
import { FaEye } from "react-icons/fa6";
import { MdOutlineBlock } from "react-icons/md";
import { getCurrentUser } from "@/store/user/asyncActions";
import { FeedbackCard } from "@/components";
import { RESPONSE_STATUS } from "@/utils/responseStatus";

const Feedback = ({ navigate, location }) => {
    const { isLoggedIn } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { current } = useSelector(state => state.user);
    const [params, setParams] = useSearchParams();

    // Extract params
    const pageParam = Number(params.get('page')) || 1;
    const sortParam = params.get('sort') || '';
    const statusParam = params.get('status') || '';
    const [feedbacksPage, setFeedbacksPage] = useState([]);
    const [paginate, setPaginate] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchRatings = async (page, sort, status) => {
        setLoading(true);
        const apiParams = { page };
        if (status && status !== 'default') apiParams.status = status;
        if (sort && sort !== 'default' && sort !== 'product_name') apiParams.sort = sort;
        const response = await apiGetAllRatingsPage(apiParams);
        if (response.statusCode === RESPONSE_STATUS.SUCCESS) {
            let feedbacksList = response.data?.result;
            if (sort === 'product_name') {
                feedbacksList = feedbacksList.sort((a, b) => {
                    if (a.product_name < b.product_name) return 1;
                    if (a.product_name > b.product_name) return -1;
                    return 0;
                });
            }
            setFeedbacksPage(feedbacksList);
            setPaginate(response.data?.meta);
        }
        else {
            message.error("Có lỗi xảy ra khi tải dữ liệu đánh giá");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (current) {
            fetchRatings(pageParam, sortParam, statusParam);
        }
    }, [current, pageParam, sortParam, statusParam]);

    const handleChangeSortValue = (value) => {
        setParams(prev => {
            const obj = Object.fromEntries([...params]);
            obj.sort = value;
            obj.page = 1;
            return obj;
        });
    };

    const handleChangeStatusValue = (value) => {
        setParams(prev => {
            const obj = Object.fromEntries([...params]);
            obj.status = value;
            obj.page = 1;
            return obj;
        });
    };

    const handleViewDetail = (id) => {
        if (!isLoggedIn) {
            Modal.confirm({
                title: "Oops!",
                content: "Đăng nhập trước xem",
                okText: "Đăng nhập",
                cancelText: "Hủy",
                onOk: () => navigate(`/${path.LOGIN}`)
            });
        } else {
            const feedback = feedbacksPage.find(feedback => feedback?.id === id);
            dispatch(showModal({
                isShowModal: true,
                modalChildren: <FeedbackCard data={feedback} onClose={() => dispatch(showModal({ isShowModal: false }))} />
            }));
        }
    };

    const handleHideFeedback = async (id) => {
        if (!isLoggedIn) {
            Modal.confirm({
                title: "Oops!",
                content: "Đăng nhập trước để ẩn",
                okText: "Đăng nhập",
                cancelText: "Hủy",
                onOk: () => navigate(`/${path.LOGIN}`)
            });
        } else {
            const feedback = feedbacksPage.find(feedback => feedback.id === id);
            const response = await apiChangeRatingStatus(feedback?.id);
            if (+response.statusCode === RESPONSE_STATUS.SUCCESS) {
                message.success(feedback?.status === true ? "Ẩn đánh giá thành công" : "Hiện đánh giá thành công");
                setTimeout(() => {
                    dispatch(getCurrentUser());
                }, 1000);
            } else {
                message.error("Có lỗi. Không thể ẩn hay hiện đánh giá này");
            }
        }
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'product_name', key: 'product_name' },
        { title: 'Người dùng', dataIndex: 'userName', key: 'userName' },
        { title: 'Đánh giá', dataIndex: 'ratingStar', key: 'ratingStar', align: 'center', render: (rating) => `${rating} ★` },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', render: (text) => (text && text.length > 50 ? `${text.substring(0, 50)}...` : (text || "")) },
        { title: 'Thời gian cập nhật', dataIndex: 'updatedAt', key: 'updatedAt', align: 'right', render: (date) => new Date(date).toLocaleString("vi-VN") },
        {
            title: 'Xem chi tiết',
            key: 'viewDetail',
            align: 'center',
            render: (_, record) => <Button
                type="link"
                onClick={() => handleViewDetail(record.id)}
                icon={<FaEye color="green" />}
                title="Xem chi tiết" />
        },
        {
            title: 'Ẩn',
            key: 'hide',
            align: 'center',
            render: (_, record) => <Button
                type="link"
                onClick={() => handleHideFeedback(record.id)}
                icon={<MdOutlineBlock color={record.status === true ? "red" : "gray"} />}
                title={record.status === true ? "Ẩn" : "Hiện"} />
        }
    ];

    return (
        <div className="w-full">
            <div className="mb-4">
                <Select
                    placeholder="Sắp xếp"
                    options={sortFeedbackOrder}
                    onChange={handleChangeSortValue}
                    style={{ width: 200, marginRight: 16 }}
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    options={statusHideOrder}
                    onChange={handleChangeStatusValue}
                    style={{ width: 200 }}
                />
            </div>
            <Table
                dataSource={feedbacksPage}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pageParam,
                    pageSize: paginate?.pageSize,
                    onChange: (page) => {
                        setParams(prev => {
                            const obj = Object.fromEntries([...params]);
                            obj.page = page;
                            return obj;
                        });
                    },
                    total: paginate?.total,
                }}
            />
        </div>
    );
};

export default withBaseComponent(Feedback);