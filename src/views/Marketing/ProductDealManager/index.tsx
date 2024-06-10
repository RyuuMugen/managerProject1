import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHealth,
  EuiImage,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import {
  Divider,
  Flex,
  Image,
  Menu,
  NumberFormatter,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { tblFixedContent } from "../../../model/FixedContent";
import { MessageResponse } from "../../../model/MessageResponse";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import EditView from "./EditView";
import { TblProductDeal } from "../../../model/TblProductDeal";
import FormChooseItem from "./FormChooseItem";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const dataOption = [
  { value: 1, label: "Chưa bắt đầu", color: visColorsBehindText[0] },
  { value: 2, label: "Đang bắt đầu", color: visColorsBehindText[1] },
  { value: 3, label: "Hết thời gian", color: visColorsBehindText[2] },
  { value: 4, label: "Ẩn hiển thị", color: visColorsBehindText[3] },
  { value: 5, label: "Đang nổi bật", color: visColorsBehindText[4] },
];

const ProductDealManager = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "3%",
    },
    {
      field: "productImgUrl",
      name: "Ảnh sản phẩm",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (img: string) => (
        <Image src={img} alt="productImgUrl" w={200} h={"auto"} />
      ),
    },

    {
      field: "",
      name: "Sản phẩm",
      sortable: true,
      truncateText: true,
      // width: "30%",
      render: (online: TblProductDeal) => (
        <Flex direction={"column"}>
          <Flex gap={10} align={"center"}>
            <EuiLink
              target="_blank"
              onClick={(e: any) => {
                if (online !== undefined && online?.id > 0)
                  handleEditData(online?.id);
              }}
              style={{ fontSize: 16 }}
            >
              {online.dealTitle}
            </EuiLink>
            <Text>(SKU: {online.productSku})</Text>
          </Flex>
          <Text>
            Giá deal:{" "}
            <Text span c={"red"} fw={700}>
              <NumberFormatter
                value={online.dealUnitSellingPrice || 0}
                thousandSeparator
              />
            </Text>{" "}
            VND - Giá thường{" "}
            <Text span c={"red"} fw={700}>
              <NumberFormatter
                value={online.unitSellingPrice || 0}
                thousandSeparator
              />
            </Text>{" "}
            (Giảm{" "}
            <Text span c={"red"} fw={700}>
              {online?.dealUnitSellingPrice !== null &&
              online?.unitSellingPrice !== null
                ? (
                    (1 -
                      online.dealUnitSellingPrice / online.unitSellingPrice) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </Text>
            )
          </Text>
          <Text>
            Số lượng:{" "}
            <Text span c={"red"} fw={700}>
              {online.dealQuantity || 0}
            </Text>{" "}
            - Số lượng tối thiểu cho 1 đơn hàng:{" "}
            <Text span c={"red"} fw={700}>
              {online.minPurchaseQty || 0}
            </Text>
          </Text>
        </Flex>
      ),
    },
    {
      field: "",
      name: "Thời gian",
      sortable: true,
      truncateText: true,
      width: "13%",
      render: (online: TblProductDeal) => (
        <Flex direction={"column"}>
          <Text lineClamp={2}>
            <Text span c={"red"} fw={700}>
              {online.fromDate}
            </Text>{" "}
            đến{" "}
          </Text>
          <Text span c={"red"} fw={700}>
            {online.toDate}
          </Text>
          {nowTime < new Date(online.fromDate || "") && (
            <Text>(Chưa bắt đầu)</Text>
          )}
          {nowTime > new Date(online.fromDate || "") &&
            nowTime < new Date(online.toDate || "") && (
              <Text>(Đang bắt đầu)</Text>
            )}
          {nowTime > new Date(online.toDate || "") && (
            <Text>(Hết thời gian) </Text>
          )}
        </Flex>
      ),
    },
    {
      field: "",
      name: "Thống kê",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (online: TblProductDeal) => (
        <Flex direction={"column"}>
          <Text>
            Số đơn hàng:{" "}
            <Text span c={"red"} fw={700}>
              {online.totalSaleOrder || 0}
            </Text>
          </Text>
          <Text>
            Số lượng đặt mua:{" "}
            <Text span c={"red"} fw={700}>
              {online.totalSaleOrderBought || 0}
            </Text>
          </Text>
          <Text>
            Lượt xem:{" "}
            <Text span c={"red"} fw={700}>
              {online.totalViews || 0}
            </Text>
          </Text>
        </Flex>
      ),
    },
    {
      field: "active",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (active: string, online: TblProductDeal) => (
        <EuiLink
          // style={{ fontSize: 16, fontWeight: 700 }}
          target="_blank"
          onClick={(e: any) => {
            handleEditStatus(online.id);
          }}
        >
          <EuiHealth color={getStatusColor(active)}>
            {active == "A" ? "Đang hiển thị" : "Không hiển thị"}
          </EuiHealth>
        </EuiLink>
      ),
    },
    {
      field: "priority",
      name: "Nổi bật",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (priority: string, online: TblProductDeal) => (
        <EuiLink
          // style={{ fontSize: 16, fontWeight: 700 }}
          target="_blank"
          onClick={(e: any) => {
            handleEditPriority(online.id);
          }}
        >
          <EuiHealth color={priority == "Y" ? "green" : "danger"}>
            {priority == "Y" ? "Nổi bật" : "Không nổi bật"}
          </EuiHealth>
        </EuiLink>
      ),
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: any) => {
        return (
          <>
            <EuiFlexGroup
              responsive={true}
              wrap={false}
              gutterSize="s"
              alignItems="center"
            >
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="documentEdit"
                  aria-label="Dashboard"
                  color="success"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      editItem(online.id);
                    }
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteItem([online.id]);
                    }
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        );
      },
    },
  ];

  const getStatusColor = (status: any) => {
    switch (status) {
      case "I":
        return "red";
      case "A":
        return "green";
      default:
        return "subdued";
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<TblProductDeal[]>([]);
  const [total, setTotal] = useState(0);
  const [searchType, setSearchType] = useState<any[]>([]);
  const nowTime = new Date();

  const handleEditData = async (id: number) => {
    if (id) {
      editItem(id);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
  };

  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<any>) => {
    setPagination({
      ...pagination,
      pageIndex: index,
      pageSize: size,
      totalItemCount: 1000,
    });
  };

  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  const onSelectionChange = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<any> = {
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  const handleEditStatus = async (id: number) => {
    if (id < 1)
      NotificationExtension.Fails("Mã nội dung cố định không tồn tại !");
    else {
      setLoading(true);
      const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
      try {
        let urlSearch = API_ROUTE.MODIFY_PRODUCT_DEAL_ACTIVE + id;
        let callapi = await repository.post<MessageResponse<boolean>>(
          urlSearch
        );
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await fetchDataProductDeal(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            );
          } else NotificationExtension.Fails("Thao tác thất bại !");
        }
        return callapi?.data;
      } catch (error: any) {
        setError("Có lỗi xảy ra khi tải dữ liệu !");
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditPriority = async (id: number) => {
    if (id < 1)
      NotificationExtension.Fails("Mã nội dung cố định không tồn tại !");
    else {
      setLoading(true);
      const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
      try {
        let urlSearch = API_ROUTE.MODIFY_PRODUCT_DEAL_PRIOR + id;
        let callapi = await repository.post<MessageResponse<boolean>>(
          urlSearch
        );
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await fetchDataProductDeal(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            );
          } else NotificationExtension.Fails("Thao tác thất bại !");
        }
        return callapi?.data;
      } catch (error: any) {
        setError("Có lỗi xảy ra khi tải dữ liệu !");
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChooseItem = async (
    idItem: number,
    imgUrl: string | null,
    itemCode: string | null,
    sku: string | null,
    productName: string | null,
    unitSellingPrice: number | null,
    marketPrice: number | null
  ) => {
    const product = {
      productId: idItem,
      productImgUrl: imgUrl,
      productCode: itemCode,
      productSku: sku,
      dealTitle: productName,
      unitSellingPrice: unitSellingPrice,
      marketPrice: marketPrice,
    };

    modals.openConfirmModal({
      modalId: "Create Modal",
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới Deal</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          product={product}
          onSearch={() =>
            fetchDataProductDeal(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openModal = () =>
    modals.openConfirmModal({
      modalId: "item",
      title: (
        <>
          <div color="white">
            <Title order={5}>Chọn sản phẩm vào deal</Title>
          </div>
        </>
      ),
      children: <FormChooseItem onChooseItem={handleChooseItem} />,

      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 danh mục bài viết để chỉnh sửa !"
      );
    else {
      editItem(isSelectedItem[0].id);
    }
  };

  const openModalDelete = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      deleteItem(ids.map((item) => item?.id));
    }
  };

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa Deal</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataProductDeal(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
          idItem={idItem}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  function editItem(id: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa Deal!</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataProductDeal(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  const fetchDataProductDeal = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setDatas([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_PRODUCT_DEAL}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      if (!isNullOrUndefined(searchType)) {
        searchType?.forEach(
          (feature) => (urlSearch += `&SearchType=${feature.value}`)
        );
      }
      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
      } else {
        setDatas(callapi?.data ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.totalCount ?? 0,
        });
        setTotal(callapi?.totalCount ?? 0);
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Tình trạng: ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn vị trí"
          options={dataOption}
          selectedOptions={searchType}
          onChange={setSearchType}
          fullWidth={true}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
  ];

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataProductDeal(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  return (
    <>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataProductDeal(
            pagination.pageIndex,
            pagination.pageSize,
            paramSearch?.keyWord,
            paramSearch?.inActive
          )
        }
        elementSearch={elementSearch}
      />
      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={datas ? datas : []}
        itemId="id"
        error={error}
        loading={loading}
        noItemsMessage={"Không có dữ liệu"}
        selection={selection}
        columns={columns}
        pagination={pagination}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        onChange={onTableChange}
        compressed={true}
      />
    </>
  );
};

export default ProductDealManager;
