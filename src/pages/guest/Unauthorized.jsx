import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="p-8 space-y-6 mt-10">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
  
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Không có quyền truy cập</h1>
  
            <p className="mt-2 text-base text-gray-500">
              Bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập với tài khoản có quyền hoạt động.
            </p>
          </div>
  
          <div>
            <button
              className="w-full py-2 px-4 border-2 bg-main border-gray-300 text-white font-semibold rounded-md flex items-center justify-center gap-2"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              Quay về trang chủ
            </button>
          </div>
        </div>
    );
}

export default Unauthorized