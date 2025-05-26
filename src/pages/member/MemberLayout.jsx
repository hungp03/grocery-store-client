import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import path from "@/utils/path";
import { Navigate, Outlet } from "react-router-dom";
import MemberSidebar from "@/components/sidebar/MemberSidebar";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { ClipLoader } from "react-spinners";

const MemberLayout = () => {
  const { isLoggedIn, current } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isLoggedIn || !current)
    return <Navigate to={`/${path.LOGIN}`} replace={true} />;

  return (
    <div className="w-full min-h-screen bg-gray-100 relative">
      {loading ? (
        <ClipLoader
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          color="#36d7b7"
          size={50}
        />
      ) : (
        <div className="flex min-h-screen relative">
          {/* Desktop sidebar */}
          {!isMobile && (
            <div className="fixed top-0 left-0 bottom-0 z-40">
              <MemberSidebar />
            </div>
          )}

          {!isMobile && <div className="w-[250px]" />}

          {/* Mobile: hamburger button */}
          {isMobile && (
            <>
              <Button
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="fixed top-4 left-4 z-50 bg-white shadow-md"
              />
              <Drawer
                title="Tài khoản"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                width={250}
                bodyStyle={{ padding: 0 }}
              >
                <MemberSidebar onNavigate={() => setDrawerVisible(false)} />
              </Drawer>
            </>
          )}

          {/* Main content */}
          <div className="flex-1 px-4 py-6">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberLayout;


