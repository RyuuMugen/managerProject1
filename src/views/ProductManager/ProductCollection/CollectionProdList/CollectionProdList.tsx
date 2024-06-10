import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiImage,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  EuiEmptyPrompt,
  EuiButton,
  EuiComboBoxOptionOption,
} from "@elastic/eui";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { useEffect, useState, ReactNode } from "react";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import { MessageResponse } from "../../../../model/MessageResponse";
import { API_ROUTE } from "../../../../const/apiRoute";
import Repository from "../../../../_base/helper/HttpHelper";
import { getDataListProduct } from "../../../../api/ApiProduct";
import { ParamSearchBase } from "../../../../_base/model/_base/ParamSearchBase";
import AppSearch from "../../../../common/AppSearch";
import AppAction from "../../../../common/AppAction";
import {
  Divider,
  Flex,
  NumberFormatter,
  Text,
  Title,
  Box,
} from "@mantine/core";
import FormChooseItem from "./FormChooseItem";
import { modals } from "@mantine/modals";
import { Brand, TblItemCommand } from "../../../../model/ProductList";
import {
  tblListProductAdsDetail,
  tblProductAds,
} from "../../../../model/TblProductAds";
import {
  TblCollection,
  TblCollectionProduct,
} from "../../../../model/TblComboSetCollection";
import { useDisclosure } from "@mantine/hooks";
import { editCollection } from "../../../../api/ApiCollection";
import DeleteView from "./DeleteView";
import { useLocation } from "react-router-dom";

const noItemsFoundMsg = "Không có kết quả tìm kiếm phù hợp...";

export interface selectedSearchOptionType {
  features?: EuiComboBoxOptionOption<string>[];
  searchType?: EuiComboBoxOptionOption<number>[];
  brandId?: EuiComboBoxOptionOption<number>[];
}

