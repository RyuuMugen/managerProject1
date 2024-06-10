import { createBrowserRouter } from "react-router-dom";
import _404 from "../../_base/component/_layout/_404";
import { Layout } from "../../_base/component/_layout/_layout";
import { LayoutAuth } from "../../_base/component/_layout/_layoutAuth";
import { AuthenticationTitle } from "../../_base/component/_login/_login";
import { SubmitPassRecovery } from "../../_base/component/_passRecovery/_passrecovery";
import { SelectListItem } from "../../model/SelectListItem";
import Commune from "../../views/Address/Commune";
import District from "../../views/Address/District";
import Province from "../../views/Address/Province";
import OrderList from "../../views/Sell/OrderList/OrderList";
import ProductList from "../../views/ProductManager/ProductList/MainView";
import TechnicalCommon from "../../views/ProductManager/TechnicalCommon/MainView";
import PaymentMethod from "../../views/Sell/PaymentMethod";
import Home from "../../views/home/homeView";
import CategoryFeatureView from "../../views/Category/CategoryFeatureView/categoryFeatureView";
import Brand from "../../views/Sell/Brand";
// import Brand from "../../views/Brand"
import HomeView from "../../views/Category/homeView";
import HomeAttrView from "../../views/Attribute/homeView";
import CategoryAttrManagerView from "../../views/Category/categoryAttrManager";
import ArticleCategory from "../../views/Article/ArticleCategory";
import ArticleList from "../../views/Article/ArticleList";
import ComboSet from "../../views/ComboSet";
import FixedContentType from "../../views/Content/FixedContentType";
import FixedContent from "../../views/Content/FixedContent";
import ConfigWeb from "../../views/ConfigWeb/MainView";
import Tags from "../../views/System/Tags/MainView";
import OrderStatus from "../../views/Sell/OrderStatusList";
import CreateView from "../../views/ComboSet/CreateView";
import EditView from "../../views/ComboSet/EditView";
import MediaGroup from "../../views/Content/MediaGroup";
import Media from "../../views/Content/Media";
import { AuthenticationRegister } from "../../_base/component/_register/_register";
import Customer from "../../views/CustomerManager/Customer";
import CustomerGroup from "../../views/CustomerManager/CustomerGroup";
import ProductAdsCategory from "../../views/Marketing/ProductAdsCategory";
import ProductAdsList from "../../views/Marketing/ProductAdsList/ProductAdsList";
import CouponsList from "../../views/Marketing/Coupons/MainIndex";
import EditCoupon from "../../../src/views/Marketing/Coupons/EditCoupons";
import AddCoupon from "../../../src/views/Marketing/Coupons/CreateCoupons";
import BannerManager from "../../views/Marketing/BannerManager";
import BannerLocation from "../../views/Marketing/BannerLocation";
import UserCommentList from "../../views/UserManager/UserCommentList";
import UserReviewList from "../../views/UserManager/UserReviewList";
import ProductDealManager from "../../views/Marketing/ProductDealManager";
import BuildPcAccessory from "../../views/BuildPcAccessory";
import ConfigGroup from "../../views/ProductManager/ConfigGroup";
import EditViewConfigGroup from "../../views/ProductManager/ConfigGroup/EditView/EditViewConfigGroup";
import TradeInOrderOld from "../../views/TradeInManager/TradeInOrderOld";
import TradeInOrderNew from "../../views/TradeInManager/TradeInOrderNew";
import TradeIn from "../../views/TradeInManager/TradeIn";
import Collection from "../../views/ProductManager/ProductCollection";
import CollectionProdList from "../../views/ProductManager/ProductCollection/CollectionProdList/CollectionProdList";
import UrlRedirect from "../../views/System/UrlRedirect/MainView";
import InstallmentOrder from "../../views/Installment/InstallmentOrder/MainView";
import InstallmentSetting from "../../views/Installment/InstallmentSetting/MainView";
import TradeInProductList from "../../views/TradeInManager/TradeInProduct/TradeInProductList";
import CollectionForm from "../../views/RegistrationForm/CollectionForm";
import BehavioralStatistics from "../../views/Statistical/BehavioralStatistics";
import SearchKeyword from "../../views/Statistical/SearchKeyword";
import MostViewProduct from "../../views/Statistical/MostViewProduct";
import MostAddCartProduct from "../../views/Statistical/MostAddCartProduct";

