import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiImage,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
} from "@elastic/eui";
import React, { useEffect, useState } from "react";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import { MessageResponse } from "../../../model/MessageResponse";
import { API_ROUTE } from "../../../const/apiRoute";
import Repository from "../../../_base/helper/HttpHelper";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppSearch from "../../../common/AppSearch";
import AppAction from "../../../common/AppAction";
import { Divider, Flex, NumberFormatter, Text, Title } from "@mantine/core";
import FormChooseItem from "./FormChooseItem";
import { modals } from "@mantine/modals";
import {
  tblListProductAdsDetail,
  tblProductAds,
} from "../../../model/TblProductAds";
import { createProductAds } from "../../../api/ApiProductAds";
import DeleteView from "./DeleteView";
import { useLocation } from "react-router-dom";

const ProductAdsList = () => {
  const columns: Array<EuiBasicTableColumn<tblListProductAdsDetail>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    // {
    //   field: "primaryImage",
    //   name: "Ảnh",
    //   sortable: true,
    //   truncateText: true,
    //   width: "7%",
    //   render: (urlCanonical: any) => {
    //     return (
    //       <EuiImage
    //         size=""
    //         width={60}
    //         height={80}
    //         src={urlCanonical}
    //         alt="alt"
    //       />
    //     );
    //   },
    // },
    {
      field: "",
      name: "Tên sản phẩm",
      sortable: true,
      truncateText: true,
      render: (item: tblListProductAdsDetail) => (
        <Flex direction={"column"}>
          <EuiLink target="_blank" style={{ fontSize: 14 }}>
            {item.itemName}
          </EuiLink>
          <Text mt={3}>
            Mã sản phẩm:{" "}
            <Text span fw={500}>
              {item.itemCode}
            </Text>
          </Text>
          <Text>
            Lượt xem: <Text span>{item.view}</Text>
          </Text>
        </Flex>
      ),
    },

    {
      field: "",
      name: "Thông tin bán hàng",
      sortable: true,
      truncateText: true,
      width: "12%",
      render: (item: tblListProductAdsDetail) => (
        <Flex direction={"column"}>
          <Text>
            Giá bán:{" "}
            <Text span c={"red"} fw={500}>
              <NumberFormatter
                value={item.unitSellingPrice || 0}
                thousandSeparator
              />
            </Text>{" "}
            VND
          </Text>
          <Text>
            Kho hàng: <Text span>{item.onhandQuantity || 0}</Text>
          </Text>
          <Text>
            Bảo hành: <Text span>{item.warrantyDescrition}</Text>
          </Text>
        </Flex>
      ),
    },
    {
      name: "Actions",
      width: "10%",
      render: (online: any) => {
        return (
          <>
            <EuiLink
              target="_blank"
              color="danger"
              onClick={(e: any) => {
                if (isNullOrUndefined(online))
                  NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                else {
                  deleteItem([online.id]);
                }
              }}
            >
              Loại sản phẩm này!
            </EuiLink>
          </>
        );
      },
    },
  ];

  const location = useLocation();
  const id = location.state && location.state.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [data, setData] = useState<any[]>([]);
  const [isSelectedItem, setSelectedItems] = useState<
    tblListProductAdsDetail[]
  >([]);
  const [total, setTotal] = useState(0);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();

  const onSelectionChange = (selectedItems: tblListProductAdsDetail[]) => {
    setSelectedItems(selectedItems);
  };

  const selection: EuiTableSelectionType<tblListProductAdsDetail> = {
    selectable: (data: tblListProductAdsDetail) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

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

  const handleChooseItem = async (idItem: number, itemCode: string) => {
    // open()
    const dataCreate: tblProductAds = {
      id: 0,
      itemId: idItem,
      itemCode,
      catId: id,
    };

    await createProductAds(dataCreate);
    fetchDataProductAds(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const fetchDataProductAds = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setData([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `${
        API_ROUTE.GET_LIST_PRODUCT_ADS_BY_CATID
      }?KeySearch=${id}&Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await repository.get<MessageResponse<any>>(urlSearch);
      if (
        isNullOrUndefined(callapi) ||
        isNullOrUndefinedArry(callapi?.data.lists)
      ) {
        setTotal(0);
      } else {
        setData(callapi?.data?.lists ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.data.count ?? 0,
        });
        setTotal(callapi?.data.count ?? 0);
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
            <Title order={5}>Chọn sản phẩm vào danh mục Ads</Title>
          </div>
        </>
      ),
      children: <FormChooseItem onChooseItem={handleChooseItem} />,

      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

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
          <Title order={5}>Xóa danh mục Product Ads</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataProductAds(
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataProductAds(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

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
          fetchDataProductAds(
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
        items={data ? data : []}
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

export default ProductAdsList;
