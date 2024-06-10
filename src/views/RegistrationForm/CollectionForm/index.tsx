import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import {
  Box,
  Divider,
  List,
  Menu,
  NumberFormatter,
  Text,
  Title,
} from "@mantine/core";
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
// import CreateView from "./CreateView";
// import DeleteView from "./DeleteView";
import EditView from "./EditView";
import { useNavigate } from "react-router-dom";
import { TblCollectionForm } from "../../../model/TblCollectionForm";
import DeleteView from "./DeleteView";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const optionSearch = {
  isActive: [
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
  ],

  status: [
    {
      value: "S",
      label: "Thành công",
      "data-test-subj": "titanOption",
      color: visColorsBehindText[0],
    },
    {
      value: "C",
      label: "Huỷ bỏ",
      "data-test-subj": "titanOption",
      color: visColorsBehindText[0],
    },
    {
      value: "P",
      label: "Chờ xử lý",
      "data-test-subj": "titanOption",
      color: visColorsBehindText[0],
    },
  ],
};

const CollectionForm = () => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "3%",
    },
    {
      field: "",
      name: "Khách hàng",
      sortable: true,
      width: "22%",
      truncateText: true,
      render: (online: TblCollectionForm) => (
        <p>
          {online.fullname} ({online.email})
        </p>
      ),
    },
    {
      field: "productName",
      name: "Sản phẩm",
      sortable: true,
      truncateText: true,
      render: (productName: string, collection: TblCollectionForm) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            handleEditData(collection.id);
          }}
        >
          {productName}
        </EuiLink>
      ),
    },
    {
      field: "creationDate",
      name: "Thời gian",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (date: string) => (
        <Text w={"100%"} truncate>
          {date}
        </Text>
      ),
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: TblCollectionForm) => {
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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [selectedSearch, setSelectedSearch] = useState<{
    isActive: any[];
    status: any[];
  }>({
    isActive: [],
    status: [],
  });
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<TblCollectionForm[]>([]);
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

  const handleChangeSearch = (value: any[], key: string) => {
    setSelectedSearch((prevData) => ({ ...prevData, [key]: value }));
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

  // const openModal = () =>
  //   modals.openConfirmModal({
  //     title: (
  //       <>
  //         <div color="white">
  //           <Title order={5}>Thêm mới đơn</Title>
  //         </div>
  //       </>
  //     ),
  //     children: (
  //       <CreateView
  //         onSearch={() =>
  //           fetchDataCollectionForm(
  //             pagination.pageIndex,
  //             pagination.pageSize,
  //             paramSearch?.keyWord,
  //             paramSearch?.inActive
  //           )
  //         }
  //       />
  //     ),
  //     confirmProps: { display: "none" },
  //     cancelProps: { display: "none" },
  //   });

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn("Xin vui lòng chọn 1 đơn để chỉnh sửa !");
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
          <Title order={5}>Xóa đơn</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataCollectionForm(
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
          <Title order={5}>Chỉnh sửa đơn!</Title>
        </>
      ),
      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataCollectionForm(
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

  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Chọn tình trạng ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn..."
          options={optionSearch.status}
          selectedOptions={selectedSearch?.status}
          onChange={(e) => handleChangeSearch(e, "status")}
          fullWidth={true}
          singleSelection={{ asPlainText: true }}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Trạng thái ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn..."
          options={optionSearch.isActive}
          selectedOptions={selectedSearch?.isActive}
          onChange={(e) => handleChangeSearch(e, "isActive")}
          fullWidth={true}
          isDisabled={loading}
          singleSelection={{ asPlainText: true }}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
  ];

  const fetchDataCollectionForm = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);

    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_COLLECTION_FORM}?Skip=${
        index * (size ?? 0)
      }&Take=${60}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      // if (!isNullOrUndefined(inActive))
      //   urlSearch = urlSearch + `&Active=` + inActive;
      // if (
      //   selectedSearch &&
      //   selectedSearch.status &&
      //   selectedSearch.status.length > 0
      // ) {
      //   selectedSearch.status.map(
      //     (status) => (urlSearch += `&Status=${status.value}`)
      //   );
      // }

      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
        setDatas([]);
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
      await fetchDataCollectionForm(
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
        // openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataCollectionForm(
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

export default CollectionForm;
