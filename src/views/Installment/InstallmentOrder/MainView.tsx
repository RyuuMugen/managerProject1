import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Title, Table, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import { getDataProvice } from "../../../api/ApiAddress";
import Repository from "../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import {
  tblInstallmentOrder,
  tblInstallmentOrderDetail,
} from "../../../model/TblInstallment";
import { TblTag } from "../../../model/TblTag";
import DeleteView from "./DeleteView";
import View from "./View";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const optionSearch = [
  {
    value: true,
    label: "Kích hoạt",
    "data-test-subj": "titanOption",
    color: visColorsBehindText[0],
  },
  {
    value: false,
    label: "Chưa kích hoạt",
    color: visColorsBehindText[1],
  },
];

const Tags = () => {
  const columns: Array<EuiBasicTableColumn<tblInstallmentOrder>> = [
    {
      field: "id",
      name: "id",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "orderNumber",
      name: "Mã đơn",
      width: "10%",
    },
    {
      field: "supplierName",
      name: "Nhà cung cấp",
      width: "10%",
    },
    {
      field: "tblInstallmentOrderDetailModels",
      name: "Sản phẩm",
      render: (product: tblInstallmentOrderDetail[]) => {
        return (
          <div>
            {product.map((productItem: any, index: number) => (
              <div key={index} style={{ marginBottom: 10, marginRight: 20 }}>
                <EuiLink
                  style={{ fontSize: 14 }}
                  href={`${process.env.REACT_APP_BASE_WEB_HACOM_URL}/product-detail/${productItem?.itemUrl}`}
                  target="_blank"
                >
                  <Text fw={700}>{`${index + 1}. ${
                    productItem.itemName
                  }`}</Text>
                </EuiLink>

                <Table striped withTableBorder withColumnBorders>
                  <Table.Tr>
                    <Table.Td>SKU:</Table.Td>
                    <Table.Td>{productItem.sku}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Số lượng:</Table.Td>
                    <Table.Td>{productItem.quantity}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Đơn giá:</Table.Td>
                    <Table.Td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productItem.itemPrice)}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Tổng giá:</Table.Td>
                    <Table.Td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(productItem.itemPrice * productItem.quantity)}
                    </Table.Td>
                  </Table.Tr>
                </Table>
              </div>
            ))}
          </div>
        );
      },
    },

    {
      name: "Điều khoản",
      width: "15%",
      render: (rules: any) => {
        return (
          <div>
            <p>{`- Giá trả góp: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(rules?.installmentPrice || 0)}`}</p>
            <p>
              {`- Trả trước: ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(rules?.prepaymentAmount || 0)}`}
              {rules.prepaymentPercent && <>({rules?.prepaymentPercent} %)</>}
            </p>
            {rules.interestRate && (
              <p>{`- Lãi suất: ${rules?.interestRate}%`}</p>
            )}
            <p>{`- Tháng: ${rules.duration}`}</p>
          </div>
        );
      },
    },
    {
      name: "Khách hàng",
      width: "15%",
      render: (customer: any) => {
        return (
          <div>
            <p>{`- Tên khách hàng: ${customer.customerName}`}</p>
            <p>{`- Tỉnh: ${getNameByProvinceId(customer.customerProvince)}`}</p>
            <p>{`- Địa chỉ: ${customer.customerAddress}`}</p>
            <p>{`- Email: ${customer.customerEmail}`}</p>
            <p>{`- Điện thoại: ${customer.telephoneNumber}`}</p>
            {customer.identifyCard && (
              <p>{`- CCCD: ${customer.identifyCard}`}</p>
            )}
          </div>
        );
      },
    },
    {
      name: "Thời gian tạo đơn",
      truncateText: true,
      width: "10%",
      render: (time: any) => {
        return (
          <div>
            <p>Thời gian tạo đơn: {formatDate(time.createdDate)}</p>
            <p>Trạng thái: {getStatusMessage(time.status)}</p>
          </div>
        );
      },
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: tblInstallmentOrder) => {
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
                  iconType="eye"
                  aria-label="Dashboard"
                  color="success"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      viewItem(online.id);
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

  const formatDate = (datetime: any) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [dataProvice, setDataProvice] = useState<any[]>([]);
  const [toltal, setTotal] = useState(0);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);

  const [data, setdata] = useState<any[]>([]);
  const [message, setMessage] = useState<ReactNode>();

  const fetchDataProvice = async () => {
    try {
      const data = await getDataProvice("Take=64");
      if (data?.data) {
        setDataProvice(data?.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataOrder = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setdata([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_INSTALLMENT_ORDER}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await repository.get<MessageResponse<any>>(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage("Không có dữ liệu");
        setTotal(0);
      } else {
        setdata(callapi?.data?.lists ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.data?.count ?? 0,
        });
        setTotal(callapi?.data?.count ?? 0);
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<any>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
  };

  const getStatusMessage = (status: any) => {
    switch (status) {
      case "1":
        return "Hủy bỏ";
      case "2":
        return "Thành công";
      default:
        return "Chờ xử lý";
    }
  };

  const getNameByProvinceId = (id: any) => {
    const province = dataProvice.find(
      (item) => item.provinceId === parseInt(id)
    );
    return province ? province.provinceName : null;
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

  const openModalDelete = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      deleteItem(ids.map((item) => item.id));
    }
  };

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xoá Tag</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataOrder(
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

  function viewItem(id: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chi tiết đơn hàng</Title>
        </>
      ),

      children: (
        <View
          id={id}
          onSearch={() =>
            fetchDataOrder(
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

  const [isFrist, setIsFrist] = useState(true);

  useEffect(() => {
    if (isFrist) setIsFrist(false);

    const fetchData = async () => {
      await fetchDataOrder(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, deleteViewStatus]);

  useEffect(() => {
    fetchDataProvice();
  }, []);

  return (
    <>
      <AppAction openModalDelete={openModalDelete}></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataOrder(
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
        // items={data ? data : []}
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
    </>
  );
};

export default Tags;
