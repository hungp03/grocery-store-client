import React, { useEffect } from 'react'
import path from '@/utils/path'
import { Route, Routes } from "react-router-dom";
import { Login, Home, Public, ProductDetail, Product, ResetPassword, CartDetail, Checkout, ErrorPage, PaymentSuccess, PaymentFailure } from "@/pages/guest";
import { MemberLayout, Personal, Wishlist, History, Setting } from '@/pages/member';
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "@/store/app/asyncActions";
import { Modal } from '@/components';
import { Admin, Feedback } from "./pages/admin/index";
import ScrollToTop from '@/utils/ScrollToTop.jsx';

const App = () => {

  const dispatch = useDispatch();
  const { isShowModal, modalChildren } = useSelector(state => state.app)
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div id="main-wrapper" className="min-h-screen font-main relative">
      <ScrollToTop />
      {isShowModal && <Modal>{modalChildren}</Modal>}
      <Routes>
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />}></Route>
          <Route path={path.PRODUCTS_BASE} element={<Product />}></Route>
          <Route path={path.PRODUCTS} element={<Product />}></Route>
          <Route path={path.PRODUCT_DETAIL} element={<ProductDetail />}></Route>
          <Route path={path.CART} element={<CartDetail />}></Route>
          <Route path={path.CHECKOUT} element={<Checkout />}></Route>
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />}></Route>
          <Route path="/error" element={<ErrorPage />} />
          <Route path='*' element={<ErrorPage />}></Route>
          <Route path={path.PAYMENT_SUCCESS} element={<PaymentSuccess />}></Route>
          <Route path={path.PAYMENT_FAILURE} element={<PaymentFailure />}></Route>
        </Route>
        <Route path={path.ADMIN_LAYOUT} element={<Admin />}>
          <Route path={path.FEEDBACK} element={<Feedback />}></Route>
        </Route>
        <Route path={path.MEMBER} element={<MemberLayout />}>
          <Route path={path.PERSONAL} element={<Personal />}></Route>
          <Route path={path.HISTORY} element={<History />}></Route>
          <Route path={path.WISHLIST} element={<Wishlist />}></Route>
          <Route path={path.SETTING} element={<Setting />}></Route>
        </Route>
        <Route path={path.LOGIN} element={<Login />}></Route>
      </Routes>
    </div>
  );
}

export default App
