import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode, useEffect, useState } from "react";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import Repository from "../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../const/apiRoute";
import { getListAttribute } from "../../api/ApiAttribute";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import { MessageResponse } from "../../model/MessageResponse";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import AppAction from "../../common/AppAction";
import AppSearch from "../../common/AppSearch";
import { getDetailAttibute } from "../../api/ApiAttribute";

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
const PropertyList = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "attributeCode",
      name: "Mã thuộc tính",
      sortable: true,
      truncateText: true,
    },
    {
      field: "attributeName",
      name: "Tên thuộc tính",
      sortable: true,
      truncateText: true,
    },
    {
      field: "description",
      name: "Mô tả thuộc tính",
      sortable: true,
      truncateText: true,
    },
    {
      field: "attributeGroup",
      name: "Phân loại (Global-Local)",
      sortable: true,
      truncateText: true,
      render: (value: string) => {
        return <>{value === "G" ? "Global" : "Local"}</>;
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

  const [datas, setdatas] = useState<any[]>([]);
  const [message, setMessage] = useState<ReactNode>();
  const fetchDataAttribute = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setdatas([]);
    setError(undefined);

    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getListAttribute(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage("Không có dữ liệu");
        setTotal(0);
      } else {
        setdatas(callapi?.data ?? []);
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

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới thuộc tính</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          onSearch={() =>
            fetchDataAttribute(
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

  const openModalEdit = async () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 thuộc tính để chỉnh sửa !"
      );
    else {
      const data = await getDetailAttibute(isSelectedItem[0]?.id);
      editItem(data?.data);
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
          <Title order={5}>Xóa thuộc tính</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataAttribute(
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

  function editItem(item: any) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa thuộc tính</Title>
        </>
      ),

      children: (
        <CreateView
          data={item}
          onSearch={() =>
            fetchDataAttribute(
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

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataAttribute(
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
          fetchDataAttribute(
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

export default PropertyList;
