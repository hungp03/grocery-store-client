
import React, { useState, useEffect, memo } from "react";
import logo from "@/assets/logo.png";
import icons from "@/utils/icons";
import { Link } from "react-router-dom";
import path from "@/utils/path";
import { useSelector } from "react-redux";
import { SearchBar } from "@/components";
import { useLocation } from 'react-router-dom';
import withBaseComponent from "@/hocs/withBaseComponent";

const { FaUserCircle, FaCartShopping } = icons;

const Header = ({ navigate }) => {
  const location = useLocation();
  const hideSearch = location.pathname.includes('/admin');
  const { current } = useSelector(state => state.user)
  const [isShowOption, setIsShowOption] = useState(false)
  useEffect(() => {
    const handleClickOutOption = (e) => {
      const profile = document.getElementById('profile')
      if (!profile?.contains(e.target)) setIsShowOption(false)
    }
    document.addEventListener('click', handleClickOutOption)
    return () => {
      document.removeEventListener('click', handleClickOutOption)
    }
  }, [])


  return (
    <div className="flex justify-between items-center w-main h-[110px] py-[35px]">
      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[120px] object-contain" />
      </Link>
      {!hideSearch && <SearchBar />}
      <div className="ml-auto flex">
        <div
          className="relative cursor-pointer flex items-center justify-center gap-2 px-5"
          onClick={() => navigate(`/${path.CART}`)}
        >
          <FaCartShopping color="#10B981" size={25} />
            <span className="rounded-full flex items-center justify-center">
              Giỏ hàng
            </span>
        </div>


        <div className="ml-4 border-l cursor-pointer flex items-center justify-center px-5 gap-2 relative"
          onClick={() => setIsShowOption(prev => !prev)}
          id="profile"
        >
          <FaUserCircle color="#10B981" size={25} />
          <span>Tài khoản</span>
          {isShowOption && current && <div onClick={e => e.stopPropagation()} className="z-10 absolute mt-4 flex flex-col top-full left-0 bg-gray-100 border min-w-[150px] py-2">
            <Link className="p-2 w-full hover:bg-sky-100" to={`/${path.MEMBER}/${path.PERSONAL}`} >Trang cá nhân</Link>
            {current?.role.roleName === "ADMIN" && <Link
              className="p-2 w-full hover:bg-sky-100" to={`/${path.ADMIN}/${path.ADMIN_OVERVIEW}`} >Trang quản trị</Link>}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default withBaseComponent(memo(Header));