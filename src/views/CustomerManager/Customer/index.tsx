import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Box, Divider, Text, Title } from "@mantine/core";
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
import { MessageResponse } from "../../../model/MessageResponse";
import { tblCustomer } from "../../../model/TblCustomer";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import EditView from "./EditView";
import { useNavigate } from "react-router-dom";

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

const Customer = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "customerId",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "",
      name: "Khách hàng",
      sortable: true,
      truncateText: true,
      render: (customer: tblCustomer) => (
        <Box>
          <EuiLink
            target="_blank"
            onClick={(e: any) => {
              const item = datas.find(
                (x) => x.customerName === customer.customerName
              );
              if (item !== undefined && item.customerId > 0)
                handleEditData(item?.customerId);
            }}
          >
            {customer.customerName}
          </EuiLink>
          <Text>{customer.dateOfBirth}</Text>
        </Box>
      ),
    },
    {
      field: "",
      name: "Thông tin",
      sortable: true,
      truncateText: true,
      width: "18%",
      render: (customer: tblCustomer) => (
        <Box>
          <Text>- Email: {customer.email}</Text>
          <Text>- Tel: {customer.telephoneNumber}</Text>
          <Text>- Mobile: {customer.telephoneNumber}</Text>
        </Box>
      ),
    },
    {
      field: "province",
      name: "Tỉnh/Thành phố",
      sortable: true,
      truncateText: true,
      width: "9%",
    },
    {
      field: "",
      name: "Số đơn hàng",
      sortable: true,
      truncateText: true,
      width: "13%",
      render: (customer: tblCustomer) => (
        <Box>
          <Text>
            <Text span fw={600}>
              {customer.ordercount || 0}
            </Text>{" "}
            tổng
          </Text>
          <Text>
            <Text span fw={600} c={"red"}>
              {customer.orderCountSuccess || 0}
            </Text>{" "}
            thành công
          </Text>
          <EuiLink
            // target="_blank"
            // href=""
            onClick={() => handleOrderDetail(customer.customerId)}
          >
            Xem chi tiết
          </EuiLink>
        </Box>
      ),
    },
    {
      field: "",
      name: "Tổng giá trị",
      sortable: true,
      truncateText: true,
      width: "13%",
      render: (customer: tblCustomer) => (
        <Box>
          <Text>
            <Text span fw={600}>
              {customer.totalvalue || 0}
            </Text>{" "}
            tổng
          </Text>
          <Text>
            <Text span fw={600} c={"red"}>
              {customer.totalValueSuccess || 0}
            </Text>{" "}
            thu
          </Text>
          <EuiLink target="_blank" href="">
            Xem chi tiết
          </EuiLink>
        </Box>
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
                      editItem(online.customerId);
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
                      deleteItem([online.customerId]);
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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<tblCustomer[]>([]);
  const [total, setTotal] = useState(0);

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
    const key = event.target.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  const handleOrderDetail = (customerId: number) => {
    navigate("/order-list", { state: { buyerId: customerId } });
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

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới khách hàng</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          onSearch={() =>
            fetchDataCustomer(
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

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 khách hàng để chỉnh sửa !"
      );
    else {
      editItem(isSelectedItem[0].customerId);
    }
  };

  const openModalDelete = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      deleteItem(ids.map((item) => item?.customerId));
    }
  };

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa khách hàng</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataCustomer(
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
          <Title order={5}>Chỉnh sửa khách hàng!</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataCustomer(
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

  const fetchDataCustomer = async (
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
      let urlSearch = `${API_ROUTE.GET_LIST_CUSTOMER}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataCustomer(
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
          fetchDataCustomer(
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
        items={datas ? datas : []}
        itemId="customerId"
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

export default Customer;
