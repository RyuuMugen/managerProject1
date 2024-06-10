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
import { Divider, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";

import DeleteView from "./DeleteView";

import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import Repository from "../../_base/helper/HttpHelper";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import AppAction from "../../common/AppAction";
import AppSearch from "../../common/AppSearch";
import { API_ROUTE } from "../../const/apiRoute";
import { MessageResponse } from "../../model/MessageResponse";

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
const ComboSet = () => {
  const navigate = useNavigate();

  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "setName",
      name: "Tên Combo Set",
      sortable: true,
      truncateText: true,
      width: "25%",
      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const item = datas.find((x) => x.setName === itemName);
            if (item !== undefined && item.id > 0) handleEditData(item?.id);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "description",
      name: "Mô tả Combo Set",
      sortable: true,
      truncateText: true,
    },
    {
      // chỗ này sẽ đếm số sp có trong set
      field: "",
      name: "Số sản phẩm trong Combo Set",
      sortable: true,
      truncateText: true,
      width: "14%",
      render: (online: any) => {
        const count =
          online.tblComboSetGroupModels?.reduce((total: number, item: any) => {
            return total + (item?.tblComboSetProdModels?.length || 0);
          }, 0) || 0;
        return <Text style={{ color: "#CC0000" }}>{count}</Text>;
      },
    },
    {
      field: "status",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "15%",
      render: (status: any) => (
        <EuiHealth color={getStatusColor(status)}>
          {status === "A" ? "Hoạt động" : "Không hoạt động"}
        </EuiHealth>
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

  const getTypeArticle = (type: any) => {
    switch (type) {
      case 1:
        return "Chỉ hiển thị danh mục con";
      case 2:
        return "Chỉ hiển thị bài";
      case 3:
        return "Hiển thị bài + Danh mục con";
      default:
        return "Chỉ hiển thị danh mục con";
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<any[]>([]);
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

  const openModal = () => {
    navigate("/combo-set-add");
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
          <Title order={5}>Xóa ComboSet</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataComboSet(
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
    navigate("/combo-set-edit", { state: { id: id } });
  }

  const fetchDataComboSet = async (
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
      let urlSearch = `${API_ROUTE.GET_LIST_COMBO_SET}?Skip=${
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
      await fetchDataComboSet(
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
          fetchDataComboSet(
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

export default ComboSet;
