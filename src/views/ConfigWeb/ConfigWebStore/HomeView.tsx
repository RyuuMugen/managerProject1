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
import { Divider, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import AppAction from "../../../common/AppAction";
import { TblConfigWebStore } from "../../../model/TblConfigWeb";
import CreateView from "./CreateView";
import EditView from "./EditView";
import DeleteView from "./DeleteVew";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { getDataProvice } from "../../../api/ApiAddress";
import { tblProvince } from "../../../model/TblAddress";

const ConfigWebStore = ({
  dataStore,
  handelChangeConfigWebStore,
}: ConfigWebStoreProps) => {
  const columns: Array<EuiBasicTableColumn<TblConfigWebStore>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "3%",
    },
    {
      field: "storeName",
      name: "Tên cửa hàng",
      sortable: true,
      truncateText: true,
      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const item = dataStore?.find((x) => x.storeName === itemName);
            if (item !== undefined && item?.id > 0) handleEditData(item);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "address",
      name: "Địa chỉ cửa hàng",
      sortable: true,
      truncateText: true,
    },
    {
      field: "provinceId",
      name: "Tỉnh",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (provinceId: number) => (
        <EuiLink target="_blank">
          {
            dataAllProvince.find((item) => item.provinceId === provinceId)
              ?.provinceName
          }
        </EuiLink>
      ),
    },
    {
      field: "isActualStore",
      name: "Là 1 cửa hàng",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (isActualStore: string) => (
        <EuiHealth color={isActualStore === "Y" ? "green" : "danger"}>
          {isActualStore === "Y" ? "Yes" : "No"}
        </EuiHealth>
      ),
    },
    {
      field: "storeID",
      name: "ERP ID",
      sortable: true,
      truncateText: true,
      width: "8%",
    },
    {
      field: "",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (online: TblConfigWebStore) => (
        <EuiLink
          target="_blank"
          onClick={async (e: any) => {
            await statusActive(online.id);
          }}
        >
          <EuiHealth color={online.status === "A" ? "green" : "danger"}>
            {online.status === "A" ? "Hiển thị" : "Không hiển thị"}
          </EuiHealth>
        </EuiLink>
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
                      editItem(online);
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

  const [dataAllProvince, setDataAllProvince] = useState<tblProvince[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [isSelectedItem, setSelectedItems] = useState<TblConfigWebStore[]>([]);

  const handleEditData = async (item: TblConfigWebStore) => {
    if (item) {
      editItem(item);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới cửa hàng</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          handleCreateStore={handleCreateStore}
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
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 phường/xã để chỉnh sửa !"
      );
    else {
      editItem(isSelectedItem[0]);
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

  function deleteItem(idItems: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa cửa hàng</Title>
        </>
      ),
      children: (
        <DeleteView idItems={idItems} handleDeleteStore={handleDeleteStore} />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  function editItem(data: TblConfigWebStore) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa cửa hàng !</Title>
        </>
      ),

      children: (
        <EditView data={data || null} handleEditStore={handleEditStore} />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  const onSelectionChange = (selectedItems: TblConfigWebStore[]) => {
    setSelectedItems(selectedItems);
  };

  const selection: EuiTableSelectionType<TblConfigWebStore> = {
    selectable: (data: TblConfigWebStore) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblConfigWebStore>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
  };

  const statusActive = (id: number) => {
    if (dataStore) {
      const updateDataStore = dataStore.map((item) => {
        if (item.id === id) {
          return { ...item, status: item.status === "A" ? "I" : "A" };
        }
        return item;
      });
      handelChangeConfigWebStore(updateDataStore);
    } else NotificationExtension.Fails("Có lỗi xảy ra vui lòng thử lại");
  };

  const handleCreateStore = (dataSubmit: TblConfigWebStore) => {
    if (dataStore) {
      const updateDataStore = dataStore.concat(dataSubmit);
      handelChangeConfigWebStore(updateDataStore);
    } else handelChangeConfigWebStore([dataSubmit]);
  };

  const handleEditStore = (dataSubmit: TblConfigWebStore) => {
    if (dataStore) {
      const updateDataStore = dataStore.map((item) => {
        if (item.id === dataSubmit.id) {
          return {
            ...item,
            ...dataSubmit,
          };
        }
        return item;
      });
      handelChangeConfigWebStore(updateDataStore);
    } else NotificationExtension.Fails("Có lỗi xảy ra vui lòng thử lại");
  };

  const handleDeleteStore = (idItems: number[]) => {
    if (dataStore) {
      const updateDataStore = dataStore.filter((item) => {
        // Chỉ giữ những phần tử có id không trùng với mảng IdItems
        return !idItems.includes(item.id);
      });
      handelChangeConfigWebStore(updateDataStore);
    } else NotificationExtension.Fails("Có lỗi xảy ra vui lòng thử lại");
  };

  const fetchDataProvince = async () => {
    const data = await getDataProvice("Active=true&Skip=0&Take=1000");
    setDataAllProvince(data?.data);
  };

  useEffect(() => {
    fetchDataProvince();
  }, []);

  return (
    <div>
      <EuiSpacer size="l" />
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={dataStore ? dataStore : []}
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
    </div>
  );
};

export default ConfigWebStore;

type ConfigWebStoreProps = {
  dataStore: TblConfigWebStore[] | null;
  handelChangeConfigWebStore: (data: TblConfigWebStore[]) => void;
};
