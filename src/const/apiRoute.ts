export const API_ROUTE = {
  // Product
  HOME: "/home-hacom",
  GET_LIST_PRODUCT: "/TblItem/get-list",
  GET_DETAIL_PRODUCT: "TblItem/edit",
  CREATE_PRODUCT: "/TblItem/create",
  DELETE_PRODUCT: "/TblItem/delete",
  MODIFY_PRODUCT: "/TblItem/edit",
  MODIFY_FEATURE: "/TblItem/edit-featured",
  MODIFY_ITEM_IN_USE: "/TblItem/update-status?id=",
  MODIFY_ITEM_ORDER: "/TblItem/update-order",

  //elasticsearch
  REMOVE_BY_INDEX_NAME:
    "/JobApi/remove-by-index-name?Index=elasticsearch-tblitem",
  SYNC_ITEM: "/JobApi/sync-item",

  GET_LIST_ITEM_SEO: "/TblItemSeo/get-list",
  CREATE_ITEM_SEO: "/TblItemSeo/create",
  DELETE_ITEM_SEO: "/TblItemSeo/delete",
  MODIFY_ITEM_SEO: "/TblItemSeo/edit",

  GET_LIST_TECHNICAL_COMMON: "/TblTechnicalCommon/get-by-key",
  CREATE_TECHNICAL_COMMON: "/TblTechnicalCommon/create",
  DELETE_TECHNICAL_COMMON: "/TblTechnicalCommon/delete",
  MODIFY_TECHNICAL_COMMON: "/TblTechnicalCommon/edit",

  GET_LIST_ATTRIBUTE: "/TblAttribute/get-list",
  GET_ALL_ATTRIBUTE: "/TblAttribute/get-all",
  DETAILS_ATTRIBUTE: "/TblAttribute/details",
  CREATE_ATTRIBUTE: "/TblAttribute/create",
  DELETE_ATTRIBUTE: "/TblAttribute/delete",
  MODIFY_ATTRIBUTE: "/TblAttribute/edit",
  STATUS_ATTRIBUTE: "/TblAttribute/disable",
  ORDERNUMBER_ATTRIBUTE: "/TblAttribute/edit-order",
  GET_LIST_ATTRIBUTE_FILTER: "/TblAttribute/get-list-filter",

  // Mega Menu
  GET_LIST_CATEGORY: "/TblCategory/get-list",
  GET_ALL_CATEGORY: "/TblCategory/get-all",
  CREATE_CATEGORY: "/TblCategory/create",
  DELETE_CATEGORY: "/TblCategory/delete",
  MODIFY_CATEGORY: "/TblCategory/edit",
  EditPriority: "/TblCategory/edit-priority",
  status: "/TblCategory/disable",
  ordernumber: "/TblCategory/edit-order",
  status_attr: "/TblCategory/disable-attr",
  ordernumber_attr: "/TblCategory/edit-order-attr",
  category_attr_list: "/TblCategory/get-attr",
  category_attr_edit: "/TblCategory/edit-attr",
  category_attr_delete: "/TblCategory/delete-attr",
  category_attr_select: "/TblCategory/get-attr-select",
  GET_CAT_TRADE_IN_PRODUCT: "TblCategory/get-cat-trade-in-product",
  GET_CATEGORY_TREE: "TblCategory/get-category-tree",

  //Address
  GET_LIST_COMMUNE: "/TblCommune/get-list",
  CREATE_COMMUNE: "/TblCommune/create",
  DELETE_COMMUNE: "/TblCommune/delete",
  MODIFY_COMMUNE: "/TblCommune/edit",
  DETAIL_COMMUNE: "/TblCommune/details?id=",

  GET_LIST_DISTRICT: "/TblDistrict/get-list",
  CREATE_DISTRICT: "/TblDistrict/create",
  DELETE_DISTRICT: "/TblDistrict/delete",
  MODIFY_DISTRICT: "/TblDistrict/edit",
  DETAIL_DISTRICT: "/TblDistrict/details?id=",

  GET_LIST_PROVINCE: "/TblProvince/get-list",
  CREATE_PROVINCE: "/TblProvince/create",
  DELETE_PROVINCE: "/TblProvince/delete",
  MODIFY_PROVINCE: "/TblProvince/edit",
  DETAIL_PROVINCE: "/TblProvince/details?id=",

  //Sell
  GET_LIST_PAYMENT_METHOD: "/TblPaymentMethod/get-list",
  CREATE_PAYMENT: "/TblPaymentMethod/create",
  MODIFY_PAYMENT: "/TblPaymentMethod/edit",
  DELETE_PAYMENT: "/TblPaymentMethod/delete",

  GET_LIST_BRAND: "/TblBrand/get-by-key",
  CREATE_BRAND: "/TblBrand/create",
  MODIFY_BRAND: "/TblBrand/edit",
  DELETE_BRAND: "/TblBrand/delete",
  DETAIL_BRAND: "/TblBrand/details?id=",
  MODIFY_BRAND_STATUS: "/TblBrand/edit-status?Id=",
  MODIFY_BRAND_PRIORITY: "/TblBrand/edit-priority?Id=",
  MODIFY_BRAND_ORDER: "/TblBrand/edit-order?Id=",

  //Article
  GET_LIST_ARTICLE_CATEGORY: "/TblArticleCategory/get-list",
  CREATE_ARTICLE_CATEGORY: "/TblArticleCategory/create",
  DELETE_ARTICLE_CATEGORY: "/TblArticleCategory/delete",
  MODIFY_ARTICLE_CATEGORY: "/TblArticleCategory/edit",

  //Article list
  GET_LIST_ARTICLE_LIST: "/TblArticle/get-list",
  CREATE_ARTICLE_LIST: "/TblArticle/create",
  DELETE_ARTICLE_LIST: "/TblArticle/delete",
  MODIFY_ARTICLE_LIST: "/TblArticle/edit",
  MODIFY_ARTICLE_LIST_STATUS: "/TblArticle/edit-status?id=",
  MODIFY_ARTICLE_LIST_STICKING: "/TblArticle/edit-sticking?id=",
  MODIFY_ARTICLE_LIST_ORDER: "/TblArticle/edit-order?id=",

  // Combo set

  GET_LIST_COMBO_SET: "/TblComboSet/get-list",
  CREATE_COMBO_SET: "/TblComboSet/create",
  DELETE_COMBO_SET: "/TblComboSet/delete",
  MODIFY_COMBO_SET: "/TblComboSet/edit",
  //FixContentType
  GET_LIST_FIX_CONTENT_TYPE: "/TblFixedContentType/get-list",
  CREATE_FIX_CONTENT_TYPE: "/TblFixedContentType/create",
  DELETE_FIX_CONTENT_TYPE: "/TblFixedContentType/delete",
  MODIFY_FIX_CONTENT_TYPE: "/TblFixedContentType/edit",
  DETAIL_FIX_CONTENT_TYPE: "/TblFixedContentType/details?id=",
  STATUS_FIX_CONTENT_TYPE: "/TblFixedContentType/edit-status",

  //FixContent
  GET_LIST_FIX_CONTENT: "/TblFixedContent/get-list",
  CREATE_FIX_CONTENT: "/TblFixedContent/create",
  DELETE_FIX_CONTENT: "/TblFixedContent/delete",
  MODIFY_FIX_CONTENT: "/TblFixedContent/edit",
  DETAIL_FIX_CONTENT: "/TblFixedContent/details?id=",
  STATUS_FIX_CONTENT: "/TblFixedContent/edit-status",

  //ConfigWeb
  GET_CONFIG_WEB: "/TblConfigWeb/details",
  MODIFY_CONFIG_WEB: "/TblConfigWeb/edit",

  //Tag
  GET_LIST_TAG: "/TblTag/get-list",
  CREATE_TAG: "/TblTag/create",
  DELETE_TAG: "/TblTag/delete",
  MODIFY_TAG: "/TblTag/edit",
  DETAIL_TAG: "/TblTag/details?id=",

  //SaleOrder
  GET_LIST_SALE_ORDER: "/tblSaleOrder/get-list",
  DELETE_SALE_ORDER: "/tblSaleOrder/delete",
  MODIFY_SALE_ORDER: "/tblSaleOrder/edit",
  DETAIL_SALE_ORDER: "/tblSaleOrder/details?id=",
  MODIFY_ORDER_ASSIGN: "/tblSaleOrder/assign",
  MODIFY_SALE_ORDER_EDIT_STATUS: "/tblSaleOrder/edit-status",
  FORWARD_SALE_ORDER_POS: "/tblSaleOrder/forward",

  //SaleOrderStatus
  GET_LIST_ORDER_STATUS: "/TblSaleOrderStatus/get-list",
  CREATE_ORDER_STATUS: "/TblSaleOrderStatus/create",
  MODIFY_ORDER_STATUS: "/TblSaleOrderStatus/edit",
  DELETE_ORDER_STATUS: "/TblSaleOrderStatus/delete",
  DETAIL_ORDER_STATUS: "/TblSaleOrderStatus/get-detail?id=",

  //Media
  GET_LIST_MEDIA: "/TblMedia/get-list",
  CREATE_MEDIA: "/TblMedia/create",
  DELETE_MEDIA: "/TblMedia/delete",
  MODIFY_MEDIA: "/TblMedia/edit",
  DETAIL_MEDIA: "/TblMedia/details?id=",

  //MediaGroup
  GET_LIST_MEDIA_GROUP: "/TblMediaGroup/get-list",
  CREATE_MEDIA_GROUP: "/TblMediaGroup/create",
  DELETE_MEDIA_GROUP: "/TblMediaGroup/delete",
  MODIFY_MEDIA_GROUP: "/TblMediaGroup/edit",
  DETAIL_MEDIA_GROUP: "/TblMediaGroup/details?id=",

  //CustomerGroup
  GET_LIST_CUSTOMER_GROUP: "/TblCustomerGroup/get-list",
  CREATE_CUSTOMER_GROUP: "/TblCustomerGroup/create",
  DELETE_CUSTOMER_GROUP: "/TblCustomerGroup/delete",
  MODIFY_CUSTOMER_GROUP: "/TblCustomerGroup/edit",
  DETAIL_CUSTOMER_GROUP: "/TblCustomerGroup/get-detail?Id=",

  //Customer
  GET_LIST_CUSTOMER: "/TblCustomer/get-list",
  CREATE_CUSTOMER: "/TblCustomer/create",
  DELETE_CUSTOMER: "/TblCustomer/delete",
  MODIFY_CUSTOMER: "/TblCustomer/edit",
  DETAIL_CUSTOMER: "/TblCustomer/details?id=",

  //coupons
  GET_LIST_COUPON: "/TblCoupon/get-list",
  CREATE_COUPON: "/TblCoupon/create",
  DELETE_COUPON: "/TblCoupon/delete",
  MODIFY_COUPON: "/TblCoupon/edit",
  DETAIL_COUPON: "/TblCoupon/get-detail?id=",

  //ProductAdsCategory
  GET_LIST_PRODUCT_ADS_CATEGORY: "/TblProductAdsCategory/get-list",
  CREATE_PRODUCT_ADS_CATEGORY: "/TblProductAdsCategory/create",
  DELETE_PRODUCT_ADS_CATEGORY: "/TblProductAdsCategory/delete",
  MODIFY_PRODUCT_ADS_CATEGORY: "/TblProductAdsCategory/edit",
  DETAIL_PRODUCT_ADS_CATEGORY: "/TblProductAdsCategory/get-detail?id=",

  //ProductAds
  GET_LIST_PRODUCT_ADS: "/TblProductAds/get-list",
  GET_LIST_PRODUCT_ADS_BY_CATID: "/TblProductAds/get-list-itemAds",
  CREATE_PRODUCT_ADS: "/TblProductAds/create",
  DELETE_PRODUCT_ADS: "/TblProductAds/delete",
  MODIFY_PRODUCT_ADS: "/TblProductAds/edit",
  DETAIL_PRODUCT_ADS: "/TblProductAds/get-detail?id=",

  //Banner
  GET_LIST_BANNER: "/TblBanner/get-list",
  CREATE_BANNER: "/TblBanner/create",
  DELETE_BANNER: "/TblBanner/delete",
  MODIFY_BANNER: "/TblBanner/edit",
  DETAIL_BANNER: "/TblBanner/get-detail/",
  MODIFY_BANNER_ORDER: "/TblBanner/edit-order",

  //Banner
  GET_LIST_BANNER_LOCATION: "/TblBannerLocation/get-list",
  CREATE_BANNER_LOCATION: "/TblBannerLocation/create",
  DELETE_BANNER_LOCATION: "/TblBannerLocation/delete",
  MODIFY_BANNER_LOCATION: "/TblBannerLocation/edit",
  DETAIL_BANNER_LOCATION: "/TblBannerLocation/get-detail/",

  //UserComment
  CREATE_USER_COMMENT: "TblUserComment/create",
  MODIFY_USER_COMMENT: "TblUserComment/edit",
  DELETE_USER_COMMENT: "TblUserComment/delete",
  GET_LIST_USER_COMMENT: "TblUserComment/get-list",
  GET_USER_COMMENT_DETAIL: "TblUserComment/get-detail/",
  MODIFY_DISABLE_USER_COMMENT: "TblUserComment/disable?id=",

  //UserCommentReply
  CREATE_USER_COMMENT_REPLY: "TblUserCommentReply/create",
  MODIFY_USER_COMMENT_REPLY: "TblUserCommentReply/edit",
  DELETE_USER_COMMENT_REPLY: "TblUserCommentReply/delete",
  GET_LIST_USER_COMMENT_REPLY: "TblUserCommentReply/get-list",
  GET_USER_COMMENT_REPLY_DETAIL: "TblUserCommentReply/get-detail/",
  MODIFY_DISABLE_USER_COMMENT_REPLY: "TblUserCommentReply/disable?id=",

  //UserReview
  CREATE_USER_REVIEW: "TblUserReview/create",
  MODIFY_USER_REVIEW: "TblUserReview/edit",
  DELETE_USER_REVIEW: "TblUserReview/delete",
  GET_LIST_USER_REVIEW: "TblUserReview/get-list",
  GET_USER_REVIEW_DETAIL: "TblUserReview/get-detail/",
  MODIFY_DISABLE_USER_REVIEW: "TblUserReview/disable?id=",

  //UserReview
  CREATE_PRODUCT_DEAL: "TblProductDeal/create",
  MODIFY_PRODUCT_DEAL: "TblProductDeal/edit",
  DELETE_PRODUCT_DEAL: "TblProductDeal/delete",
  GET_LIST_PRODUCT_DEAL: "TblProductDeal/get-list",
  GET_PRODUCT_DEAL_DETAIL: "TblProductDeal/get-detail?Id=",
  MODIFY_PRODUCT_DEAL_ACTIVE: "TblProductDeal/edit-status?Id=",
  MODIFY_PRODUCT_DEAL_PRIOR: "TblProductDeal/edit-prior?Id=",

  //BuildPcAccessory
  GET_LIST_ITEM_BUILD: "BuildPC/get-list-item-build",
  GET_LIST_CAT_BUILD: "BuildPC/get-list-cat-build",
  CREATE_ITEM_REL: "BuildPC/create-item-rel",
  CREATE_CAT_REL: "BuildPC/create-cat-rel",
  DELETE_ITEM_REL: "BuildPC/delete-item-rel",
  DELETE_CAT_REL: "BuildPC/delete-cat-rel",

  //Employee
  GET_LIST_EMPLOYEE: "/TblEmployee/get-list",
  GET_LIST_EMPLOYEE_KDOL: "/TblEmployee/get-list-kdol",
  CREATE_EMPLOYEE: "/TblEmployee/create",
  EDIT_EMPLOYEE: "/TblEmployee/edit",
  DETAIL_EMPLOYEE: "/TblEmployee/details",
  DELETE_EMPLOYEE: "/TblEmployee/delete",

  //Collection
  GET_LIST_COLLECTION: "/TblComboSetCollection/get-list",
  CREATE_COLLECTION: "/TblComboSetCollection/create",
  EDIT_COLLECTION: "/TblComboSetCollection/edit",
  DETAIL_COLLECTION: "/TblComboSetCollection/details",
  DELETE_COLLECTION: "/TblComboSetCollection/delete",

  //TblConfigGroup
  GET_LIST_CONFIG_GROUP: "/TblConfigGroup/get-list",
  CREATE_CONFIG_GROUP: "/TblConfigGroup/create",
  EDIT_CONFIG_GROUP: "/TblConfigGroup/edit",
  DETAIL_CONFIG_GROUP: "/TblConfigGroup/detail?id=",
  DELETE_CONFIG_GROUP: "/TblConfigGroup/delete",

  //TblConfigGroupAttribute
  CREATE_CONFIG_GROUP_ATTRIBUTE: "/TblConfigGroupAttribute/create",
  EDIT_CONFIG_GROUP_ATTRIBUTE: "/TblConfigGroupAttribute/edit",
  DELETE_CONFIG_GROUP_ATTRIBUTE: "/TblConfigGroupAttribute/delete",

  //TblConfigGroupAttributeValue
  CREATE_CONFIG_GROUP_ATTRIBUTE_VALUE: "/TblConfigGroupAttributeValue/create",
  EDIT_CONFIG_GROUP_ATTRIBUTE_VALUE: "/TblConfigGroupAttributeValue/edit",
  DELETE_CONFIG_GROUP_ATTRIBUTE_VALUE: "/TblConfigGroupAttributeValue/delete",

  //TblConfigGroupProduct
  CREATE_CONFIG_GROUP_PRODUCT: "/TblConfigGroupProduct/create",
  EDIT_CONFIG_GROUP_PRODUCT: "/TblConfigGroupProduct/edit",
  DELETE_CONFIG_GROUP_PRODUCT: "/TblConfigGroupProduct/delete",

  //TblTradeInOrder
  CREATE_TRADE_IN_ORDER: "TblTradeInOrder/create",
  MODIFY_TRADE_IN_ORDER: "TblTradeInOrder/edit",
  DELETE_TRADE_IN_ORDER: "TblTradeInOrder/delete",
  GET_LIST_TRADE_IN_ORDER: "TblTradeInOrder/get-list",
  DETAIL_TRADE_IN_ORDER: "TblTradeInOrder/get-detail?Id=",

  //TblTradeInHeader
  MODIFY_TRADE_IN_HEADER: "TblTradeInHeader/edit",
  GET_LIST_TRADE_IN_HEADER: "TblTradeInHeader/get-list",

  //TblTradeInProduct
  GET_LIST_TRADE_IN_PRODUCT: "TblTradeInProduct/get-list",
  CREATE_TRADE_IN_PRODUCT: "TblTradeInProduct/create",
  MODIFY_TRADE_IN_PRODUCT: "TblTradeInProduct/edit",
  DELETES_TRADE_IN_PRODUCT: "TblTradeInProduct/deletes",
  MODIFY_TRADE_IN_PRODUCT_ORDER: "TblTradeInProduct/edit-order-number",
  MODIFY_TRADE_IN_PRODUCT_ACTIVE: "TblTradeInProduct/edit-active",

  //TblLinkRedirect
  CREATE_LINK_REDIRECT: "TblLinkRedirect/create",
  MODIFY_LINK_REDIRECT: "TblLinkRedirect/edit",
  DELETE_LINK_REDIRECT: "TblLinkRedirect/delete",
  GET_LIST_LINK_REDIRECT: "TblLinkRedirect/get-list",
  DETAIL_LINK_REDIRECT: "TblLinkRedirect/details/",

  //TblInstallment
  CREATE_INSTALLMENT: "TblInstallment/create",
  MODIFY_INSTALLMENT: "TblInstallment/edit",
  DELETE_INSTALLMENT: "TblInstallment/delete",
  GET_LIST_INSTALLMENT: "TblInstallment/get-list",
  DETAIL_INSTALLMENT: "TblInstallment/get-detail",

  //TblInstallment
  CREATE_COLLECTION_FORM: "TblCollectionForm/create",
  MODIFY_COLLECTION_FORM: "TblCollectionForm/edit",
  DELETE_COLLECTION_FORM: "TblCollectionForm/delete",
  GET_LIST_COLLECTION_FORM: "TblCollectionForm/get-list",
  DETAIL_COLLECTION_FORM: "TblCollectionForm/get-detail",

  //TblInstallmentOrder
  GET_LIST_INSTALLMENT_ORDER: "TblInstallmentOrder/get-list",
  GET_DETAIL_INSTALLMENT_ORDER: "TblInstallmentOrder/get-detail",
  DELETE_INSTALLMENT_ORDER: "TblInstallmentOrder/delete",
  EDIT_INSTALLMENT_ORDER: "TblInstallmentOrder//edit-status",

  //Logging Action
  GET_LOGGING_ACTION: "Logging/log-action-dashboard",
};
