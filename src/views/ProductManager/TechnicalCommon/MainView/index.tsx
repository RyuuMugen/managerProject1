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
  EuiText,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../../common/AppAction";
import AppSearch from "../../../../common/AppSearch";
import CreateView from "../CreateView";
import DeleteView from "../DeleteView";
import Repository from "../../../../_base/helper/HttpHelper";
import { getListTechnicalCommon } from "../../../../api/ApiProduct";
import { MessageResponse } from "../../../../model/MessageResponse";
import { API_ROUTE } from "../../../../const/apiRoute";
import { TblTechnicalCommon } from "../../../../model/TblTechnicalCommon";
import EditView from "../EditView";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const optionSearch = [
  {
    value: "Active",
    label: "Kích hoạt",
    color: visColorsBehindText[1],
  },
  {
    value: "Inactive",
    label: "Chưa kích hoạt",
    color: visColorsBehindText[0],
  },
];
const TechnicalCommon = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "Id thông số kỹ thuật",
      sortable: true,
      truncateText: true,
      width: "10%",
    },
    {
      field: "techComName",
      name: "Tên nhóm thông số kỹ thuật",
      sortable: true,
      truncateText: true,
      width: "16%",

      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const id = data.find((x) => x.techComName === itemName);
            if (id !== undefined && id.id > 0) handleEditData(id?.id);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "techComCode",
      name: "Mã nhóm thông số kỹ thuật",
      sortable: true,
      truncateText: true,
      width: "15%",
    },

    {
      field: "orgId",
      name: "Mã chi nhánh",
      sortable: true,
      truncateText: true,
      width: "12%",
      render: (orgId: number) => (
        <EuiText size="m" color="red">
          {orgId}
        </EuiText>
      ),
    },

    {
      field: "description",
      name: "Mô tả",
      sortable: true,
      truncateText: true,
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: TblTechnicalCommon) => {
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
  const [toltal, setTotal] = useState(0);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);
  const handleDeleteViewClose = (status: number) => {
    // Cập nhật trạng thái từ DeleteView khi modal đóng
    setDeleteViewStatus(status);
  };
  const [data, setdata] = useState<TblTechnicalCommon[]>([]);
  const [message, setMessage] = useState<ReactNode>();
  const fetchDataProvince = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setdata([]);
    setError(undefined);
    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getListTechnicalCommon(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage("Không có dữ liệu");
        setTotal(0);
      } else {
        setdata(callapi?.data ?? []);
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

  const handleEditData = async (id: any) => {
    if (id) {
      editItem(id);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
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
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  const onSelectionChange = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<any> = {
    // tieu chi de checkbox
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Inactive":
        return "danger";
      case "Active":
        return "green";
      default:
        return "subdued";
    }
  };

  const [isFrist, setIsFrist] = useState(true);

  useEffect(() => {
    if (isFrist) setIsFrist(false);

    const fetchData = async () => {
      await fetchDataProvince(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, deleteViewStatus]);

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới nhóm thông số kỹ thuật</Title>
          </div>
        </>
      ),
      children: (
        <CreateView onClose={handleDeleteViewClose} load={deleteViewStatus} />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn("Xin vui lòng chọn 1 sản phẩm để chỉnh sửa !");
    else {
      editItem(isSelectedItem[0].id);
    }
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
          <Title order={5}>Xoá nhóm thông số kỹ thuật</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataProvince(
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
          <Title order={5}>Chỉnh sửa nhóm thông số kỹ thuật</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onClose={handleDeleteViewClose}
          load={deleteViewStatus}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

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
          fetchDataProvince(
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
    </>
  );
};

export default TechnicalCommon;
