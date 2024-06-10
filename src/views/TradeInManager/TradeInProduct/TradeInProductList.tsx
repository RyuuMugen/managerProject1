import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiHealth,
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
import {
  Divider,
  Flex,
  NumberFormatter,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import FormChooseItem from "./FormChooseItem";
import { modals } from "@mantine/modals";

import { createProductAds } from "../../../api/ApiProductAds";
import DeleteView from "./DeleteView";
import { useLocation } from "react-router-dom";
import {
  TblTradeInProduct,
  TblTradeInProductEdit,
} from "../../../model/TblTradeIn";
import {
  createTradeInProduct,
  modifyTradeInProductActive,
} from "../../../api/ApiTradeIn";
import UpdateOrderNumberView from "./updateorderNumberView";

const TradeInProductList = () => {
  const columns: Array<EuiBasicTableColumn<TblTradeInProduct>> = [
    {
      name: "Id",
      truncateText: true,
      width: "3%",
      render: (product: TblTradeInProduct) => <p>{product?.item?.id}</p>,
    },
    {
      name: "Ảnh",
      truncateText: true,
      width: "6%",
      render: (product: TblTradeInProduct) => {
        return (
          <EuiImage
            size=""
            width={60}
            height={80}
            src={product?.item?.primaryImage || ""}
            alt="alt"
          />
        );
      },
    },
    {
      field: "",
      name: "Tên sản phẩm",
      sortable: true,
      truncateText: true,
      render: (product: TblTradeInProduct) => (
        <Flex direction={"column"}>
          <EuiLink target="_blank" style={{ fontSize: 14 }}>
            {product?.item?.itemName}
          </EuiLink>
          <Text mt={3}>
            Mã sản phẩm:{" "}
            <Text span fw={500}>
              {product?.item?.itemCode}
            </Text>
          </Text>
          <EuiHealth color={product?.item?.inUse === "Y" ? "green" : "danger"}>
            {product?.item?.inUse === "Y" ? "Hiển thị" : "Không hiển thị"}
          </EuiHealth>
        </Flex>
      ),
    },

    {
      field: "",
      name: "Thông tin bán hàng",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (product: TblTradeInProduct) => (
        <Flex direction={"column"}>
          <Text>
            Giá bán:{" "}
            <Text span c={"red"} fw={500}>
              <NumberFormatter
                value={product?.item?.unitSellingPrice || 0}
                thousandSeparator
              />
            </Text>{" "}
            VND
          </Text>
          <Text>
            Kho hàng: <Text span>{product?.item?.onhandQuantyty || 0}</Text>
          </Text>
          <Text>
            Bảo hành: <Text span>{product?.item?.warrantyDescrition}</Text>
          </Text>
        </Flex>
      ),
    },
    {
      field: "",
      name: "Cài đặt thu/đổi",
      sortable: true,
      truncateText: true,
      width: "33%",
      render: (product: TblTradeInProduct) => (
        <Table>
          <Table.Thead style={{ backgroundColor: "#EEE" }}>
            <Table.Tr>
              <Table.Th>STT</Table.Th>
              <Table.Th>Tình trạng sp</Table.Th>
              <Table.Th>Giá</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {product?.tblTradeInHeaderModels.map((header, index) => (
              <Table.Tr>
                <Table.Td>{index + 1}</Table.Td>
                <Table.Td>{header.productCondition}</Table.Td>
                <Table.Td>
                  Công thức: Giá bán -
                  {header?.measure === "P"
                    ? header?.percentSupport + " %"
                    : header?.amountSupport + " VND"}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      ),
    },
    {
      name: "Actions",
      width: "10%",
      render: (product: TblTradeInProduct) => {
        return (
          <Flex direction={"column"}>
            <Flex align={"center"} gap={10} mb={10}>
              <Text>STT: </Text>
              {/* <TextInput value={product.item.orderNumber || 0} w={100} /> */}
              <EuiLink
                target="_blank"
                onClick={() => {
                  modals.openConfirmModal({
                    title: (
                      <>
                        <div color="white">
                          <Title order={5}>Cập nhật STT !</Title>
                        </div>
                      </>
                    ),
                    children: (
                      <UpdateOrderNumberView
                        onSearch={() =>
                          fetchDataTradeInProduct(
                            pagination.pageIndex,
                            pagination.pageSize,
                            paramSearch?.keyWord,
                            paramSearch?.inActive
                          )
                        }
                        id={product.id}
                        orderNumber={product.orderNumber ?? 0}
                        item={data}
                      />
                    ),
                    confirmProps: { display: "none" },
                    cancelProps: { display: "none" },
                  });
                }}
              >
                {product.orderNumber || 0}
              </EuiLink>
            </Flex>

            <Flex gap={7}>
              <EuiLink
                target="_blank"
                onClick={(e: any) => {
                  handleEditStatus(product.id, product.active);
                }}
                style={{ paddingRight: 7, borderRight: "1px solid #000000" }}
              >
                <EuiHealth color={product.active === "A" ? "green" : "danger"}>
                  {product.active === "A" ? "Hiển thị" : "Không hiển thị"}
                </EuiHealth>
              </EuiLink>
              <EuiLink
                target="_blank"
                color="danger"
                onClick={(e: any) => {
                  if (isNullOrUndefined(product))
                    NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                  else {
                    deleteItem([product?.id]);
                  }
                }}
              >
                Xoá
              </EuiLink>
            </Flex>
          </Flex>
        );
      },
    },
  ];

  const location = useLocation();
  const id = location.state && location.state.id;
  const catName = location.state && location.state.catName;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [data, setData] = useState<TblTradeInProduct[]>([]);
  const [isSelectedItem, setSelectedItems] = useState<TblTradeInProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();

  const onSelectionChange = (selectedItems: TblTradeInProduct[]) => {
    setSelectedItems(selectedItems);
  };

  const selection: EuiTableSelectionType<TblTradeInProduct> = {
    selectable: (data: TblTradeInProduct) => true,
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

  const handleEditStatus = async (id: number, active: string | null) => {
    const dataEditStatus = {
      id: id,
      active: active === "A" ? "I" : "A",
    };
    await modifyTradeInProductActive(dataEditStatus);
    fetchDataTradeInProduct(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const handleChooseItem = async (idItem: number) => {
    setLoading(true);
    const dataCreate: TblTradeInProductEdit = {
      id: 0,
      catId: id,
      itemId: idItem,
      orderNumber: 0,
      active: "A",
    };

    await createTradeInProduct(dataCreate);
    fetchDataTradeInProduct(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
    setLoading(false);
  };

  const fetchDataTradeInProduct = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);

    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `${
        API_ROUTE.GET_LIST_TRADE_IN_PRODUCT
      }?CatId=${id}&Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await repository.post<MessageResponse<any>>(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
        setData([]);
      } else {
        setData(callapi?.data ?? []);
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
            <Title order={5}>Chọn sản phẩm vào nhóm</Title>
          </div>
        </>
      ),
      children: (
        <FormChooseItem
          onChooseItem={handleChooseItem}
          listItem={data.map((product) => product.item)}
        />
      ),

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
          <Title order={5}>Xóa sản phẩm trong nhóm</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataTradeInProduct(
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
      await fetchDataTradeInProduct(
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
      <Text fw={700} size="lg">
        Danh sách: [Sản phẩm thu/đổi] {catName} ({total} sp)
      </Text>
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
          fetchDataTradeInProduct(
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

export default TradeInProductList;
