import React, { useState, useEffect } from "react";
import { apiGetProducts, apiDeleteProduct } from "@/apis";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import {useSearchParams,useNavigate,createSearchParams} from "react-router-dom";
import { AddButton, SearchProduct, CategoryComboBox } from "@/components/admin";
import { Table, Modal, Button, message } from "antd";
import product_default from "@/assets/product_default.png";
import { SortItem } from "@/components";
import { sortProductOption } from "@/utils/constants";
import { RESPONSE_STATUS } from "@/utils/responseStatus";
import { ca } from "date-fns/locale";

const PAGE_SIZE = 10;

const Product = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(
    Number(params.get("page")) || 1
  );
  const [products, setProducts] = useState(null);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [productName, setProductName] = useState("");
  const categories = useSelector((state) => state.app.categories);
  const productSearch = params.get("search");
  const categorySearch = params.get("category");
  const sort = params.get("sort");
  const [sortOption, setSortOption] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const fetchProducts = async (queries) => {
    const filterString = queries.filter.join(" and ");
    const response = await apiGetProducts({
      ...queries,
      filter: filterString,
    });
    setProducts(response);
  };

  useEffect(() => {
    const filters = [];

    const searchTerm = params.get("search");
    const categorySearch = params.get("category");
    const sort = params.get("sort");

    if (searchTerm && searchTerm !== "null") {
      filters.push(`productName~'${searchTerm}'`);
    }

    if (categorySearch && categorySearch !== "null") {
      filters.push(`category.id='${categorySearch}'`);
    }
    // const sortQuery = null;
    const queries = {
      page: currentPage,
      size: PAGE_SIZE,
      filter: filters,
      // sort: sortQuery||"", 
    };
    if (sortOption) {
      const [sortField, sortDirection] = sortOption.split('-');
      queries.sort = `${sortField},${sortDirection}`;
    }
    fetchProducts(queries);
  }, [currentPage, params, selectedCategoryId, sortOption]);

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePagination = (page) => {
    setCurrentPage(page);
    const params = {};
    if (categorySearch) params.category = categorySearch;
    if (productSearch) params.search = productSearch;
    if (sort) params.sort = sort;
    params.page = page;
    navigate({
      search: createSearchParams(params).toString(),
    });
  };

  const handleDeleteProductProcess = (product) => {
    setDeleteProduct(product);
    setShowDeleteMessage(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await apiDeleteProduct(deleteProduct.id);
      if (res.statusCode === RESPONSE_STATUS.SUCCESS) {
        message.success("Xóa sản phẩm thành công!");
      }
      else {
        message.warning("Xóa sản phẩm thất bại! Có thể sản phẩm đã được mua bởi người dùng");
      }
      setShowDeleteMessage(false);

      const filters = [];
      const searchTerm = params.get("search");
      const categorySearch = params.get("category");
      const sort = params.get("sort");

      if (searchTerm && searchTerm !== "null") {
        filters.push(`productName~'${searchTerm}'`);
      }

      if (categorySearch && categorySearch !== "null") {
        filters.push(`category.id='${categorySearch}'`);
      }

      const queries = {
        page: currentPage,
        size: PAGE_SIZE,
        filter: filters,
      };

      if (sortOption) {
        const [sortField, sortDirection] = sortOption.split('-');
        queries.sort = `${sortField},${sortDirection}`;
      }

      fetchProducts(queries);

    } catch (error) {
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  const handleShowMessage = (detailProduct, productName) => {
    setMessageContent(`Chi tiết sản phẩm: ${detailProduct}`);
    setProductName(productName);
    setShowMessage(true);
  };
  useEffect(() => {
    const sortValue = params.get('sort') || '';
    setSortOption(sortValue);
  }, [params]);

  useEffect(() => {
    const params = {};
    if (selectedCategoryId) params.category = selectedCategoryId.id;
    if (productSearch) params.search = productSearch;
    if (sort) params.sort = sort;
    params.page = 1;
    navigate({
      search: createSearchParams(params).toString(),
    });
  }, [selectedCategoryId]);

  const handleSortChange = (selectedSort) => {
    setSortOption(selectedSort);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text, record) => (
        <img
          src={
            record.imageUrl
              || product_default
          }
          alt={record.product_name || "Product Image"}
          style={{ width: "90px", height: "70px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product_name",
      key: "product_name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Phân loại",
      dataIndex: "category",
      key: "category",
      render: (categorySlug) => {
        const category = categories?.find((cat) => cat.slug === categorySlug);
        return category ? category.name : "Không có phân loại";
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "Mô tả",
      key: "details",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            handleShowMessage(record.description, record.product_name)
          }
        >
          Xem mô tả
        </Button>
      ),
    },
    {
      title: "Sửa",
      key: "edit",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => navigate(`${location.pathname}/edit/${record.id}`)}
        >
          <MdModeEdit className="w-5 h-5 inline-block" />
        </Button>
      ),
    },
    {
      title: "Xóa",
      key: "delete",
      render: (_, record) => (
        <Button type="link" onClick={() => handleDeleteProductProcess(record)}>
          <MdDelete className="w-5 h-5 inline-block" />
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full pr-3 relative">
      <div className="flex-auto justify-center mb-5 ">
        <SearchProduct onSearch={handleSearch} />
      </div>
      <div className="flex items-center gap-4"></div>
      <div className="flex justify-between mb-2">
        <div className="w-1/4">
          <div>
            Phân loại:
            <CategoryComboBox
              onSelectCategory={(value) => {
                setSelectedCategoryId(value);
              }}
              search={true}
            />
          </div>
        </div>

        <div className="w-1/4">
          <SortItem
            sortOption={sortOption}
            setSortOption={setSortOption}
            sortOptions={sortProductOption}
          />
        </div>
      </div>
      <Table
        dataSource={products?.data?.result}
        columns={columns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          onChange: handlePagination,
          total: products?.data?.meta?.total,
          showSizeChanger: false
        }}
      />
      <Modal
        title="Xác nhận xóa sản phẩm"
        open={showDeleteMessage}
        onCancel={() => setShowDeleteMessage(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowDeleteMessage(false)}>
            Đóng
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleConfirmDelete}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
      </Modal>

      <Modal
        title={`Sản phẩm: ${productName}`}
        open={showMessage}
        onCancel={() => setShowMessage(false)}
        footer={[
          <Button key="close" onClick={() => setShowMessage(false)}>
            Đóng
          </Button>,
        ]}
      >
        <p>{messageContent}</p>
      </Modal>

      <div>
        <AddButton
          buttonName="+ Thêm sản phẩm mới"
          buttonClassName="bg-green-500 hover:bg-green-700"
          toLink="add"
        />
      </div>
    </div>
  );
};

export default Product;
