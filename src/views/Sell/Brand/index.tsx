import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiIcon,
  EuiImage,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { ReactNode, useEffect, useState } from "react";
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
import { TblBrand } from "../../../model/TblBrand";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import EditView from "./EditView";
import UpdateOrderNumberView from "./UpdateOrderNumberView";

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
const Brand = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "3%",
    },
    {
      field: "name",
      name: "Tên thương hiệu",
      sortable: true,
      truncateText: true,
      width: "10%",

      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const id = data.find((x) => x.name === itemName);
            if (id !== undefined && id.id > 0) handleEditData(id?.id);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "brandIndex",
      name: "Link index",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (brandIndex: string) => (
        <EuiLink target="_blank" href={brandIndex}>
          Xem trang
        </EuiLink>
      ),
    },
    {
      field: "image",
      name: "Logo thương hiệu",
      sortable: true,
      truncateText: true,
      width: "12%",
      render: (image: string | null) => {
        return image === null ? null : (
          <EuiImage width={60} height={48} src={image} alt="logo" />
        );
      },
    },
    {
      field: "letter",
      name: "Lời nhắn",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "product",
      name: "Số sản phẩm",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (itemName: string) => (
        <>
          <Text fw={500} style={{ color: "blue", marginRight: 4 }}>
            {itemName}
          </Text>
          <Text>(Sản phẩm)</Text>
        </>
      ),
    },
    {
      field: "brandPageView",
      name: "Số lượng view",
      sortable: true,
      truncateText: true,
      width: "6%",
    },
    {
      field: "summary",
      name: "Mô tả tóm tắt",
      sortable: true,
      truncateText: true,
    },
    {
      field: "ordering",
      name: "Thứ tự hiển thị",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (ordering: number, brand: TblBrand) => (
        <EuiLink
          target="_blank"
          onClick={() => modalChangeOrderBrand(ordering, brand)}
        >
          {ordering}
        </EuiLink>
      ),
    },
    {
      field: "status",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (status: any, online: TblBrand) => (
        <EuiLink
          target="_blank"
          onClick={async (e: any) => {
            await featuredActive(online.id, "status");
          }}
        >
          <EuiHealth color={getStatusColor(status)}>
            {status === "A" ? "Active" : "Inactive"}
          </EuiHealth>
        </EuiLink>
      ),
    },
    {
      field: "priorityStatus",
      name: "Nổi bật",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (priorityStatus: any, online: TblBrand) => (
        <EuiLink>
          <div
            style={{ display: "flex", alignItems: "center" }}
            onClick={async (e: any) => {
              open();
              await featuredActive(online.id, "priority");
            }}
          >
            <EuiIcon
              type="starFilled"
              color={getStatusColor(priorityStatus + "p")}
            />
            <span style={{ fontSize: "14px", paddingLeft: "5px" }}>
              {priorityStatus === "A" ? "Priority" : "NonePriority"}
            </span>
          </div>
        </EuiLink>
      ),
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: TblBrand) => {
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
                  onClick={() => {
                    editItem(online.id);
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={() => {
                    deleteItem([online.id]);
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
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [toltal, setTotal] = useState(0);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);
  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
  };
  const [data, setdata] = useState<TblBrand[]>([]);
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
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_BRAND}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);
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
  const featuredActive = async (id: number, type: string, order?: number) => {
    if (id < 1) NotificationExtension.Fails("Mã danh mục không tồn tại !");
    else {
      setLoading(true);
      const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
      try {
        let urlSearch =
          type === "status"
            ? API_ROUTE.MODIFY_BRAND_STATUS + id
            : type === "priority"
            ? API_ROUTE.MODIFY_BRAND_PRIORITY + id
            : type === "order"
            ? API_ROUTE.MODIFY_BRAND_ORDER + id + "&order=" + order
            : "";
        let callapi = await repository.post<MessageResponse<boolean>>(
          urlSearch
        );
        close();
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await fetchDataProvince(
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
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case "I":
        return "danger";
      case "A":
        return "green";
      case "Ap":
        return "#f9fd04";
      case "Ip":
        return "gray";
      default:
        return "subdued";
    }
  };

  const modalChangeOrderBrand = (orderNumber: number, brand: TblBrand) => {
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Cập nhật thứ tự hiển thị thương hiệu</Title>
          </div>
        </>
      ),
      children: (
        <UpdateOrderNumberView
          orderNumber={orderNumber}
          brand={brand}
          featuredActive={featuredActive}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới thương hiệu</Title>
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
          <Title order={5}>Xoá thương hiệu</Title>
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
          <Title order={5}>Chỉnh sửa thương hiệu</Title>
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

export default Brand;
