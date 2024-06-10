import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Flex, Title } from "@mantine/core";
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
import { TblTag } from "../../../model/TblTag";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import EditView from "./EditView";
import PrePay from "./PrePay/MainView";
import InstallmentTerm from "./InstallmentTerm/MainView";
import { TblInstallment } from "../../../model/TblInstallment";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const UrlRedirect = () => {
  const columns: Array<EuiBasicTableColumn<TblInstallment>> = [
    {
      name: "Id",
      width: "5%",
      render: (data: TblInstallment) => {
        return <p>{data.tblInstallmentModel?.id}</p>;
      },
    },
    {
      name: "Tên công ty",
      width: "10%",
      render: (data: TblInstallment) => {
        return <p>{data?.tblInstallmentModel?.companyName}</p>;
      },
    },
    {
      name: "Mã công ty",
      width: "10%",
      render: (data: TblInstallment) => {
        return <p>{data?.tblInstallmentModel?.companyCode}</p>;
      },
    },
    {
      name: "Thông tin trả góp",
      render: (data: TblInstallment) => {
        return (
          <Flex direction="column">
            <PrePay
              itemid={data.tblInstallmentModel.id}
              data={data.tblInstallmentPayModels}
              onSearch={() =>
                fetchDataUrl(
                  pagination.pageIndex,
                  pagination.pageSize,
                  paramSearch?.keyWord,
                  paramSearch?.inActive
                )
              }
            />
            <InstallmentTerm
              itemid={data.tblInstallmentModel.id}
              data={data.tblInstallmentDurationModels}
              onSearch={() =>
                fetchDataUrl(
                  pagination.pageIndex,
                  pagination.pageSize,
                  paramSearch?.keyWord,
                  paramSearch?.inActive
                )
              }
            />
          </Flex>
        );
      },
    },
    {
      name: "Actions",
      width: "10%",
      render: (data: TblInstallment) => {
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
                    if (isNullOrUndefined(data))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      editItem(data.tblInstallmentModel.id);
                    }
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(data))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteItem(data.tblInstallmentModel.id);
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
    setDeleteViewStatus(status);
  };
  const [data, setdata] = useState<any[]>([]);
  const [message, setMessage] = useState<ReactNode>();
  const fetchDataUrl = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setdata([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_INSTALLMENT}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await repository.get<MessageResponse<any>>(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage("Không có dữ liệu");
        setTotal(0);
      } else {
        setdata(callapi?.data?.lists ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.data?.count ?? 0,
        });
        setTotal(callapi?.data?.count ?? 0);
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
            <Title order={5}>Thêm mới Tag</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          onClose={handleDeleteViewClose}
          load={deleteViewStatus}
          onSearch={() =>
            fetchDataUrl(
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
      NotificationExtension.Warn("Xin vui lòng chọn 1 sản phẩm để chỉnh sửa !");
    else {
      editItem(isSelectedItem[0].id);
    }
  };

  // const openModalDelete = () => {
  //   if (isSelectedItem && isSelectedItem.length < 1)
  //     NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
  //   else {
  //     const ids = isSelectedItem;
  //     deleteItem(ids.map((item) => item.id));
  //   }
  // };

  function deleteItem(idItem: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xoá Tag</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataUrl(
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
          <Title order={5}>Chỉnh sửa công ty</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onClose={handleDeleteViewClose}
          onSearch={() =>
            fetchDataUrl(
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

  const [isFrist, setIsFrist] = useState(true);

  useEffect(() => {
    if (isFrist) setIsFrist(false);

    const fetchData = async () => {
      await fetchDataUrl(
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
        // openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataUrl(
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

export default UrlRedirect;
