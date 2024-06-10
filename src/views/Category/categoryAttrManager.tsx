import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiButtonIcon,
  EuiComboBox,
  EuiEmptyPrompt,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHealth,
  EuiHighlight,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlind,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconChevronDown,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import React, { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import Repository from "../../_base/helper/HttpHelper";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import { MessageResponse } from "../../model/MessageResponse";
import { API_ROUTE } from "../../const/apiRoute";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { TblCategoryAttributeModel } from "../../model/TblCategoryAttributeModel";
import EditView from "../Attribute/editView";
import { TblCategoryModel } from "../../model/TblCategoryModel";
import { GetAttrCategoryModel } from "../../model/GetAttrCategoryModel";
import ListAttrSelect from "./listAttrSelect";
import { DeleteCategoryAttrListCommand } from "../../model/DeleteCategoryAttrListCommand";
import UpdateOrderNumberAttrView from "./updateorderNumberAttrView";
import { EditStatusAttr, getListCategoryAttr } from "../../api/ApiMegaMenu";

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
const CategoryAttrManagerView = () => {
  const [catId, setCatId] = useState<number>(0);
  let params = useParams();
  const catIdGet = params.cat_id;
  const [category, setCategory] = useState<TblCategoryModel>();
  const [toltal, setTotal] = useState(0);
  const navigate = useNavigate();
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblCategoryAttributeModel[]>([]);
  const [isFrist, setIsFrist] = useState(true);
  const [numberOrder, setnumberOrder] = useState(0);
  const [message, setMessage] = useState<ReactNode>(
    <EuiEmptyPrompt
      title={<h3>Dữ liệu rỗng !</h3>}
      titleSize="xs"
      body="Tải lại dữ liệu nếu trường hợp bạn không thấy có dữ liệu hiển thị !"
    />
  );
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [options, setOptions] = useState(optionsStatic);
  const [selectedOptions, setSelected] = useState();
  const [selectedOptions1, setSelected1] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<
    TblCategoryAttributeModel[]
  >([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);

  const columns: Array<EuiBasicTableColumn<TblCategoryAttributeModel>> = [
    {
      field: "codeAttr",
      name: "Mã",
      sortable: true,
      dataType: "string",

      render: (categroyName: string) => (
        <EuiLink target="_blank" onClick={(e: any) => {}}>
          {categroyName}
        </EuiLink>
      ),
      mobileOptions: {
        render: (user: TblCategoryAttributeModel) => (
          <span>{user.codeAttr}</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "nameAttr",
      name: "Thuộc tính",
      sortable: true,
      dataType: "string",
      render: (categroyName: string) => <Text>{categroyName}</Text>,
      mobileOptions: {
        render: (user: TblCategoryAttributeModel) => (
          <span>{user.nameAttr}</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "",
      name: "Giá trị",
      sortable: true,
      align: "center",
      render: (id: TblCategoryAttributeModel) => (
        <>
          <EuiLink
            target="_blank"
            onClick={(e: any) => {
              modals.openConfirmModal({
                title: (
                  <>
                    <Title order={5}>Chỉnh sửa thuộc tính !</Title>
                  </>
                ),

                children: (
                  <EditView
                    onClose={handleDeleteViewClose}
                    load={deleteViewStatus}
                    id={id.attributeId ?? 0}
                  />
                ),
                confirmProps: { display: "none" },
                cancelProps: { display: "none" },
              });
            }}
          >
            Quản lý các giá trị
          </EuiLink>
          (Đang có: {id.count} giá trị)
        </>
      ),
      mobileOptions: {
        render: (user: TblCategoryAttributeModel) => (
          <span>(Đang có: {user.count} giá trị)</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "",
      name: "Thứ tự hiển thị trong danh mục",
      dataType: "string",
      render: (online: TblCategoryAttributeModel) => {
        const color = online?.orderNumber ?? 0 % 2 == 0 ? "success" : "danger";
        return (
          <EuiLink
            target="_blank"
            onClick={async (e: any) => {
              modals.openConfirmModal({
                title: (
                  <>
                    <div color="white">
                      <Title order={5}>Cập nhật STT !</Title>
                    </div>
                  </>
                ),
                children: (
                  <UpdateOrderNumberAttrView
                    onClose={handleDeleteViewClose}
                    load={deleteViewStatus}
                    id={online.id}
                    orderNumber={online.orderNumber ?? 0}
                    users={users}
                  />
                ),
                confirmProps: { display: "none" },
                cancelProps: { display: "none" },
              });
            }}
          >
            <EuiHealth color={color}>{online?.orderNumber}</EuiHealth>
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
      name: "Trạng thái",
      dataType: "string",
      render: (online: TblCategoryAttributeModel) => {
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
      render: (online: TblCategoryAttributeModel) => {
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

  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
  };
  useEffect(() => {
    if (catIdGet !== undefined && !isNaN(Number(catIdGet))) {
      setCatId(Number(catIdGet));
    } else {
      navigate(-1);
    }
    if (isFrist) {
      setIsFrist(false);
    }

    loadUsers(paramSearch?.keyWord);
  }, [deleteViewStatus]);

  const loadUsers = async (keyWord?: string) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setUsers([]);
    setError(undefined);

    try {
      let urlSearch = `?IdCategory=${catId == 0 ? Number(catIdGet) : catId}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      let callapi = await getListCategoryAttr(urlSearch);
      if (isNullOrUndefined(callapi)) {
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else if (callapi?.success == false) {
        NotificationExtension.Fails(callapi?.message ?? "");
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else {
        setUsers(callapi?.data.tblCategoryAttributeModels ?? []);
        if (callapi?.data.tblCategoryAttributeModels.length === 0)
          setMessage(noItemsFoundMsg);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.totalCount ?? 0,
        });
        setTotal(0);
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const statusActive = async (id: number) => {
    if (id < 1) NotificationExtension.Fails("Mã danh mục không tồn tại !");
    else {
      setLoading(true);

      try {
        let urlSearch = "?id=" + id;
        let callapi = await EditStatusAttr(urlSearch);
        close();
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await loadUsers(paramSearch?.keyWord);
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
  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblCategoryAttributeModel>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
  };
  const onSearch = async (event: any) => {
    await loadUsers(paramSearch?.keyWord);
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

  const onSelectionChange = (selectedItems: TblCategoryAttributeModel[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<TblCategoryAttributeModel> = {
    selectable: (user: TblCategoryAttributeModel) => true,
    onSelectionChange,
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm thuộc tính mới danh mục !</Title>
          </div>
        </>
      ),
      children: (
        <ListAttrSelect
          id={catId == 0 ? Number(catIdGet) : catId}
          onClose={handleDeleteViewClose}
          load={deleteViewStatus}
          ids={users.map((x) => x.attributeId ?? 0)}
        />
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

  const openModalDelete = async () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      await deleteItem(ids.map((item) => item.id));
    }
  };

  async function deleteItem(idItem: number[]) {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    let urlCreate = API_ROUTE.category_attr_delete;
    let model: DeleteCategoryAttrListCommand = {
      ids: idItem,
    };
    let callapi = await repository.post<MessageResponse<boolean>>(
      urlCreate,
      model
    );
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      NotificationExtension.Success("Xóa thành công !");
      setDeleteViewStatus(deleteViewStatus + 1);
    } else if (callapi != null)
      NotificationExtension.Fails(callapi.message ?? "Xóa thất bại !");
    close();
  }

  function editItem(idItem: number) {
    const id = idItem;
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa demo !</Title>
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

  return (
    <>
      <Box style={{ overflow: "hidden" }}>
        <Box mx="auto">
          <Group wrap="nowrap" justify="flex-end">
            <Button
              onClick={openModal}
              leftSection={<IconPlus size={14} />}
              color="blue"
              variant="outline"
            >
              Thêm thuộc tính cho danh mục
            </Button>
            <Button
              leftSection={<IconEdit size={14} />}
              onClick={() => {
                navigate("/attribute");
              }}
              color="orange"
              variant="outline"
            >
              Quản trị thuộc tính
            </Button>
            <Button
              leftSection={<IconTrash size={14} />}
              onClick={openModalDelete}
              color="red"
              variant="outline"
            >
              Xóa (Đã chọn)
            </Button>
          </Group>
        </Box>
      </Box>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Divider my="sm" />
      <EuiFlexGroup>
        <EuiFormRow label="Tìm kiếm :">
          <EuiFlexGroup alignItems="flexEnd">
            <EuiFlexItem grow={false}>
              <EuiFieldSearch
                placeholder="Tìm kiếm..."
                fullWidth
                aria-label="An example of search with fullWidth"
                onChange={onChangeText}
                disabled={loading}
                append={
                  <Menu
                    trigger="hover"
                    closeOnClickOutside={false}
                    shadow="md"
                    width={500}
                    openDelay={100}
                    closeDelay={300}
                  >
                    <Menu.Target>
                      <Tooltip label="Hiển thị tùy chọn tìm kiếm">
                        <IconChevronDown
                          className="Menu_IconChevronDown_Search"
                          width={35}
                          size={20}
                        />
                      </Tooltip>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Tùy chọn tìm kiếm</Menu.Label>
                      <Menu.Item closeMenuOnClick={false}>
                        <EuiFormRow label="Trạng thái: ">
                          <EuiComboBox
                            aria-label="Accessible screen reader label"
                            placeholder="Chọn..."
                            options={optionInactive}
                            selectedOptions={selectedOptions}
                            onChange={onChange}
                            fullWidth={true}
                            singleSelection={true}
                            isDisabled={loading}
                            isCaseSensitive
                          />
                        </EuiFormRow>
                      </Menu.Item>
                      <Menu.Item closeMenuOnClick={false}>
                        <EuiFormRow label="Tên: ">
                          <EuiComboBox
                            aria-label="Accessible screen reader label"
                            placeholder="Chọn..."
                            options={options}
                            selectedOptions={selectedOptions1}
                            onChange={onChange1}
                            fullWidth={true}
                            renderOption={renderOption}
                            isDisabled={loading}
                          />
                        </EuiFormRow>
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                }
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                isLoading={loading}
                iconType="lensApp"
                isDisabled={loading}
                onClick={onSearch}
              >
                Tìm kiếm
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFormRow>
      </EuiFlexGroup>

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
        isExpandable={true}
      />
    </>
  );
};

export default CategoryAttrManagerView;
