import {
  Comparators,
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiDescriptionList,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiHighlight,
  EuiLink,
  EuiScreenReaderOnly,
  EuiSpacer,
  EuiTableFieldDataColumnType,
  EuiTableSelectionType,
  EuiTableSortingType,
  Pagination,
  euiPaletteColorBlind,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, LoadingOverlay, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import { datavisibleType } from "../../_data-fix/datavisibleType";
import {
  EditOrderNumber,
  EditPriority,
  EditStatus,
  getDataMegaMenu,
} from "../../api/ApiMegaMenu";
import AppAction from "../../common/AppAction";
import AppSearch from "../../common/AppSearch";
import { TblCategoryModel } from "../../model/TblCategoryModel";
import CreateView from "./CreateView/createView";
import EditView from "./EditView/editView";
import DeleteView from "./deleteView";
import UpdateOrderNumberView from "./updateorderNumberView";

const noItemsFoundMsg = "Không có kết quả tìm kiếm phù hợp...";

const visColors = euiPaletteColorBlind();
const visColorsBehindText = euiPaletteColorBlindBehindText();
const optionsStatic = [
  {
    value: {
      size: 5,
    },
    label: "Titan",
    "data-test-subj": "titanOption",
    color: visColorsBehindText[0],
  },
  {
    value: {
      size: 5,
    },
    label: "Enceladus",
    color: visColorsBehindText[1],
  },
  {
    value: {
      size: 5,
    },
    label: "Mimas",
    color: visColorsBehindText[2],
  },
  {
    value: {
      size: 5,
    },
    label: "Dione",
    color: visColorsBehindText[3],
  },
  {
    value: {
      size: 5,
    },
    label: "Iapetus",
    color: visColorsBehindText[4],
  },
  {
    value: {
      size: 5,
    },
    label: "Phoebe",
    color: visColorsBehindText[5],
  },
  {
    value: {
      size: 5,
    },
    label: "Rhea",
    color: visColorsBehindText[6],
  },
  {
    value: {
      size: 5,
    },
    label:
      "Pandora is one of Saturn's moons, named for a Titaness of Greek mythology",
    color: visColorsBehindText[7],
  },
  {
    value: {
      size: 5,
    },
    label: "Tethys",
    color: visColorsBehindText[8],
  },
  {
    value: {
      size: 5,
    },
    label: "Hyperion",
    color: visColorsBehindText[9],
  },
];
const optionInactive = [
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
const HomeView = () => {
  const [toltal, setTotal] = useState(0);
  const navigate = useNavigate();
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblCategoryModel[]>([]);
  const [isFrist, setIsFrist] = useState(true);
  const [numberOrder, setnumberOrder] = useState(0);
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
            await loadUsers(pagination.pageIndex, pagination.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [options, setOptions] = useState(optionsStatic);
  const [selectedOptions, setSelected] = useState();
  const [selectedOptions1, setSelected1] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<TblCategoryModel[]>([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);
  const [sortField, setSortField] =
    useState<keyof TblCategoryModel>("categoryName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const columns: Array<EuiBasicTableColumn<TblCategoryModel>> = [
    {
      field: "categoryName",
      name: "Danh mục",
      footer: <em>Page totals: {toltal}</em>,
      sortable: true,
      dataType: "string",

      render: (categroyName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            console.log(e);
            if (isNullOrUndefined(categroyName))
              NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
            else {
              const id = users.find((x) => x.categoryName === categroyName);
              if (id !== undefined && id.id > 0) editItem(id.id);
              else NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
            }
          }}
        >
          {categroyName}
        </EuiLink>
      ),
      mobileOptions: {
        render: (user: TblCategoryModel) => <span>{user.categoryName}</span>,
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "urlCanonicalForSeo",
      name: "Link web",
      width: "8%",
      sortable: true,
      dataType: "string",
      render: (categroyName: string) => (
        <EuiLink target="_blank" href={categroyName}>
          Xem trang
        </EuiLink>
      ),
      mobileOptions: {
        render: (user: TblCategoryModel) => (
          <span>{user.urlCanonicalForSeo}</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "id",
      name: "Nội dung nổi bật",
      width: "10%",
      sortable: true,
      align: "center",
      render: (id: string, online: TblCategoryModel) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            navigate("/category/category-feature/" + id, {
              state: { categoryName: online.categoryName },
            });
          }}
        >
          Nội dung nổi bật
        </EuiLink>
      ),
      mobileOptions: {
        render: (user: TblCategoryModel) => (
          <span>{user.urlCanonicalForSeo}</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "",
      name: "Nổi bật",
      dataType: "string",
      width: "10%",
      render: (online: TblCategoryModel) => {
        const color = online?.priorityStatus === "Y" ? "success" : "danger";
        return (
          <EuiLink
            target="_blank"
            onClick={async (e: any) => {
              open();
              await priorityStatusActive(online.id);
            }}
          >
            <EuiHealth color={color}>
              {" "}
              {online?.priorityStatus === "Y"
                ? "Hạ nổi bật"
                : "Cho nổi bật"}{" "}
            </EuiHealth>
          </EuiLink>
        );
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "id",
      name: "ID",
      width: "3%",
      sortable: true,
      datatype: "string",
      truncateText: true,
      render: (categroyName: number) => <Text>{categroyName}</Text>,
      mobileOptions: {
        render: (user: TblCategoryModel) => (
          <span>{user.urlCanonicalForSeo}</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "idParent",
      name: "IdParent",
      width: "3%",
      datatype: "string",
      render: (u: number) => <Text>{u ?? 0}</Text>,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "itemCount",
      name: "SP",
      dataType: "auto",
      width: "3%",
      render: (online: TblCategoryModel["itemCount"]) => {
        return (
          <EuiLink
            target="_blank"
            onClick={(e: any) => {
              console.log(e);
            }}
          >
            {online}
          </EuiLink>
        );
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "",
      name: "STT",
      width: "6%",
      render: (online: TblCategoryModel) => {
        return (
          <Text
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
                    onClose={handleDeleteViewClose}
                    load={deleteViewStatus}
                    id={online.id}
                    orderNumber={online.orderedNumber ?? 0}
                    users={users}
                  />
                ),
                confirmProps: { display: "none" },
                cancelProps: { display: "none" },
              });
            }}
          >
            {online.orderedNumber}
          </Text>
        );
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "visibleType",
      name: "Hiển thị nội dung",
      width: "15%",
      render: (online: TblCategoryModel["visibleType"]) => {
        const res = datavisibleType.find((x) => x.value == online);
        return <Text>{res?.label}</Text>;
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "",
      width: "6%",
      name: "Thuộc tính",
      dataType: "string",
      render: (online: TblCategoryModel) => {
        return (
          <Text>
            <EuiLink
              target="_blank"
              onClick={(e: any) => {
                navigate("/category/category-attr/" + online.id);
              }}
            >
              Tổng
            </EuiLink>{" "}
            {/* ({online}) */}
          </Text>
        );
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "",
      name: "Trạng thái",
      width: "8%",
      dataType: "string",
      render: (online: TblCategoryModel) => {
        const color = online?.status === "I" ? "success" : "danger";
        return (
          <EuiLink
            target="_blank"
            onClick={async (e: any) => {
              open();
              await statusActive(online.id);
            }}
          >
            <EuiHealth color={color}>
              {" "}
              {online?.status === "I" ? "Hạ xuống" : "Hiển thị"}{" "}
            </EuiHealth>
          </EuiLink>
        );
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: TblCategoryModel) => {
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
    {
      align: "left",
      width: "20px",
      isExpander: true,
      name: (
        <EuiScreenReaderOnly>
          <span>Expand rows</span>
        </EuiScreenReaderOnly>
      ),
      render: (user: TblCategoryModel) => {
        const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };
        return (
          <EuiButtonIcon
            onClick={() => toggleDetails(user)}
            aria-label={
              itemIdToExpandedRowMapValues[user.id] ? "Collapse" : "Expand"
            }
            iconType={
              itemIdToExpandedRowMapValues[user.id] ? "arrowDown" : "arrowRight"
            }
          />
        );
      },
    },
  ];

  const getRowProps = (user: TblCategoryModel) => {
    const { id } = user;
    return {
      "data-test-subj": `row-${id}`,
      className: "customRowClass",
      onClick: (e: any) => {
        {
        }
      },
    };
  };

  const getCellProps = (
    user: TblCategoryModel,
    column: EuiTableFieldDataColumnType<TblCategoryModel>
  ) => {
    const { id } = user;
    const { field } = column;
    return {
      className: "customCellClass",
      "data-test-subj": `cell-${id}-${String(field)}`,
      textOnly: true,
    };
  };

  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
  };
  useEffect(() => {
    if (isFrist) {
      loadUsers(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
      setIsFrist(false);
    } else
      loadUsers(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
  }, [pagination.pageIndex, pagination.pageSize, deleteViewStatus]);

  const loadUsers = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setUsers([]);
    setError(undefined);

    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getDataMegaMenu(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else {
        setUsers(callapi?.data ?? []);
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

  const priorityStatusActive = async (id: number) => {
    if (id < 1) NotificationExtension.Fails("Mã danh mục không tồn tại !");
    else {
      setLoading(true);
      try {
        let urlSearch = "?id=" + id;
        let callapi = await EditPriority(urlSearch);
        close();
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await loadUsers(
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
  const statusActive = async (id: number) => {
    if (id < 1) NotificationExtension.Fails("Mã danh mục không tồn tại !");
    else {
      setLoading(true);

      try {
        let urlSearch = "?id=" + id;
        let callapi = await EditStatus(urlSearch);
        close();
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await loadUsers(
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
  const orderNumberSet = async (id: number, orderNumberr: number) => {
    const numberOld = users.find((x) => x.id === id);
    if (id < 1) {
      NotificationExtension.Fails("Mã danh mục không tồn tại !");
      //  return;
    } else if (numberOld === undefined) {
      NotificationExtension.Fails("Danh mục cập nhật không tồn tại !");
      // return;
    } else if (numberOld.orderedNumber === orderNumberr) {
      NotificationExtension.Fails("Bạn chưa thay đổi STT !");
    } else if (orderNumberr < 1) {
      NotificationExtension.Fails("Bạn chưa nhập STT mới !");
    } else {
      setLoading(true);
      open();

      try {
        let urlSearch = "?id=" + id + "&order=" + orderNumberr;
        let callapi = await EditOrderNumber(urlSearch);
        close();
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            setnumberOrder(0);
            await loadUsers(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            );
          } else NotificationExtension.Fails("Thao tác thất bại !");
        }
      } catch (error: any) {
        setError("Có lỗi xảy ra khi tải dữ liệu !");
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  const onTableChange = async ({
    page: { index, size },
    sort,
  }: CriteriaWithPagination<TblCategoryModel>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };
  const onSearch = async (event: any) => {
    await loadUsers(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };

  const onChange1 = (selectedOptions: any) => {
    setSelected1(selectedOptions);
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  const renderOption = (
    option: any,
    searchValue: any,
    contentClassName: string | undefined
  ) => {
    const { color, label, value } = option;
    const dotColor = visColors[visColorsBehindText.indexOf(color)];
    return (
      <EuiHealth color={dotColor}>
        <span className={contentClassName}>
          <EuiHighlight search={searchValue}>{label}</EuiHighlight>
          &nbsp;
          <span>({value.size})</span>
        </span>
      </EuiHealth>
    );
  };

  const onSelectionChange = (selectedItems: TblCategoryModel[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<TblCategoryModel> = {
    selectable: (user: TblCategoryModel) => true,
    onSelectionChange,
  };

  const sorting: EuiTableSortingType<TblCategoryModel> = {
    sort: {
      field: sortField,
      direction: sortDirection,
    },
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới danh mục !</Title>
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
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const id = isSelectedItem[0];
      editItem(id.id);
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
          <Title order={5}>Xóa demo !</Title>
        </>
      ),
      children: (
        <DeleteView
          onClose={handleDeleteViewClose}
          load={deleteViewStatus}
          ids={idItem}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
      onConfirm: () => {
        console.log(1111);
      },
    });
  }

  function editItem(idItem: number) {
    const id = idItem;
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa danh mục !</Title>
        </>
      ),

      children: (
        <EditView
          onClose={handleDeleteViewClose}
          load={deleteViewStatus}
          id={id}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<
    Record<string, ReactNode>
  >({});
  const toggleDetails = (user: TblCategoryModel) => {
    const itemIdToExpandedRowMapValues = { ...itemIdToExpandedRowMap };

    if (itemIdToExpandedRowMapValues[user.id]) {
      delete itemIdToExpandedRowMapValues[user.id];
    } else {
      const color = user.priorityStatus === "Y" ? "success" : "danger";
      const label = user.priorityStatus === "Y" ? "Hạ nổi bật" : "Cho nổi bật";
      const listItems = [
        {
          title: "Mã danh mục",
          description: `${user.categoryCode ?? ""}`,
        },
        {
          title: "Nổi bật",
          description: <EuiHealth color={color}>{label}</EuiHealth>,
        },
      ];
      itemIdToExpandedRowMapValues[user.id] = (
        <EuiDescriptionList listItems={listItems} />
      );
    }
    setItemIdToExpandedRowMap(itemIdToExpandedRowMapValues);
  };

  useEffect(() => {
    let items;
    if (sortField) {
      items = users
        .slice(0)
        .sort(
          Comparators.property(sortField, Comparators.default(sortDirection))
        );
    } else {
      items = users;
    }
    setUsers(items);
  }, [sortField, sortDirection]);

  return (
    <>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() => {
          loadUsers(
            pagination.pageIndex,
            pagination.pageSize,
            paramSearch?.keyWord,
            paramSearch?.inActive
          );
        }}
      />

      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={users}
        itemId="id"
        error={error}
        loading={loading}
        noItemsMessage={isNullOrUndefinedArry(users) ? message : ""}
        selection={selection}
        columns={columns}
        pagination={pagination}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        onChange={onTableChange}
        compressed={true}
        rowProps={getRowProps}
        cellProps={getCellProps}
        itemIdToExpandedRowMap={itemIdToExpandedRowMap}
        isExpandable={true}
        sorting={sorting}
      />
    </>
  );
};

export default HomeView;
