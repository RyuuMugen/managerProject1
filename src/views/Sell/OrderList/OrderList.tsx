import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHealth,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
} from "@elastic/eui";
import {
  CloseButton,
  Divider,
  Group,
  Input,
  Menu,
  NumberFormatter,
  Select,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import { getDataProvice } from "../../../api/ApiAddress";
import { getDataEmployeekdol } from "../../../api/ApiEmployee";
import { getDataSaleOrderStatus } from "../../../api/ApiOrderStatus";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { tblEmployeekdol } from "../../../model/TblEmployee";
import { tblSaleOrderCommand } from "../../../model/TblSaleOrder";
import AssignView from "./AssignView";
import DeleteView from "./DeleteView";
import EditView from "./EditView";
import OrderView from "./OrderView";
import PosView from "./PosView";
import UserView from "./UserView";

const OrderList = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "orderNumber",
      name: "Mã số",
      sortable: true,
      truncateText: true,
      width: "6%",
      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const id = datas.find((x) => x.orderNumber === itemName);
            if (id !== undefined && id.id > 0) handleEditData(id?.id);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "orderDate",
      name: "Thời gian",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (time: any) => <p>{formatDate(time)}</p>,
    },
    {
      field: "provinceId",
      name: "Tỉnh/TP",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (ProviceId: any) => <p>{getNameById(ProviceId)}</p>,
    },
    {
      field: "buyerInfo",
      name: "Người mua",
      sortable: true,
      truncateText: true,
      render: (value, item) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            viewUserOrder(item.buyerId);
          }}
        >
          {item.buyerName}
        </EuiLink>
      ),
    },
    {
      field: "totalRemainingAmount",
      name: "Giá trị",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (totalAmount: any) => (
        <NumberFormatter value={totalAmount} thousandSeparator />
      ),
    },
    {
      field: "orderStatus",
      name: "Trạng thái hệ thống",
      sortable: true,
      truncateText: true,
      render: (status: any) => (
        <EuiHealth color={getStatusColor(status)}>{status}</EuiHealth>
      ),
    },
    // {
    //   field: "orderStatusUpdateBy",
    //   name: "Người chỉnh sửa cuối",
    //   sortable: true,
    //   truncateText: true,
    //   render: (UpdateBy: any) => {
    //     if (UpdateBy === "0" || !UpdateBy) {
    //       return <p style={{ backgroundColor: "yellow" }}>Chờ xử lý</p>;
    //     } else {
    //       return <p>{UpdateBy}</p>;
    //     }
    //   },
    // },
    {
      field: "assignToName",
      name: "Người thực hiện",
      sortable: true,
      truncateText: true,
      render: (assignToName: any) => {
        if (assignToName === "0" || !assignToName) {
          return <p style={{ backgroundColor: "yellow" }}>Chưa có</p>;
        } else {
          return <p>{assignToName}</p>;
        }
      },
    },
    {
      name: "Xem",
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
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  disabled={
                    localStorage.getItem("userName") === "hieuhq@hacom.vn" ||
                    localStorage.getItem("userName") === "manhnv@hacom.vn"
                      ? false
                      : online.assignToName === localStorage.getItem("userName")
                      ? false
                      : true
                  }
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
  const getStatusColor = (status: any) => {
    switch (status) {
      case "new":
      case "NEW":
        return "yellow";
      case "cancel":
        return "grey";
      case "wait":
        return "blue";
      case "success":
      case "success1":
      case "success2":
        return "green";
      case "fail1":
      case "fail2":
        return "red";
      case "cancel1":
        return "grey";
      default:
        return "subdued";
    }
  };

  const location = useLocation();
  const buyerId = location.state && location.state.buyerId;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<tblSaleOrderCommand[]>([]);
  const [total, setTotal] = useState(0);
  const [dataOrderStatus, setDataOrderStatus] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAssign, setSelectedAssign] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [dataProvice, setDataProvice] = useState<any[]>([]);
  const [dataOptionEmployee, setDataOptionEmployee] = useState<any>([]);
  const [dataEmployee, setDataEmployee] = useState<tblEmployeekdol[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
  const getNameById = (id: any) => {
    const province = dataProvice.find((item) => item.provinceId === id);
    return province ? province.provinceName : null;
  };
  const onChange = (selectedOptions: any) => {
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

  const onSelectionChange = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<any> = {
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  const onChangeStatus = (value: any) => {
    setSelectedStatus(value);
  };

  const handleChangeAssign = (selectedValue: any) => {
    setSelectedAssign(selectedValue);
  };

  const handleChangeEmail = (selectedValue: any) => {
    setInputEmail(selectedValue.target.value);
  };

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

  const loadDataOrderStatus = async () => {
    setDataOrderStatus([]);
    const data = await getDataSaleOrderStatus("Active=true&Skip=0&Take=1000");
    const transformedData = data?.data.lists.map(
      (item: any, index: number) => ({
        value: item.status,
        label: item.status,
      })
    );
    setDataOrderStatus(transformedData);
  };

  const loadDataEmployee = async () => {
    setDataEmployee([]);
    const data = await getDataEmployeekdol("Skip=0&Take=1000");
    setDataEmployee(data?.data);
  };

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn("Xin vui lòng chọn 1 đơn hàng để chỉnh sửa !");
    else {
      const isAdmin =
        localStorage.getItem("userName") === "hieuhq@hacom.vn" ||
        localStorage.getItem("userName") === "manhnv@hacom.vn";

      const isAssignedToCurrentUser =
        isSelectedItem[0].assignToName === localStorage.getItem("userName");

      if (!isAdmin && !isAssignedToCurrentUser) {
        editItem(isSelectedItem[0].id);
      } else {
        NotificationExtension.Fails(
          "Bạn không có quyền để chỉnh sửa đơn hàng này"
        );
      }
    }
  };

  const openModalPos = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      if (
        localStorage.getItem("userName") === "hieuhq@hacom.vn" ||
        localStorage.getItem("userName") === "manhnv@hacom.vn"
      ) {
        if (ids.some((item) => !item.assignToId || !item.assignToName)) {
          NotificationExtension.Warn(
            "Đơn hàng đang chọn chưa chọn người phụ trách!"
          );
        } else if (
          ids.some((item) => item.orderStatus === "TRANSFER_POS_SUCCESS")
        ) {
          NotificationExtension.Warn("Đơn hàng này đã được đẩy sang POS!");
        } else if (ids.some((item) => item.orderStatus.includes("CANCEL"))) {
          NotificationExtension.Warn("Đơn hàng đang chọn đã huỷ!");
        } else if (ids.some((item) => item.orderStatus === "SUCCESS")) {
          NotificationExtension.Warn("Đơn hàng đang chọn đã xử lý thành công!");
        } else posItem(ids.map((item) => item?.id));
      } else {
        const checkAssign = isSelectedItem.every(
          (item) => item.assignToName === localStorage.getItem("userName")
        );
        if (checkAssign) {
          if (ids.some((item) => !item.assignToId || !item.assignToName)) {
            NotificationExtension.Warn(
              "Đơn hàng đang chọn chưa chọn người phụ trách!"
            );
          } else if (
            ids.some((item) => item.orderStatus === "TRANSFER_POS_SUCCESS")
          ) {
            NotificationExtension.Warn("Đơn hàng này đã được đẩy sang POS!");
          } else if (ids.some((item) => item.orderStatus.includes("CANCEL"))) {
            NotificationExtension.Warn("Đơn hàng đang chọn đã huỷ!");
          } else if (ids.some((item) => item.orderStatus === "SUCCESS")) {
            NotificationExtension.Warn(
              "Đơn hàng đang chọn đã xử lý thành công!"
            );
          } else posItem(ids.map((item) => item?.id));
        } else
          NotificationExtension.Warn(
            "Đơn hàng đang chọn không thuộc quyền quản lý của bạn!"
          );
      }
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

  const openModalAssign = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      assignItem(ids.map((item) => item?.id));
    }
  };

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa đơn hàng</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataSaleOrder(
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

  function assignItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chọn người phụ trách đơn hàng</Title>
        </>
      ),
      children: (
        <AssignView
          onSearch={() =>
            fetchDataSaleOrder(
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
          <Title order={5}>Chỉnh sửa trạng thái đơn hàng</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataSaleOrder(
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

  function posItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Gửi đơn hàng sang POS</Title>
        </>
      ),

      children: (
        <PosView
          onSearch={() =>
            fetchDataSaleOrder(
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
        <OrderView
          id={id}
          onSearch={() =>
            fetchDataSaleOrder(
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
  function viewUserOrder(userId: any) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Danh sách đơn hàng</Title>
        </>
      ),

      children: <UserView userId={userId} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Trạng thái hệ thống ">
        <Select
          placeholder={"Chọn trạng thái đơn hàng"}
          searchable
          defaultValue={selectedStatus}
          nothingFoundMessage="Không có dữ liệu"
          data={dataOrderStatus}
          onChange={onChangeStatus}
          clearable
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Người phụ trách ">
        <Select
          placeholder={"Chọn người phụ trách"}
          searchable
          defaultValue={selectedAssign}
          nothingFoundMessage="Không có dữ liệu"
          data={dataOptionEmployee}
          onChange={handleChangeAssign}
          clearable
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Email người dùng">
        <Input
          placeholder={"Nhập Email người dùng"}
          value={inputEmail}
          onChange={handleChangeEmail}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              onClick={() => setInputEmail("")}
              style={{ display: inputEmail ? undefined : "none" }}
            />
          }
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Chọn khoảng thời gian">
        <Group grow wrap="nowrap" mt="md" gap={"lg"}>
          <DateTimePicker
            label="Từ ngày"
            withSeconds
            placeholder="Chọn ngày và giờ"
            value={startDate}
            onChange={setStartDate}
            rightSection={
              <CloseButton
                onClick={() => (setStartDate(null), setEndDate(null))}
                style={{ display: startDate ? undefined : "none" }}
              />
            }
          />
          <DateTimePicker
            label="Đến ngày"
            withSeconds
            placeholder="Chọn ngày và giờ"
            minDate={startDate !== null ? startDate : undefined}
            value={endDate}
            onChange={setEndDate}
            disabled={!startDate}
            rightSection={
              <CloseButton
                onClick={() => setEndDate(null)}
                style={{ display: endDate ? undefined : "none" }}
              />
            }
          />
        </Group>
      </EuiFormRow>
    </Menu.Item>,
  ];

  const fetchDataSaleOrder = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setDatas([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_SALE_ORDER}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      if (!isNullOrUndefined(inputEmail) && inputEmail !== "") {
        urlSearch = urlSearch + `&BuyerEmail=${inputEmail}`;
      }
      if (!isNullOrUndefined(selectedStatus) && selectedStatus !== "") {
        urlSearch = urlSearch + `&Status=${selectedStatus}`;
      }
      if (!isNullOrUndefined(selectedAssign) && selectedAssign !== "") {
        const parts = selectedAssign.split("-");
        const afterPlus = parts.slice(1).join("+");
        urlSearch = urlSearch + `&IssuedUser=${afterPlus}`;
      }
      if (
        !isNullOrUndefined(startDate) &&
        startDate !== null &&
        endDate === null
      ) {
        const dateObject = new Date(startDate);
        const formattedDate = dateObject.toISOString();
        urlSearch = urlSearch + `&StartDate=${formattedDate}`;
      }
      if (
        !isNullOrUndefined(startDate) &&
        startDate !== null &&
        endDate !== null
      ) {
        const dateObjectStart = new Date(startDate);
        const dateObjectEnd = new Date(endDate);
        const formattedDateStart = dateObjectStart.toISOString();
        const formattedDateEnd = dateObjectEnd.toISOString();
        urlSearch =
          urlSearch +
          `&StartDate=${formattedDateStart}` +
          `&EndDate=${formattedDateEnd}`;
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataSaleOrder(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
    fetchDataProvice();
    loadDataOrderStatus();
    loadDataEmployee();
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (buyerId) viewUserOrder(buyerId);
  }, [buyerId]);

  useEffect(() => {
    if (dataEmployee) {
      setDataOptionEmployee(
        dataEmployee.map((option) => {
          return {
            value: option?.id.toString() + "-" + option?.email_organ,
            label:
              "Email: " +
              option?.email_organ +
              " - " +
              "Tên nhân viên: " +
              option?.name,
          };
        })
      );
    }
  }, [dataEmployee]);

  return (
    <>
      <AppAction
        // openModalDelete={openModalDelete}
        openModalPos={openModalPos}
        openModalEdit={openModalEdit}
        openModalAssign={openModalAssign}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataSaleOrder(
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

export default OrderList;
