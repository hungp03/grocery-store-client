import React, { useEffect, useState, useMemo } from "react";
import { apiGetOverview, apiGetMonthlyRevenue } from "@/apis";
import { RevenueChart } from "@/components/admin";
import { Spin } from "antd";
import { RESPONSE_STATUS } from "@/utils/responseStatus";
const Overview = () => {
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Tháng hiện tại (1-12)
  const currentYear = currentDate.getFullYear();
  const lastYear = currentYear - 1;

  // Mặc định tháng là tháng hiện tại, năm là năm hiện tại
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [chartData, setChartData] = useState([]);

  // Danh sách các tháng (1-12)
  const months = useMemo(() => {
    const monthOptions = [];
    for (let month = 1; month <= 12; month++) {
      monthOptions.push({
        value: month,
        label: `${String(month).padStart(2, "0")}`, // Định dạng tháng 01, 02,...
      });
    }
    return monthOptions;
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await apiGetOverview();
      if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
        setTotalProfit(res?.data[0]);
        setTotalUser(res?.data[1]);
        setTotalProduct(res?.data[2]);
        setTotalOrder(res?.data[3]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOverviewOrder = async (month) => {
    setLoading(true);
    try {
      const res = await apiGetMonthlyRevenue(month, selectedYear);
      if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
        setChartData(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10);
    setSelectedMonth(month);
    fetchOverviewOrder(month);
  };

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);

    // Nếu đổi sang năm nay và tháng đang chọn lớn hơn tháng hiện tại, cập nhật lại tháng
    if (year === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth(currentMonth);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchOverviewOrder(selectedMonth);
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-white">
        {loading ? (
          <div className="flex w-main justify-center items-center h-96">
            <Spin size="large"/>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Overview</h1>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white shadow rounded-lg p-4 pb-12">
                <h2 className="text-sm font-medium">Tổng lợi nhuận</h2>
                <p className="text-2xl font-bold">{totalProfit.toLocaleString("vi-VN")} đ</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 pr-28">
                <h2 className="text-sm font-medium">Người sử dụng</h2>
                <p className="text-2xl font-bold">{totalUser}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-sm font-medium">Tổng sản phẩm</h2>
                <p className="text-2xl font-bold">{totalProduct}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-4">
                <h2 className="text-sm font-medium">Đơn hàng</h2>
                <p className="text-2xl font-bold">{totalOrder}</p>
              </div>
            </div>
            <div className="flex">
              <div className="mb-4">
                <label htmlFor="yearSelect" className="block text-sm font-medium mb-2">
                  Chọn năm
                </label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="border w-[105px] rounded p-2 text-sm"
                >
                  <option value={lastYear}>{lastYear}</option>
                  <option value={currentYear}>{currentYear}</option>
                </select>
              </div>
              <div className="mb-4 ml-20">
                <label htmlFor="monthSelect" className="block text-sm font-medium mb-2">
                  Chọn tháng
                </label>
                <select
                  id="monthSelect"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                  className="border w-[105px] rounded p-2 text-sm"
                >
                  {months
                    .filter((month) =>
                      // Nếu là năm nay, chỉ cho phép chọn tháng <= tháng hiện tại
                      selectedYear === currentYear ? month.value <= currentMonth : true
                    )
                    .map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <RevenueChart data={chartData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
