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
import { Divider, Menu, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { useDisclosure } from "@mantine/hooks";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import { getDataBannerLocation } from "../../../api/ApiBannerManager";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { tblBanner } from "../../../model/TblBanner";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import EditView from "./EditView";
import UpdateOrderNumberView from "./UpdateOrderNumberView";
const visColorsBehindText = euiPaletteColorBlindBehindText();

const BannerManager = () => {
  const changeImageUrl = (url: string) => {
    if (url.includes("192.168.3.96:9500")) {
      return url.replace("192.168.3.96:9500", "image-dev.hacom.vn:9500");
    }
    return url;
  };

  const optionSearch = {
    isActive: [
      {
        value: "A",
        label: "Kích hoạt",
        "data-test-subj": "titanOption",
        color: visColorsBehindText[0],
      },
      {
        value: "I",
        label: "Chưa kích hoạt",
        color: visColorsBehindText[1],
      },
    ],
  };
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "name",
      name: "Tên banner",
      sortable: true,
      truncateText: true,
      width: "20%",
      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const item = datas.find((x) => x.name === itemName);
            if (item !== undefined && item.id > 0) handleEditData(item?.id);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "code",
      name: "Mã banner",
      sortable: true,
      truncateText: true,
      width: "20%",
    },
    {
      field: "fileBanner",
      name: "Banner",
      sortable: true,
      truncateText: true,

      render: (link: string) => (
        <>
          <img
            src={changeImageUrl(link)}
            alt=""
            style={{ width: "25%", height: "20%" }}
          />
        </>
      ),
    },
    {
      field: "orderNumber",
      name: "Thứ tự",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (ordering: number, brand: tblBanner) => (
        <EuiLink
          target="_blank"
          onClick={() => modalChangeOrderBanner(ordering, brand)}
        >
          {ordering}
        </EuiLink>
      ),
    },
    {
      field: "",
      name: "Kích thước",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (item: tblBanner) => (
        <>
          <Text>
            {item.bannerWidth || 0}px x {item.bannerHeight || 0}px
          </Text>
        </>
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<tblBanner[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedActive, setSelectedActive] = useState<any[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any[]>([]);
  const [featureSearch, setFeatureSearch] = useState<any[]>([]);
  const [dataBannerLocation, setDataBannerLocation] = useState<any[]>([]);
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
  const onChangeActive = (selectedOptions: any) => {
    setSelectedActive(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };
  const onChangeFeature = (selectedOption: any[]) => {
    setSelectedFeature(selectedOption);
    setFeatureSearch(selectedOption);
  };
  const loadDataBannerLocation = async () => {
    setDataBannerLocation([]);
    const data = await getDataBannerLocation("Active=true&Skip=0&Take=1000");
    const transformedData = data?.data.map((item: any, index: number) => ({
      value: item.id.toString(),
      label: item.bannerLocName,
      color: visColorsBehindText[index % visColorsBehindText.length],
    }));
    setDataBannerLocation(transformedData);
  };
  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới Banner</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          onSearch={() =>
            fetchDataBanner(
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
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 danh mục khách hàng để chỉnh sửa !"
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
  const modalChangeOrderBanner = (orderNumber: number, banner: tblBanner) => {
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Cập nhật thứ tự hiển thị banner</Title>
          </div>
        </>
      ),
      children: (
        <UpdateOrderNumberView
          orderNumber={orderNumber}
          banner={banner}
          onSearch={() =>
            fetchDataBanner(
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
  };
  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa Banner</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataBanner(
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
          <Title order={5}>Chỉnh sửa Banner!</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataBanner(
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
      <EuiFormRow label="Trạng thái ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn trạng thái"
          options={optionSearch.isActive}
          selectedOptions={selectedActive}
          onChange={onChangeActive}
          fullWidth={true}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Vị trí banner: ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn vị trí"
          options={dataBannerLocation}
          selectedOptions={selectedFeature}
          onChange={onChangeFeature}
          fullWidth={true}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
  ];
  const fetchDataBanner = async (
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
      let urlSearch = `${API_ROUTE.GET_LIST_BANNER}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Status=` + inActive;
      if (!isNullOrUndefined(featureSearch)) {
        featureSearch?.forEach(
          (feature) => (urlSearch += `&LocationIds=${feature.value}`)
        );
      }
      let callapi = await repository.get<MessageResponse<tblBanner[]>>(
        urlSearch
      );
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
      await fetchDataBanner(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
    loadDataBannerLocation();
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
        onChange={onChangeFeature}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataBanner(
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

export default BannerManager;
