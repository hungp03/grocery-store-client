import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { memberSidebarItems } from '@/utils/constants';
import logo from '@/assets/logo.png'

const MemberSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <div className="h-full bg-white rounded-lg shadow-md p-4">
            <div className="mb-6 flex flex-col items-center border-b pb-4">
                <div className="h-16 mb-3">
                    <Link to="/">
                        <img src={logo} alt="logo" className="h-full" />
                    </Link>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 px-4">
                    Tài khoản của tôi
                </h3>
            </div>


            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={memberSidebarItems}
                onClick={handleMenuClick}
                className="border-r-0 text-[15px]"
            />
        </div>
    );
};

export default memo(MemberSidebar);