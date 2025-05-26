import React, { useEffect, useState } from "react";
import { apiGetOrderDetail, apiGetOrderInfor, getUserById } from "@/apis";
import { BackButton } from "@/components/admin";
import { Card, Row, Col, Typography, Table, Image } from "antd";
import product_default from "@/assets/product_default.png";

const { Title, Text } = Typography;

function OrderDetail() {
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderInformation, setOrderInformation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [user_Id, setUser_Id] = useState(null);
  const [user, setUser] = useState(null);
  const [totalMoney, setTotalMoney] = useState(0);
  
  const fetchOrderDetail = async (oid) => {
    const res = await apiGetOrderDetail(oid);
    const res2 = await apiGetOrderInfor(oid);
    setOrderDetail(res);
    setOrderInformation(res2);
    setUser_Id(res2?.data?.userId);
  };

  const fetchUserById = async (uid) => {
    const userId = parseInt(uid, 10);
    if (isNaN(userId)) {
      console.error("Invalid user ID");
      return;
    }
    try {
      const res = await getUserById(userId);
      setUser(res);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const path = window.location.pathname;
  const oid = path.split("/").pop();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchOrderDetail(oid);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [oid]);

  useEffect(() => {
    if (user_Id) {
      fetchUserById(user_Id);
    }
  }, [user_Id]);

  useEffect(() => {
    if (orderInformation?.data?.paymentMethod == "COD") {
      setPaymentMethod("Tiền mặt 💵");
    } else if (orderInformation?.data?.paymentMethod == "BANKING") {
      setPaymentMethod("Thẻ ngân hàng 💳");
    }
  }, [orderInformation]);

  useEffect(() => {
    if (orderDetail?.data) {
      const total = orderDetail.data.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity;
      }, 0);
      setTotalMoney(total);
    }
  }, [orderDetail]);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      render: (text, record) => (
        <Image
          width={50}
          src={
            record.imageUrl || product_default
          }
          alt={record.productName}
        />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Giá',
      dataIndex: 'unitPrice',
      render: (text) => `${text ? text.toLocaleString("vi-VN") : "0"} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'total',
      render: (text, record) => `${(record.unitPrice * record.quantity).toLocaleString("vi-VN")} đ`,
    },
  ];

  return (
    <div className="w-full">
      <BackButton
        turnBackPage="/admin/order"
        header="Quay lại"
      />
      <Card title="Chi tiết đơn hàng" style={{ width: '90%', margin: '20px auto' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>Thông tin khách hàng</Title>
            <Text strong>Tên:</Text> {user?.data?.name}<br />
            <Text strong>☎Số điện thoại:</Text> {user?.data?.phone}<br />
            <Text strong>📩Email:</Text> {orderInformation?.data?.userEmail}<br />
            <Text strong>📍Địa chỉ:</Text> {orderInformation?.data?.address}
          </Col>
          <Col span={12}>
            <Title level={4}>Đơn hàng</Title>
            <Text strong>Tổng số tiền:</Text> {orderInformation?.data?.totalPrice.toLocaleString("vi-VN")} đ<br />
            <Text strong>Phương thức thanh toán:</Text> {paymentMethod}<br />
            <Text strong>📅 Thời gian đặt hàng:</Text> {new Date(orderInformation?.data?.orderTime)
              .toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour12: false,
              })}
            <br />
            <Text strong>
              {orderInformation?.data?.status === 0 ? "🕑 Đơn hàng đang chờ xác nhận" :
              orderInformation?.data?.status === 1 ? "✅ Đơn hàng đã được xác nhận" :
              orderInformation?.data?.status === 2 ? `📅 Được chuyển đến lúc: ${new Date(orderInformation?.data?.deliveryTime)
                .toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour12: false,
                })}` :
              orderInformation?.data?.status === 3 ? `❌ Đơn hàng đã bị hủy lúc: ${new Date(orderInformation?.data?.deliveryTime)
                .toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  hour12: false,
                })}` :
              null}
            </Text>
          </Col>
        </Row>
      </Card>
      <Card title="Sản phẩm" style={{ width: '90%', margin: '20px auto' }}>
        <Table
          columns={columns}
          dataSource={orderDetail?.data}
          rowKey={(record, index) => `${record.orderId}-${index}`}
          pagination={false}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={4}>
                  <Text strong>Tổng số tiền</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text strong>{totalMoney.toLocaleString("vi-VN")} đ</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
}

export default OrderDetail;
