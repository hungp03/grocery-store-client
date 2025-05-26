import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiExportExcel } from "@/apis";
import icons from "@/utils/icons";
import { message } from "antd";

const { FaFileExport } = icons
function SearchProduct({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const productSearch = params.get("search");
  const categorySearch = params.get("category");
  const sort = params.get("sort")

  const handleExportExcel = async () => {
    try {
      const blob = await apiExportExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_data.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      message.error('Lỗi khi tải file!', { autoClose: 2000 });
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch()
      if (searchTerm.trim() === "") {
        navigate(`/admin/product`);
        window.location.reload()

      } else {
        navigate(
          `/admin/product?${new URLSearchParams({
            search: searchTerm.trim(),
            ...(categorySearch && { category: categorySearch }), // Include category if it exists
            ...(sort && { sort: sort }),
            page: 1
          }).toString()}`
        );
      }
    }
  };

  useEffect(() => {
    setSearchTerm(productSearch || "");
  }, [productSearch]);

  return (
    <div className="flex justify-between">
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-[500px] border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <button
        className="bg-main text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-4"
        onClick={handleExportExcel}
      >
        <FaFileExport />
        <span>Export</span>
      </button>

    </div>
  );
}

export default SearchProduct;