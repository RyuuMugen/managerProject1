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
} from "@elastic/eui";
import { Divider, NumberFormatter, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import AppAction from "../../../../common/AppAction";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { tblSaleOrderCommand } from "../../../../model/TblSaleOrder";
import DeleteView from "../DeleteView";
import EditView from "../EditView";
import OrderView from "../OrderView";
const OrderList = (userId: any) => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "index",
      name: "STT",
      sortable: true,
      truncateText: true,
      render: (value, item) => datas.indexOf(item) + 1,
      width: "3%",
    },
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
    },
    {
      field: "provinceId",
      name: "Tỉnh/TP",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (totalAmount: any) => (
        <NumberFormatter value={totalAmount} thousandSeparator />
      ),
    },
    {
      field: "buyerName",
      name: "Người mua",
      sortable: true,
      truncateText: true,
    },
    {
      field: "totalAmount",
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
    {
      field: "orderStatusUpdateBy",
      name: "Người thực hiện",
      sortable: true,
      truncateText: true,
      render: (UpdateBy: any) => {
        if (UpdateBy === "0") {
          return <p style={{ backgroundColor: "yellow" }}>Chờ xử lý</p>;
        } else {
          return <p>{UpdateBy}</p>;
        }
      },
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

  const getStatusColor = (status: any) => {
    switch (status) {
      case "new":
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<tblSaleOrderCommand[]>([]);
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

  const onSelectionChange = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<any> = {
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

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

  // const openModalDelete = () => {
  //   if (isSelectedItem && isSelectedItem.length < 1)
  //     NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
  //   else {
  //     const ids = isSelectedItem;
  //     deleteItem(ids.map((item) => item?.id));
  //   }
  // };

  // function deleteItem(idItem: number[]) {
  //   modals.openConfirmModal({
  //     title: (
  //       <>
  //         <Title order={5}>Xóa đơn hàng</Title>
  //       </>
  //     ),
  //     children: (
  //       <DeleteView
  //         onSearch={() =>
  //           fetchDataSaleOrder(pagination.pageIndex, pagination.pageSize)
  //         }
  //         idItem={idItem}
  //       />
  //     ),
  //     confirmProps: { display: "none" },
  //     cancelProps: { display: "none" },
  //   });
  // }

  function editItem(id: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa đơn hàng</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataSaleOrder(pagination.pageIndex, pagination.pageSize)
          }
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
            fetchDataSaleOrder(pagination.pageIndex, pagination.pageSize)
          }
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }
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
      let urlSearch = `${API_ROUTE.GET_LIST_SALE_ORDER}?BuyerId=${
        userId.userId
      }&Skip=${index * (size ?? 0)}&Take=${size}`;
      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);
      setDatas(callapi?.data ?? []);
      setPagination({
        ...pagination,
        totalItemCount: callapi?.totalCount ?? 0,
      });
      setTotal(callapi?.totalCount ?? 0);
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
      await fetchDataSaleOrder(pagination.pageIndex, pagination.pageSize);
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);
  return (
    <>
      <Divider my="sm" />
      <AppAction
        // openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
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
