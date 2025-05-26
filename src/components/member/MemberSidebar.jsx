// components/sidebar/MemberSidebar.jsx
import React from 'react';
import { Menu, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { memberSidebarItems } from '@/utils/constants';
import { UserOutlined } from '@ant-design/icons';

const MemberSidebar = ({ onNavigate }) => {
  const { current } = useSelector(state => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (onNavigate) onNavigate(); // để đóng drawer nếu mobile
    navigate(key);
  };

  return (
    <div className="h-full bg-white p-4 w-[250px]">
      <div className="mb-6 flex flex-col items-center border-b pb-4">
        <Avatar
          size={48}
          src={current?.avatar}
          icon={!current?.avatar && <UserOutlined />}
        />
        <h3 className="mt-2 font-semibold">{current?.fullName || 'Người dùng'}</h3>
        <p className="text-sm text-gray-500">{current?.email}</p>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={memberSidebarItems}
        onClick={handleMenuClick}
        className="border-r-0"
      />
    </div>
  );
};

export default MemberSidebar;
