import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import path from "@/utils/path";
import { Overview, Feedback, OrderDetail, EditCategory, EditProduct, Category, Order, Product, User, AddCategory, AddProduct } from './index';
import { useSelector } from "react-redux";
import { useRef } from 'react';
import { AdminLayout } from "@/components/admin";
import { jwtDecode } from "jwt-decode";
const Admin = () => {
  const { isLoggedIn, token } = useSelector(state => state.user);
  const [unauthorized, setUnauthorized] = useState(false)
  const isMounted = useRef(false);
  const lastMount = async () => {
    try {
      if (isMounted.current) {
        if (!token || !isLoggedIn) {
          setUnauthorized(true);
        }
        else {
          const decoded = jwtDecode(token);
          if (!decoded.authorities.includes("ROLE_ADMIN")) {
            setUnauthorized(true);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    lastMount();

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  if (unauthorized) {
    return <Navigate to={`/${path.UNAUTHORIZED}`} replace={true} />;
  }

  return (
    <div className="min-h-screen font-main">
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path={path.ADMIN_OVERVIEW} element={<Overview />}></Route>
          <Route path={path.ADMIN_PRODUCT} element={<Product />}></Route>
          <Route path={path.ADMIN_EDIT_PRODUCT} element={<EditProduct />}></Route>
          <Route path={path.ADD_PRODUCT} element={<AddProduct />}></Route>
          <Route path={path.ADMIN_CATEGORY} element={<Category />}></Route>
          <Route path={path.ADMIN_EDIT_CATEGORY} element={<EditCategory />}></Route>
          <Route path={path.ADD_CATEGORY} element={<AddCategory />}></Route>
          <Route path={path.FEEDBACK} element={<Feedback />}></Route>
          <Route path={path.ADMIN_ORDER} element={<Order />}></Route>
          <Route path={path.ADMIN_ORDER_DETAIL} element={<OrderDetail />}></Route>
          <Route path={path.ADMIN_USER} element={<User />}></Route>
        </Route>
      </Routes>
    </div>
  )
};

export default Admin;
