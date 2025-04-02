import path from "./path";
import icons from "./icons";
import { UserOutlined, HomeOutlined, HeartOutlined, HistoryOutlined, SettingOutlined} from "@ant-design/icons";
export const navigation = [
  {
    id: 1,
    value: "Trang chủ",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "Sản phẩm",
    path: `/${path.PRODUCTS_BASE}`,
  },
];
const { FaTruck, GiReturnArrow, SiAdguard, FaPhone } = icons

export const productExtraInfo = [{
  id: 1,
  title: 'Sản phẩm sạch',
  sub: 'Cam kết không chất bảo quản',
  icon: <SiAdguard />
},
{
  id: 2,
  title: 'Vận chuyển siêu tốc',
  sub: 'Đảm bảo nhận hàng trong 1 giờ với bán kính < 10km',
  icon: <FaTruck />
},
{
  id: 3,
  title: 'Hoàn trả miễn phí',
  sub: 'Trả hàng miễn phí khi có vấn đề phát sinh',
  icon: < GiReturnArrow />
},
{
  id: 4,
  title: 'Hỗ trợ 24/7',
  sub: 'Hoạt động liên tục kể cả thứ 7, CN',
  icon: <FaPhone />
}
]

export const voteOption = [
  {
    id: 1,
    text: "Rất tệ"
  },
  {
    id: 2,
    text: "Tệ"
  },
  {
    id: 3,
    text: "Bình thường"
  },
  {
    id: 4,
    text: "Tốt"
  },
  {
    id: 5,
    text: "Rất tốt"
  }
]

export const sortProductOption = [
  { value: 'productName-asc', label: 'Tên A-Z' },
  { value: 'productName-desc', label: 'Tên Z-A' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'rating-asc', label: 'Rating thấp' },
  { value: 'rating-desc', label: 'Rating cao' },
  { value: 'sold-desc', label: 'Bán chạy' },
  { value: 'createdAt-desc', label: 'Mới nhất' }
];

export const memberSidebarItems = [
  {
    key: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <UserOutlined />,
    label: 'Thông tin cá nhân',
  },
  {
    key: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <HeartOutlined />,
    label: 'Sản phẩm yêu thích',
  },
  {
    key: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <HistoryOutlined />,
    label: 'Sản phẩm đã mua',
  },
  {
    type: 'divider',
  },
  {
    key: `/${path.MEMBER}/${path.SETTING}`,
    icon: <SettingOutlined />,
    label: 'Cài đặt tài khoản',
  },
];

export const statusOrder = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: 'Pending',
    value: 0,
  },
  {
    label: 'In delivery',
    value: 1,
  },
  {
    label: "Succeed",
    value: 2,
  },
  {
    label: "Cancelled",
    value: 3,
  }
]
export const statusHideOrder = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: 'Unhide',
    value: true
  },
  {
    label: "Hide",
    value: false
  }
]
export const sortFeedbackOrder = [
  {
    label: "Default",
    value: "default"
  },
  {
    label: "Product",
    value: "product_name"
  },
  {
    label: "Rating Star",
    value: "ratingStar"
  },
  {
    label: "Updated Time",
    value: "updatedAt"
  }
]

export const AdminNavigationPath = [
  {
    id: 1,
    value: "Tổng quan",
    path: path.ADMIN_OVERVIEW
  },
  {
    id: 2,
    value: "Phân loại",
    path: path.ADMIN_CATEGORY
  },
  {
    id: 3,
    value: "Sản phẩm",
    path: path.ADMIN_PRODUCT
  },
  {
    id: 4,
    value: "Người sử dụng",
    path: path.ADMIN_USER
  },
  {
    id: 5,
    value: "Phản hồi",
    path: path.ADMIN_FEEDBACK
  },
  {
    id: 6,
    value: "Đơn đặt hàng",
    path: path.ADMIN_ORDER
  },
];