const CollectionProductList = () => {
  const columns: Array<EuiBasicTableColumn<TblItemCommand>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "itemName",
      name: "Tên sản phẩm",
      sortable: true,
      truncateText: true,
      width: "20%",

      render: (itemName: string) => (
        <EuiLink target="_blank">{itemName}</EuiLink>
      ),
    },
    {
      field: "itemCode",
      name: "Mã sản phẩm",
      sortable: true,
      truncateText: true,
      width: "7%",
    },
    {
      field: "primaryImage",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (urlCanonical: any) => {
        return (
          <EuiImage
            size=""
            width={60}
            height={80}
            src={urlCanonical}
            alt="alt"
          />
        );
      },
    },
    {
      field: "brandId",
      name: "Thương hiệu",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (brandId: number) => {
        return (
          <EuiLink target="_blank">
            {dataBrand?.filter((item: any) => item?.id === brandId)[0]?.name}
          </EuiLink>
        );
      },
    },
    {
      field: "unitSellingPrice",
      name: "Giá bán",
      sortable: true,
      truncateText: true,
      render: (price: number) => {
        return (
          <>
            <Text fw={600} style={{ color: "red", marginRight: 4 }}>
              {convertToVnd(price)}
            </Text>
            <Text>vnd</Text>
          </>
        );
      },
    },
    {
      field: "discountValue",
      name: "Giảm giá",
      sortable: true,
      truncateText: true,
      render: (discountValue: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Giảm giá</Text>
              <Text fw={600} style={{ color: "red", marginLeft: 4 }}>
                {discountValue ? `${discountValue}%` : "0%"}
              </Text>
            </Box>
            <Text>so với giá gốc</Text>
          </Box>
        );
      },
    },
    {
      field: "onhandQuantyty",
      name: "Số lượng tồn kho",
      sortable: true,
      truncateText: true,
      render: (onhandQuantyty: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Số lượng tổng:</Text>
              <Text fw={600} style={{ color: "red", marginLeft: 4 }}>
                {onhandQuantyty}
              </Text>
            </Box>
            <EuiLink>
              {onhandQuantyty == 0 ? (
                <Text style={{ color: "red" }}>hết hàng</Text>
              ) : (
                <Text style={{ color: "blue" }}>còn hàng</Text>
              )}
            </EuiLink>
          </Box>
        );
      },
    },
    {
      field: "warrantyDescrition",
      name: "Thông tin bảo hành",
      sortable: true,
      truncateText: true,
      render: (warrantyDescrition: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Thời hạn:</Text>
              <EuiLink style={{ marginLeft: 4 }}>{warrantyDescrition}</EuiLink>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "color",
      name: "Màu sắc",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (color: string) => (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: color,
                marginRight: "8px",
              }}
            ></div>
            {color}
          </div>
        </>
      ),
    },
  ];

  const entity = {
    id: 0,
    title: "",
    config: "",
    description: "",
    status: "",
    fromTime: "",
    toTime: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdatedBy: "",
    creationDate: "",
    parentId: null,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    tblComboSetCollectionModels: [],
    tblComboSetCollectionProdModels: [],
    tblComboSetCollectionCommands: [],
    tblComboSetCollectionProdCommands: [],
  };

  const [dataBrand, setDataBrand] = useState<Brand[]>();
  const location = useLocation();
  const id = location.state && location.state.id;
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [idList, setIdList] = useState<number[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [total, setTotal] = useState(0);
  const [isSelectedItem, setSelectedItems] = useState<TblItemCommand[]>([]);

  const [selectedSearchOption, setSelectedSearchOption] =
    useState<selectedSearchOptionType>();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [productData, setProductData] = useState<TblItemCommand[]>([]);
  const [message, setMessage] = useState<ReactNode>(
    <EuiEmptyPrompt
      title={<h3>Dữ liệu rỗng !</h3>}
      titleSize="xs"
      body="Tải lại dữ liệu nếu trường hợp bạn không thấy có dữ liệu hiển thị !"
      actions={
        <EuiButton
          size="s"
          key="loadUsers"
          onClick={async () => {
            await fetchDataItem(pagination.pageIndex, pagination.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );
  const form = useForm<TblCollection>({
    initialValues: {
      ...entity,
    },
    validate: {
      title: isNotEmpty("Chưa nhập tên bộ sưu tập"),
    },
  });
  const onSelectionChange = (selectedItems: TblItemCommand[]) => {
    setSelectedItems(selectedItems);
  };

  const selection: EuiTableSelectionType<TblItemCommand> = {
    selectable: (data: TblItemCommand) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };
  function convertToVnd(amount: number): string {
    const amountStr: string = amount?.toString();
    const chunks: string[] = [];

    for (let i = amountStr?.length - 1; i >= 0; i -= 3) {
      const chunk = amountStr?.slice(Math.max(i - 2, 0), i + 1);
      chunks.push(chunk);
    }

    const result: string = chunks.reverse().join(".");
    return result;
  }
  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<any>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
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
    const key = event.target.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };
  const openModalDelete = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      deleteItem(
        form.values,
        ids.map((item) => item?.id)
      );
    }
  };
  const handleChooseItem = async (idItem: number) => {
    open();
    const dataCreate: TblCollectionProduct = {
      prodId: idItem,
      setId: id,
    };

    // Chọn phần tử thứ hai trong form
    const updatedValues = {
      ...form.values,
      tblComboSetCollectionProdCommands: [
        ...(form.values.tblComboSetCollectionProdCommands || []),
        dataCreate,
      ],
    };

    // Set giá trị mới cho form
    form.setValues(updatedValues);

    // Gọi hàm editCollection và fetchDataItem khi form đã được cập nhật
    await editCollection(updatedValues);
    fetchDataCollection();
    if (idList.length > 0) {
      await fetchDataItem(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    }
  };

  const fetchDataCollection = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    const urlDetail = `TblComboSetCollection/details?id=` + id;
    let callApi = await repository.get<MessageResponse<TblCollection>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        const prodIds = dataApi?.tblComboSetCollectionProdModels.map(
          (item) => item.prodId
        );
        setIdList(prodIds);
        form.setValues(dataApi);
        form.setFieldValue(
          "tblComboSetCollectionCommands",
          dataApi?.tblComboSetCollectionModels
        );
        form.setFieldValue(
          "tblComboSetCollectionProdCommands",
          dataApi?.tblComboSetCollectionProdModels
        );
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
        modals.closeAll();
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  const fetchDataItem = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setProductData([]);
    setError(undefined);
    const queryString = idList.map((prodId) => "ItemIds=" + prodId).join("&");
    try {
      let urlSearch = `?Skip=${
        index * (size ?? 0)
      }&Take=${size}&${queryString}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      if (!isNullOrUndefined(selectedSearchOption?.features)) {
        selectedSearchOption?.features?.forEach(
          (feature) => (urlSearch += `&${feature.value}=y`)
        );
      }
      if (!isNullOrUndefined(selectedSearchOption?.searchType)) {
        selectedSearchOption?.searchType?.forEach(
          (searchType) => (urlSearch += `&SearchType=${searchType.value}`)
        );
      }
      if (!isNullOrUndefined(selectedSearchOption?.brandId)) {
        selectedSearchOption?.brandId?.forEach(
          (brandId) => (urlSearch += `&BrandId=${brandId.value}`)
        );
      }
      let callapi = await getDataListProduct(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else {
        setProductData(callapi?.data || []);
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
  const openModal = () =>
    modals.openConfirmModal({
      modalId: "item",
      title: (
        <>
          <div color="white">
            <Title order={5}>
              Chọn sản phẩm vào bộ sưu tập {form?.values?.title}
            </Title>
          </div>
        </>
      ),
      children: <FormChooseItem onChooseItem={handleChooseItem} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  function deleteItem(data: TblCollection, idItem: number[]) {
    modals.openConfirmModal({
      modalId: "delete",
      title: (
        <>
          <Title order={5}>Xóa danh mục Product Ads</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() => fetchDataCollection()}
          formData={data}
          idItem={idItem}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  useEffect(() => {
    fetchDataCollection();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (idList.length > 0) {
        await fetchDataItem(
          pagination.pageIndex,
          pagination.pageSize,
          paramSearch?.keyWord,
          paramSearch?.inActive
        );
      }
    };

    fetchData();
  }, [idList, pagination.pageIndex, pagination.pageSize]);

  return (
    <div>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataItem(
            pagination.pageIndex,
            pagination.pageSize,
            paramSearch?.keyWord,
            paramSearch?.inActive
          )
        }
      />
      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={productData ? productData : []}
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
    </div>
  );
};

export default CollectionProductList;
