import {
  Comparators,
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHealth,
  EuiImage,
  EuiInMemoryTable,
  EuiInMemoryTableProps,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  EuiTableSortingType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Menu,
  NumberInput,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../../_base/model/_base/ParamSearchBase";
import {
  modifyItemFeature,
  modifyItemStatus,
} from "../../../../api/ApiProduct";
import { getDataBrand } from "../../../../api/ApiSell";
import { getDataListProduct } from "../../../../api/ApiProduct";
import AppAction from "../../../../common/AppAction";
import AppSearch from "../../../../common/AppSearch";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import CreateView from "../CreateView/CreateView";
import DeleteView from "../DeleteView";
import EditView from "../EditView/EditView";
import { Brand, featureOption } from "../../../../model/ProductList";
import { TblItemCommand } from "../../../../model/ProductList";
import UpdateOrderNumberView from "./updateorderNumberView";
import { useNavigate } from "react-router-dom";
import ProductListSearch from "../../../../common/ProductListSearch";

export interface selectedSearchOptionType {
  features?: EuiComboBoxOptionOption<string>[];
  searchType?: EuiComboBoxOptionOption<number>[];
  brandId?: EuiComboBoxOptionOption<number>[];
}

const noItemsFoundMsg = "Không có kết quả tìm kiếm phù hợp...";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const optionSearch = {
  features: [
    {
      value: "NewStatus",
      label: "Mới",
      "data-test-subj": "titanOption",
      color: visColorsBehindText[0],
    },
    {
      value: "HotStatus",
      label: "Hot (hỏi nhiều)",
      color: visColorsBehindText[1],
    },
    {
      value: "BestSaleStatus",
      label: "Bán chạy",
      color: visColorsBehindText[2],
    },
    {
      value: "SaleOffStatus",
      label: "Xả hàng (sale-off)",
      color: visColorsBehindText[3],
    },
    {
      value: "OnlineStatus",
      label: "Chỉ bán online",
      color: visColorsBehindText[4],
    },
  ],

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
};

const ProductList = () => {
  const navigate = useNavigate();
  const hacomUrl = process.env.REACT_APP_BASE_WEB_HACOM_URL;
  const [toltal, setTotal] = useState(0);
  const [dataBrand, setDataBrand] = useState<Brand[]>();
  const [dataBrandOption, setDataBrandOption] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const columns: Array<EuiBasicTableColumn<TblItemCommand>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "itemName",
      name: "Tên sản phẩm",
      footer: <em>Page totals: {toltal}</em>,
      sortable: true,
      truncateText: true,
      width: "18%",

      render: (itemName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            const id = users.find((x) => x.itemName === itemName);
            if (id !== undefined && id.id > 0) handleEditData(id?.id);
          }}
        >
          {itemName}
        </EuiLink>
      ),
    },
    {
      field: "itemCode",
      name: "Mã sản phẩm",
      sortable: true,
      truncateText: true,
      width: "7%",
    },
    {
      field: "primaryImage",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (primaryImage: any) => {
        return (
          <EuiImage
            size=""
            width={60}
            height={80}
            src={primaryImage}
            alt="alt"
          />
        );
      },
    },
    {
      field: "brandId",
      name: "Thương hiệu",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (brandId: number) => {
        return (
          <EuiLink target="_blank">
            {dataBrand?.filter((item: any) => item?.id === brandId)[0]?.name}
          </EuiLink>
        );
      },
    },
    {
      field: "unitSellingPrice",
      name: "Giá bán",
      sortable: true,
      truncateText: true,
      render: (price: number) => {
        return (
          <>
            <Text fw={600} style={{ color: "red", marginRight: 4 }}>
              {convertToVnd(price)}
            </Text>
            <Text>vnd</Text>
          </>
        );
      },
    },
    {
      field: "discountValue",
      name: "Giảm giá",
      sortable: true,
      truncateText: true,
      render: (discountValue: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Giảm giá</Text>
              <Text fw={600} style={{ color: "red", marginLeft: 4 }}>
                {discountValue ? `${discountValue}%` : "0%"}
              </Text>
            </Box>
            <Text>so với giá gốc</Text>
          </Box>
        );
      },
    },
    {
      field: "onhandQuantyty",
      name: "Số lượng tồn kho",
      sortable: true,
      truncateText: true,
      render: (onhandQuantyty: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Số lượng tổng:</Text>
              <Text fw={600} style={{ color: "red", marginLeft: 4 }}>
                {onhandQuantyty}
              </Text>
            </Box>
            <EuiLink>
              {onhandQuantyty == 0 ? (
                <Text style={{ color: "red" }}>hết hàng</Text>
              ) : (
                <Text style={{ color: "blue" }}>còn hàng</Text>
              )}
            </EuiLink>
          </Box>
        );
      },
    },
    {
      field: "warrantyDescrition",
      name: "Thông tin bảo hành",
      sortable: true,
      truncateText: true,
      render: (warrantyDescrition: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Thời hạn:</Text>
              <EuiLink style={{ marginLeft: 4 }}>{warrantyDescrition}</EuiLink>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "",
      name: "Đặc điểm sản phẩm",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (item: TblItemCommand) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Checkbox
              value="newStatus"
              label="Mới"
              mb={"xs"}
              defaultChecked={item.newStatus === "Y" ? true : false}
              onChange={(event) =>
                handleChangeFeature(
                  "newStatus",
                  event.currentTarget.checked,
                  item.id
                )
              }
            />
            <Checkbox
              value="hotStatus"
              label="HOT (hỏi nhiều)"
              mb={"xs"}
              defaultChecked={item.hotStatus === "Y" ? true : false}
              onChange={(event) =>
                handleChangeFeature(
                  "hotStatus",
                  event.currentTarget.checked,
                  item.id
                )
              }
            />
            <Checkbox
              value="bestSaleStatus"
              label="Bán chạy"
              mb={"xs"}
              defaultChecked={item.bestSaleStatus === "Y" ? true : false}
              onChange={(event) =>
                handleChangeFeature(
                  "bestSaleStatus",
                  event.currentTarget.checked,
                  item.id
                )
              }
            />
            <Checkbox
              value="saleOffStatus"
              label="Xả hàng (sale-off)"
              mb={"xs"}
              defaultChecked={item.saleOffStatus === "Y" ? true : false}
              onChange={(event) =>
                handleChangeFeature(
                  "saleOffStatus",
                  event.currentTarget.checked,
                  item.id
                )
              }
            />
            <Checkbox
              value="onlineStatus"
              label="Chỉ bán online"
              mb={"xs"}
              defaultChecked={item.onlineStatus === "Y" ? true : false}
              onChange={(event) =>
                handleChangeFeature(
                  "onlineStatus",
                  event.currentTarget.checked,
                  item.id
                )
              }
            />
            <Button onClick={() => handleUpdateStatus(item.id)}>
              Cập nhật
            </Button>
          </Box>
        );
      },
    },
    {
      field: "inUse",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (inUse: string, online: TblItemCommand) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            handleEditItemInUse(online.id);
          }}
        >
          <EuiHealth color={inUse === "Y" ? "green" : "danger"}>
            {inUse === "Y" ? "Hiển thị" : "Không hiển thị"}
          </EuiHealth>
        </EuiLink>
      ),
    },
    {
      field: "orderNumber",
      name: "STT",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (orderNumber: number, online: TblItemCommand) => (
        <EuiLink
          target="_blank"
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
                  onSearch={onSearch}
                  id={online.id}
                  orderNumber={orderNumber ?? 0}
                  item={users}
                />
              ),
              confirmProps: { display: "none" },
              cancelProps: { display: "none" },
            });
          }}
        >
          {orderNumber || 0}
        </EuiLink>
      ),
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: TblItemCommand) => {
        return (
          <Flex direction={"column"} gap={7}>
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

            <Anchor
              href={`${hacomUrl}/product-detail/${online.url}`}
              underline="always"
              target="_blank"
            >
              Xem tại web
            </Anchor>
          </Flex>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblItemCommand[]>([]);
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
            await fetchDataItem(pagination.pageIndex, pagination.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedActive, setSelectedActive] = useState<any[]>([]);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<TblItemCommand[]>([]);
  const [feature, setFeature] = useState<featureOption[]>([]);
  const [sortField, setSortField] = useState<keyof TblItemCommand>("itemName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedSearchOption, setSelectedSearchOption] =
    useState<selectedSearchOptionType>();

  const fetchDataItem = async (
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
      if (!isNullOrUndefined(selectedSearchOption?.features)) {
        selectedSearchOption?.features?.forEach(
          (feature) => (urlSearch += `&${feature.value}=y`)
        );
      }
      if (!isNullOrUndefined(selectedSearchOption?.searchType)) {
        selectedSearchOption?.searchType?.forEach(
          (searchType) => (urlSearch += `&SearchType=${searchType.value}`)
        );
      }
      if (!isNullOrUndefined(selectedSearchOption?.brandId)) {
        selectedSearchOption?.brandId?.forEach(
          (brandId) => (urlSearch += `&BrandId=${brandId.value}`)
        );
      }
      let callapi = await getDataListProduct(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else {
        setUsers(callapi?.data || []);
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
    sort,
  }: CriteriaWithPagination<TblItemCommand>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
    if (sort) {
      const { field: sortField, direction: sortDirection } = sort;
      setSortField(sortField);
      setSortDirection(sortDirection);
    }
  };

  const onSearch = async () => {
    await fetchDataItem(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  useEffect(() => {
    setFeature(
      users.map((item) => ({
        id: item.id,
        hotStatus: item.hotStatus || "N",
        newStatus: item.newStatus || "N",
        bestSaleStatus: item.bestSaleStatus || "N",
        saleOffStatus: item.saleOffStatus || "N",
        onlineStatus: item.onlineStatus || "N",
      }))
    );
  }, [users]);

  const handleEditItemInUse = async (id: number) => {
    await modifyItemStatus(id);
    onSearch();
  };

  const handleGoToEditAttribute = (idAttr: number) => {
    modals.closeAll();
    navigate("/attribute", { state: { id: idAttr } });
  };

  const handleChangeFeature = (value: string, checked: boolean, id: number) => {
    setFeature((prevFeature) => {
      return prevFeature.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [value]: checked ? "Y" : "N",
          };
        }
        return item;
      });
    });
  };

  const handleUpdateStatus = async (id: number) => {
    const data = feature.find((item) => item.id === id);
    if (data) {
      await modifyItemFeature(data);
      onSearch();
    } else
      NotificationExtension.Warn(
        "Xin vui lòng cập nhật đặc điểm cho sản phẩm!"
      );
  };

  const onChangeSelectedSearch = (
    value:
      | EuiComboBoxOptionOption<string>[]
      | EuiComboBoxOptionOption<number>[],
    key: string
  ) => {
    const dataSearchOption = { ...selectedSearchOption };
    dataSearchOption[key as keyof selectedSearchOptionType] = value as any[];
    setSelectedSearchOption(dataSearchOption);
  };

  const onChangeActive = (selectedOptions: any) => {
    setSelectedActive(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };

  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Trạng thái ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn..."
          options={optionSearch.isActive}
          selectedOptions={selectedActive}
          onChange={onChangeActive}
          fullWidth={true}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
  ];

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  const onSelectionChange = (selectedItems: TblItemCommand[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<TblItemCommand> = {
    selectable: (user: TblItemCommand) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  const sorting: EuiTableSortingType<TblItemCommand> = {
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
            <Title order={5}>Thêm mới sản phẩm</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          onSearch={() =>
            fetchDataItem(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
          handleGoToEditAttribute={handleGoToEditAttribute}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  const handleEditData = async (id: number) => {
    if (id) {
      editItem(id);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
  };
  function convertToVnd(amount: number): string {
    const amountStr: string = amount?.toString();
    const chunks: string[] = [];

    for (let i = amountStr?.length - 1; i >= 0; i -= 3) {
      const chunk = amountStr?.slice(Math.max(i - 2, 0), i + 1);
      chunks.push(chunk);
    }

    const result: string = chunks.reverse().join(".");
    return result;
  }

  const openModalEdit = async () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn("Xin vui lòng chọn 1 sản phẩm để chỉnh sửa !");
    else {
      handleEditData(isSelectedItem[0]?.id);
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
          <Title order={5}>Xóa sản phẩm</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataItem(
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
          <Title order={5}>Chỉnh sửa sản phẩm</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataItem(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
          handleGoToEditAttribute={handleGoToEditAttribute}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataItem(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const fetDatabrand = async () => {
      const data = await getDataBrand();
      setDataBrand(data?.data?.lists);
    };
    fetDatabrand();
  }, []);

  useEffect(() => {
    if (dataBrand)
      setDataBrandOption(
        dataBrand.map((brand, index) => ({
          value: brand.id,
          label: brand.name,
        }))
      );
  }, [dataBrand]);

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
        isUpdateSearchItem={true}
      ></AppAction>
      <Divider my="sm" />
      <ProductListSearch
        loading={loading}
        onChangeSelectedSearch={onChangeSelectedSearch}
        selectedSearchOption={selectedSearchOption}
        onChangeText={onChangeText}
        onSearch={onSearch}
        dataBrandOption={dataBrandOption}
      />
      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={users ? users : []}
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
        sorting={sorting}
        onChange={onTableChange}
        compressed={true}
      />
    </>
  );
};

export default ProductList;
