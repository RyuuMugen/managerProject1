import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconCash,
  IconAddressBook,
} from "@tabler/icons-react";
import { LinksGroupProps } from "../../_base/model/_base/LinksGroupProps";

export const _sideNavData: LinksGroupProps[] = [
  {
    label: "Trang chủ",
    icon: IconGauge,
    // link: "/",
  },
  {
    label: "Quản lý bán hàng",
    //  link: "/demo",
    icon: IconNotes,
    links: [
      {
        label: "Danh sách đơn hàng",
        link: "order-list",
      },
      {
        label: "Danh sách trạng thái đơn hàng",
        link: "/order-status",
      },
      {
        label: "Phương thức thanh toán",
        link: "payment",
      },
    ],
  },
  {
    label: "Thông tin địa chỉ",
    //  link: "/demo",
    icon: IconAddressBook,
    links: [
      {
        label: "Tỉnh/Thành phố",
        link: "province",
      },
      {
        label: "Quận/Huyện",
        link: "district",
      },
      {
        label: "Phường/Xã",
        link: "commune",
      },
    ],
  },
  {
    label: "Quản lý sản phẩm",
    // link: "",
    icon: IconCalendarStats,
    links: [
      {
        label: "Danh sách sản phẩm",
        link: "/product-list",
      },
      // {
      //   label: "Trao đổi của người dùng",
      //   link: "/user-comment",
      // },
      // {
      //   label: "Đánh giá của người dùng",
      //   link: "/product-list",
      // },
      // {
      //   label: "Bảng giá cập nhật",
      //   link: "/product-list",
      // },
      {
        label: "Danh mục sản phẩm",
        link: "/category",
      },
      // {
      //   label: "Danh mục cho SEO",
      //   link: "/item-seo",
      // },
      {
        label: "Danh mục thông số kỹ thuật",
        link: "/technical-common",
      },
      // {
      //   label: "Thuộc tính sản phẩm",
      //   link: "/property-list",
      // },

      // {
      //   label: "Danh mục cho SEO",
      //   link: "/product-list",
      // },
      // {
      //   label: "Danh sách thương hiệu",
      //   link: "/product-list",
      // },
      // {
      //   label: "Thuộc tính sản phẩm",
      //   link: "/product-list",
      // },
      {
        label: "Bộ sưu tập",
        link: "/collection",
      },
      // {
      //   label: "Nhóm thông số kỹ thuật",
      //   link: "/product-list",
      // },
      // {
      //   label: "SP/Dịch vụ đi kèm",
      //   link: "/product-list",
      // },
      {
        label: "Nhóm cấu hình sản phẩm",
        link: "/config-group",
      },
      {
        label: "Quản lý thuộc tính",
        link: "/attribute",
      },
      {
        label: "Danh sách thương hiệu",
        link: "brand",
      },
    ],
  },

  {
    label: "Quản lý bài viết",
    // /  link: "/menu",
    icon: IconPresentationAnalytics,
    links: [
      {
        label: "Danh mục bài viết",
        link: "article-category",
      },
      {
        label: "Bài viết",
        link: "/article-list",
      },
    ],
  },

  {
    label: "Combo Set",
    // /  link: "/menu",
    icon: IconPresentationAnalytics,
    links: [
      {
        label: "Danh sách",
        link: "combo-set",
      },
    ],
  },

  {
    label: "Quản lý khách hàng",
    // /  link: "/menu",
    icon: IconPresentationAnalytics,
    links: [
      {
        label: "Danh sách khách hàng",
        link: "/customer",
      },
      {
        label: "Danh sách nhóm khách hàng",
        link: "/customer-group",
      },
      // {
      //   label: "Danh sách khách hàng liên hệ",
      //   link: "/list-menu1",
      // },
      // {
      //   label: "Danh sách khách hàng góp ý",
      //   link: "/list-menu1",
      // },
      // {
      //   label: "Danh sách khách hàng nhập tin",
      //   link: "/list-menu1",
      // },
      {
        label: "Tổng hợp trao đổi của người dùng",
        link: "/user-comment",
      },
      {
        label: "Tổng hợp đánh giá của người dùng",
        link: "/user-review",
      },
    ],
  },
  {
    label: "Quản lý Marketing",
    // /  link: "/menu",
    icon: IconFileAnalytics,
    links: [
      // {
      //   label: "Khuyến mại theo sản phẩm",
      //   link: "/list-menu1",
      // },
      {
        label: "Phiếu giảm giá - Voucher",
        link: "/coupon",
      },
      {
        label: "Danh sách banner",
        link: "/banner",
      },
      {
        label: "Danh sách vị trí banner",
        link: "/banner-location",
      },
      // {
      //   label: "Banner pop-up",
      //   link: "/list-menu1",
      // },
      // {
      //   label: "Poster",
      //   link: "/list-menu1",
      // },
      // {
      //   label: "Hình nền website",
      //   link: "/list-menu1",
      // },
      {
        label: "Facebook Product Ads",
        link: "/product-ads-category",
      },
      // {
      //   label: "Cài biểu tượng giảm giá",
      //   link: "/list-menu1",
      // },
      {
        label: "Deal/giờ vàng",
        link: "/product-deal",
      },
      // {
      //   label: "Khuyến mại Build PC",
      //   link: "/list-menu1",
      // },
      // {
      //   label: "Upload Excel SEO sản phẩm",
      //   link: "/list-menu1",
      // },
      // {
      //   label: "Banner Popup",
      //   link: "/list-menu1",
      // },
    ],
  },
  {
    label: "Quản lý Nội dung",
    // /  link: "/menu",
    icon: IconAdjustments,
    links: [
      {
        label: "Danh sách nội dung cố định",
        link: "/fixed-content",
      },
      {
        label: "Danh sách danh mục nội dung cố định",
        link: "/fixed-content-type",
      },
      {
        label: "Danh sách media",
        link: "/media",
      },
      {
        label: "Danh sách danh mục media",
        link: "/media-group",
      },
      // {
      //   label: "Danh sách thương hiệu",
      //   icon: "logoMaps",
      //   path: "unit/home",
      // },
    ],
  },
  // {
  //   label: "Sản phẩm cấu hình",
  //   // /  link: "/menu",
  //   icon: IconLock,
  //   links: [
  //     {
  //       label: "Danh sách Menu",
  //       link: "/list-menu1",
  //     },
  //     // {
  //     //   label: "Danh sách thương hiệu",
  //     //   icon: "logoMaps",
  //     //   path: "unit/home",
  //     // },
  //   ],
  // },
  {
    label: "Xây dựng máy tính",
    // /  link: "/menu",
    icon: IconNotes,
    links: [
      {
        label: "Link kiện xây dựng",
        link: "/build-pc-accessory",
      },
      // {
      //   label: "Danh sách thương hiệu",
      //   icon: "logoMaps",
      //   path: "unit/home",
      // },
    ],
  },
  // {
  //   label: "Tản nhiệt nước",
  //   // /  link: "/menu",
  //   icon: IconNotes,
  //   links: [
  //     {
  //       label: "Danh sách Menu",
  //       link: "/list-menu1",
  //     },
  //     // {
  //     //   label: "Danh sách thương hiệu",
  //     //   icon: "logoMaps",
  //     //   path: "unit/home",
  //     // },
  //   ],
  // },
  {
    label: "Quản lý Trả góp",
    // /  link: "/menu",
    icon: IconCash,
    links: [
      {
        label: "Danh sách đơn hàng",
        link: "/installment-order",
      },
      {
        label: "Cài đặt trả góp",
        link: "/installment-setting",
      },
    ],
  },
  {
    label: "Quản lý Thống kê",
    // /  link: "/menu",
    icon: IconNotes,
    links: [
      {
        label: "Thống kê hành vi",
        link: "/behavioral-statistics",
      },
      {
        label: "Sản phẩm thêm vào giỏ nhiều",
        link: "/most-view-product",
      },
      {
        label: "Sản phẩm mua nhiều",
        link: "/most-add-cart-product",
      },
      {
        label: "Từ khoá tìm kiếm",
        link: "/search-keyword",
      },
    ],
  },
  {
    label: "Quản lý Hệ thống",
    // /  link: "/menu",
    icon: IconNotes,
    links: [
      {
        label: "Config Web",
        link: "/config-web",
      },
      {
        label: "Danh sách tag",
        link: "/tag",
      },
      {
        label: "Url redirect",
        link: "/url-redirect",
      },
    ],
  },
  {
    label: "Quản lý Form đăng ký",
    // /  link: "/menu",
    icon: IconNotes,
    links: [
      {
        label: "Chờ mua sản phẩm",
        link: "/collection-form",
      },
      // {
      //   label: "Danh sách thương hiệu",
      //   icon: "logoMaps",
      //   path: "unit/home",
      // },
    ],
  },
  {
    label: "Quản lý Thu cũ- Đổi mới",
    // /  link: "/menu",
    icon: IconNotes,
    links: [
      {
        label: "Sản phẩm",
        link: "/trade-in",
      },
      {
        label: "Đơn thu cũ",
        link: "/trade-in-order-old",
      },
      {
        label: "Đơn đổi mới",
        link: "/trade-in-order-new",
      },
    ],
  },
  // {
  //   label: "Quản lý Combo Set",
  //   // /  link: "/menu",
  //   icon: IconNotes,
  //   links: [
  //     {
  //       label: "Danh sách",
  //       link: "/list-menu1",
  //     },
  //   ],
  // },
];
