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
import { Divider, Flex, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import DeleteView from "./DeleteCoupons";
import Repository from "../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblCoupon } from "../../../model/TblCoupon";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CouponsList = () => {
  const navigate = useNavigate();

  const columns: Array<EuiBasicTableColumn<TblCoupon>> = [
    {
      field: "id",
      name: "STT",
      sortable: true,
      truncateText: true,
      width: "20%",
    },
    {
      field: "title",
      name: "Khuyến mại",
      sortable: true,
      truncateText: true,
      width: "40%",
      render: (code: string, value: any) => {
        return (
          <Flex direction="column">
            <EuiLink
              target="_blank"
              onClick={(e: any) => {
                const id = datas.find((x) => x.title === code);
                if (id !== undefined && id.id > 0) editItem(id?.id);
              }}
            >
              Mã số: {code}
            </EuiLink>
            <Text fw={500} size="sm">
              {value.codeType}
            </Text>
          </Flex>
        );
      },
    },
    {
      field: "validOrderValue",
      name: "Phân loại",
      sortable: true,
      truncateText: true,
      width: "25%",
      render: (validOrder: any) => {
        return <Text>Tặng tiền mặt: {validOrder}</Text>;
      },
    },
    {
      field: "fromDate",
      name: "Thời gian",
      sortable: true,
      truncateText: true,
      width: "35%",
      render: (date: string, data: any) => (
        <>
          <Flex direction="column">
            <EuiHealth color={"green"}>
              Bắt đầu: {moment(date).format("DD-MM-YYYY, HH:MM A")}
            </EuiHealth>
            <EuiHealth color={"red"}>
              Kết thúc: {moment(data.toDate).format("DD-MM-YYYY, HH:MM A")}
            </EuiHealth>
            <Text size="sl" ml={20}>
              Giá trị đơn hàng tối thiểu:{" "}
              {data.limitTotalAmountMin === 0
                ? "Không có"
                : data.limitTotalAmountMin + "VNĐ"}
            </Text>
          </Flex>
        </>
      ),
    },
    {
      field: "limitUsePerUser",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "25%",
      render: (limitUser: any, data: any) => (
        <>
          <Flex direction="column">
            <Text size="sl">{limitUser + " " + "đã dùng"}</Text>
            <Text size="sl">{"Tổng số:" + " " + data.totalUse}</Text>
          </Flex>
        </>
      ),
    },
    {
      name: "Actions",
      width: "10%",
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);
  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
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
      const value = selectedOptions[0].code;
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

  const openModal = () => {
    navigate("/coupon-set-add", { state: { id: "" } });
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

  function editItem(id: number) {
    navigate("/coupons-set-edit", { state: { id: id } });
  }

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
          <Title order={5}>Xóa trạng thái đơn hàng</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataOrderStatus(
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

  const fetchDataOrderStatus = async (
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
      let urlSearch = `${API_ROUTE.GET_LIST_COUPON}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;

      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await repository.get<MessageResponse<any>>(urlSearch);
      if (
        isNullOrUndefined(callapi?.data) ||
        isNullOrUndefinedArry(callapi?.data)
      ) {
        setTotal(0);
      } else {
        const lists = callapi?.data;
        setDatas(lists);
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
      await fetchDataOrderStatus(
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
          fetchDataOrderStatus(
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
export default CouponsList;
