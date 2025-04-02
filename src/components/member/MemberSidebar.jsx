import React from 'react';
import { Menu, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { memberSidebarItems } from '@/utils/constants';
import { UserOutlined } from '@ant-design/icons';

const MemberSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { current } = useSelector(state => state.user);
    console.log(current)
    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <div className="h-full bg-white rounded-lg shadow-md p-4">
            <div className="mb-6 flex flex-col items-center border-b pb-4">
                <div className="w-16 h-16 mb-3">
                    <Avatar
                        size={32}
                        src={current?.avatar}
                        icon={!current?.avatar && <UserOutlined />}
                        className="border-2 border-gray-200"
                    />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {current?.fullName || 'Người dùng'}
                </h3>
                <span className="text-sm text-gray-500 pb-2">
                    {current?.email}
                </span>
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