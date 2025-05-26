import React, { useState, useEffect, memo } from "react";
import logo from "@/assets/logo.png";
import icons from "@/utils/icons";
import { Link } from "react-router-dom";
import path from "@/utils/path";
import { useSelector } from "react-redux";
import { SearchBar } from "@/components";
import { useLocation } from 'react-router-dom';
import withBaseComponent from "@/hocs/withBaseComponent";

const { FaUserCircle, FaCartShopping, FaBars, FaTimes } = icons;

const Header = ({ navigate }) => {
  const location = useLocation();
  const hideSearch = location.pathname.includes('/admin');
  const { current } = useSelector(state => state.user);

  const [isShowOption, setIsShowOption] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutOption = (e) => {
      const profile = document.getElementById('profile');
      if (!profile?.contains(e.target)) setIsShowOption(false);
    };
    document.addEventListener('click', handleClickOutOption);
    return () => {
      document.removeEventListener('click', handleClickOutOption);
    };
  }, []);

  return (
    <header className="w-full">
    <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto h-[110px] py-[35px] px-4 md:px-0 relative">

      <Link to={`/${path.HOME}`}>
        <img src={logo} alt="logo" className="w-[80px] md:w-[120px] object-contain" />
      </Link>

      {!hideSearch && (
        <div className="hidden md:block flex-1 mx-4">
          <SearchBar />
        </div>
      )}


      <div className="ml-auto hidden md:flex">

        <div
          className="relative cursor-pointer flex items-center justify-center gap-2 px-2 md:px-5"
          onClick={() => navigate(`/${path.CART}`)}
        >
          <FaCartShopping color="#10B981" size={20} className="md:w-[25px] md:h-[25px]" />
          <span className="hidden md:block">Giỏ hàng</span>
        </div>


        <div
          className="ml-4 border-l cursor-pointer flex items-center justify-center px-2 md:px-5 gap-2 relative"
          onClick={() => setIsShowOption(prev => !prev)}
          id="profile"
        >
          <FaUserCircle color="#10B981" size={20} className="md:w-[25px] md:h-[25px]" />
          <span className="hidden md:block">Tài khoản</span>
          {isShowOption && current && (
            <div
              onClick={e => e.stopPropagation()}
              className="z-10 absolute mt-4 flex flex-col top-full right-0 bg-gray-100 border min-w-[150px] py-2"
            >
              <Link className="p-2 hover:bg-sky-100" to={`/${path.MEMBER}/${path.PERSONAL}`}>Trang cá nhân</Link>
              {current?.role.roleName === "ADMIN" && (
                <Link className="p-2 hover:bg-sky-100" to={`/${path.ADMIN}/${path.ADMIN_OVERVIEW}`}>Trang quản trị</Link>
              )}
            </div>
          )}
        </div>
      </div>


      <div className="md:hidden flex items-center ml-auto">
        <button onClick={() => setIsMobileMenuOpen(prev => !prev)}>
          {isMobileMenuOpen ? (
            <FaTimes size={24} />
          ) : (
            <FaBars size={24} />
          )}
        </button>
      </div>


      {isMobileMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-full bg-white shadow-md border md:hidden z-50">
          {!hideSearch && (
            <div className="p-2 border-b">
              <SearchBar />
            </div>
          )}
          <div className="flex flex-col p-2 gap-2">
            <button
              onClick={() => {
                navigate(`/${path.CART}`);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <FaCartShopping color="#10B981" size={20} />
              <span>Giỏ hàng</span>
            </button>

            <button
              onClick={() => setIsShowOption(prev => !prev)}
              className="flex items-center gap-2"
              id="profile-mobile"
            >
              <FaUserCircle color="#10B981" size={20} />
              <span>Tài khoản</span>
            </button>

            {isShowOption && current && (
              <div
                onClick={e => e.stopPropagation()}
                className="flex flex-col mt-1 bg-gray-100 border rounded"
              >
                <Link
                  className="p-2 hover:bg-sky-100"
                  to={`/${path.MEMBER}/${path.PERSONAL}`}
                  onClick={() => {
                    setIsShowOption(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Trang cá nhân
                </Link>
                {current?.role.roleName === "ADMIN" && (
                  <Link
                    className="p-2 hover:bg-sky-100"
                    to={`/${path.ADMIN}/${path.ADMIN_OVERVIEW}`}
                    onClick={() => {
                      setIsShowOption(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Trang quản trị
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </header>
  );
};

export default withBaseComponent(memo(Header));