const router = createBrowserRouter([
  {
    // path: "/",
    id: "root",
    element: <Layout />,
    errorElement: <_404 />,
    action: async ({ request }) => {
      // if (auth)
      //  return protectedLoader;
    },
    children: [
      {
        path: "/",
        element: <Home />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: false,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Trang chủ";
            model.Value = "/";
            return model;
          },
        },
      },
      {
        path: "/category",
        children: [
          {
            index: true,
            element: (
              <>
                <HomeView></HomeView>
              </>
            ),
            handle: {
              crumb: () => {
                let model: SelectListItem = {
                  Disabled: true,
                  Group: null,
                  Selected: false,
                  Text: "",
                  Value: "",
                };
                model.Text = "Danh mục sản phẩm";
                model.Value = "/category";
                return model;
              },
            },
          },
          {
            path: "/category/category-feature/:cat_id",
            index: true,
            element: <CategoryFeatureView />,
            handle: {
              crumb: () => {
                let model: SelectListItem = {
                  Disabled: false,
                  Group: null,
                  Selected: false,
                  Text: "",
                  Value: "",
                };
                model.Text = "Nội dung nổi bật của danh mục";
                model.Value = "/category/category-feature/:cat_id";
                return model;
              },
            },
          },
          {
            path: "/category/category-attr/:cat_id",
            index: true,
            element: <CategoryAttrManagerView />,
            handle: {
              crumb: () => {
                let model: SelectListItem = {
                  Disabled: false,
                  Group: null,
                  Selected: false,
                  Text: "",
                  Value: "",
                };
                model.Text = "Thuộc của danh mục";
                model.Value = "/category/category-attr/:cat_id";
                return model;
              },
            },
          },
        ],
      },
      {
        path: "/product-list",
        element: <ProductList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách sản phẩm";
            model.Value = "/product";
            return model;
          },
        },
      },

      {
        path: "/technical-common",
        element: <TechnicalCommon />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh mục thông số kỹ thuật";
            model.Value = "/technical-common";
            return model;
          },
        },
      },
      {
        path: "/order-list",
        element: <OrderList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách đơn hàng";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/payment",
        element: <PaymentMethod />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách phương thức thanh toán";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/order-status",
        element: <OrderStatus />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách trạng thái đơn hàng";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/brand",
        element: <Brand />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách Thương hiệu";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/commune",
        element: <Commune />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách Phường/Xã";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/province",
        element: <Province />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách Tỉnh/Thành phố";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/district",
        element: <District />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách Quận/Huyện";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/attribute",
        element: <HomeAttrView />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách thuộc tính";
            model.Value = "/attribute";
            return model;
          },
        },
      },
      {
        path: "/article-category",
        element: <ArticleCategory />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Nhóm bài viết";
            model.Value = "/article-category";
            return model;
          },
        },
      },
      {
        path: "/article-list",
        element: <ArticleList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách bài viết";
            model.Value = "/article-category";
            return model;
          },
        },
      },

      {
        path: "/combo-set",
        element: <ComboSet />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách";
            model.Value = "/combo-set";
            return model;
          },
        },
      },
      {
        path: "/combo-set-add",
        element: <CreateView />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách";
            model.Value = "/combo-set";
            return model;
          },
        },
      },
      {
        path: "/combo-set-edit",
        element: <EditView />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách";
            model.Value = "/combo-set";
            return model;
          },
        },
      },

      {
        path: "/fixed-content",
        element: <FixedContent />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách nội dung cố định";
            model.Value = "/fixed-content";
            return model;
          },
        },
      },
      {
        path: "/fixed-content-type",
        element: <FixedContentType />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách danh mục nội dung cố định";
            model.Value = "/fixed-content-type";
            return model;
          },
        },
      },
      {
        path: "/config-web",
        element: <ConfigWeb />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Config Web";
            model.Value = "/config-web";
            return model;
          },
        },
      },
      {
        path: "/tag",
        element: <Tags />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách tag";
            model.Value = "/tag";
            return model;
          },
        },
      },
      {
        path: "/media",
        element: <Media />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách media";
            model.Value = "/media";
            return model;
          },
        },
      },
      {
        path: "/media-group",
        element: <MediaGroup />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách danh mục media";
            model.Value = "/media-group";
            return model;
          },
        },
      },
      {
        path: "/customer",
        element: <Customer />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách khách hàng";
            model.Value = "/customer";
            return model;
          },
        },
      },
      {
        path: "/customer-group",
        element: <CustomerGroup />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách nhóm khách hàng";
            model.Value = "/customer-group";
            return model;
          },
        },
      },

      {
        path: "/product-ads-category",
        element: <ProductAdsCategory />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Facebook Product Ads";
            model.Value = "/product-ads-category";
            return model;
          },
        },
      },
      {
        path: "/product-ads",
        element: <ProductAdsList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách Product Ads";
            model.Value = "/product-ads";
            return model;
          },
        },
      },
      {
        path: "/banner",
        element: <BannerManager />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách Banner";
            model.Value = "/banner";
            return model;
          },
        },
      },
      {
        path: "/banner-location",
        element: <BannerLocation />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Quản lý vị trí Banner";
            model.Value = "/banner-location";
            return model;
          },
        },
      },
      {
        path: "/coupon",
        element: <CouponsList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Coupon khuyến mại";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/coupons-set-edit",
        element: <EditCoupon />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/coupon-set-add",
        element: <AddCoupon />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách";
            model.Value = "/menu";
            return model;
          },
        },
      },
      {
        path: "/user-comment",
        element: <UserCommentList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Trao đổi người dùng";
            model.Value = "/user-comment";
            return model;
          },
        },
      },
      {
        path: "/user-review",
        element: <UserReviewList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Đánh giá người dùng";
            model.Value = "/user-review";
            return model;
          },
        },
      },
      {
        path: "/product-deal",
        element: <ProductDealManager />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Deal/Giờ vàng";
            model.Value = "/product-deal";
            return model;
          },
        },
      },
      {
        path: "/build-pc-accessory",
        element: <BuildPcAccessory />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Link kiện xây dựng";
            model.Value = "/build-pc-accessory";
            return model;
          },
        },
      },
      {
        path: "/config-group",
        element: <ConfigGroup />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Nhóm cấu hình sản phẩm";
            model.Value = "/config-group";
            return model;
          },
        },
      },
      {
        path: "/config-group-edit",
        element: <EditViewConfigGroup />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Nhóm cấu hình sản phẩm";
            model.Value = "/config-group-edit";
            return model;
          },
        },
      },
      {
        path: "/trade-in-order-old",
        element: <TradeInOrderOld />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Đơn thu cũ";
            model.Value = "/trade-in-order-old";
            return model;
          },
        },
      },
      {
        path: "/trade-in-order-new",
        element: <TradeInOrderNew />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Đơn đổi mới";
            model.Value = "/trade-in-order-new";
            return model;
          },
        },
      },
      {
        path: "/trade-in",
        element: <TradeIn />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Nhóm sản phẩm thu/đổi";
            model.Value = "/trade-in";
            return model;
          },
        },
      },
      {
        path: "/trade-in-product",
        element: <TradeInProductList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Sản phẩm nhóm";
            model.Value = "/trade-in-product";
            return model;
          },
        },
      },
      {
        path: "/collection",
        element: <Collection />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Bộ sưu tập";
            model.Value = "/collection";
            return model;
          },
        },
      },
      {
        path: "/product-collection",
        element: <CollectionProdList />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Sản phẩm bộ sưu tập";
            model.Value = "/product-collection";
            return model;
          },
        },
      },
      {
        path: "/url-redirect",
        element: <UrlRedirect />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Url Redirect";
            model.Value = "/url-redirect";
            return model;
          },
        },
      },
      {
        path: "/installment-order",
        element: <InstallmentOrder />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Installment Order";
            model.Value = "/installment-order";
            return model;
          },
        },
      },
      {
        path: "/installment-setting",
        element: <InstallmentSetting />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Installment setting";
            model.Value = "/installment-setting";
            return model;
          },
        },
      },
      {
        path: "/collection-form",
        element: <CollectionForm />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Danh sách chờ mua sản phẩm";
            model.Value = "/collection-form";
            return model;
          },
        },
      },

      {
        path: "/behavioral-statistics",
        element: <BehavioralStatistics />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Thống kê hành vi";
            model.Value = "/behavioral-statistics";
            return model;
          },
        },
      },
      {
        path: "/search-keyword",
        element: <SearchKeyword />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Từ khoá tìm kiếm";
            model.Value = "/search-keyword";
            return model;
          },
        },
      },
      {
        path: "/most-view-product",
        element: <MostViewProduct />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Sản phẩm xem nhiều";
            model.Value = "/most-view-product";
            return model;
          },
        },
      },
      {
        path: "/most-add-cart-product",
        element: <MostAddCartProduct />,
        handle: {
          crumb: () => {
            let model: SelectListItem = {
              Disabled: true,
              Group: null,
              Selected: false,
              Text: "",
              Value: "",
            };
            model.Text = "Sản phẩm thêm vào giỏ nhiều";
            model.Value = "/most-add-cart-product";
            return model;
          },
        },
      },
    ],
  },

  {
    path: "auth",
    element: <LayoutAuth />, // Define your Auth layout component here
    children: [
      {
        path: "login",
        element: <AuthenticationTitle />, // Create a Login page component
      },
      {
        path: "register",
        element: <AuthenticationRegister />, // Create a Login page component
      },
      {
        path: "recovery",
        element: <SubmitPassRecovery />,
      },

      // Add more authentication-related routes here
    ],
  },
]);

export default router;
