import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
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
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
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
import { useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { EditCategoryAttrListCommand } from "../../model/EditCategoryAttrListCommand";
import { TblAttributeModel } from "../../model/TblAttributeModel";
import { EditCategoryAttr } from "../../api/ApiMegaMenu";

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
const ListAttrSelect = ({
  id,
  ids,
  onClose,
  load,
}: {
  id: number;
  ids: Array<number>;
  onClose: any;
  load: number;
}) => {
  const [catId, setCatId] = useState<number>(0);
  let params = useParams();
  const catIdGet = params.cat_id;
  const [category, setCategory] = useState<TblAttributeModel>();
  const [toltal, setTotal] = useState(0);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblAttributeModel[]>([]);
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
  const [isSelectedItem, setSelectedItems] = useState<TblAttributeModel[]>([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);

  const columns: Array<EuiBasicTableColumn<TblAttributeModel>> = [
    {
      field: "attributeCode",
      name: "Mã",
      sortable: true,
      dataType: "string",

      render: (categroyName: string) => (
        <EuiLink target="_blank" onClick={(e: any) => {}}>
          {categroyName}
        </EuiLink>
      ),
      mobileOptions: {
        render: (user: TblAttributeModel) => <span>{user.attributeCode}</span>,
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "attributeName",
      name: "Thuộc tính",
      sortable: true,
      dataType: "string",
      render: (categroyName: string) => <Text>{categroyName}</Text>,
      mobileOptions: {
        render: (user: TblAttributeModel) => <span>{user.attributeName}</span>,
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
      render: (id: TblAttributeModel) => (
        <Text>Có: {id.countAttr} giá trị</Text>
      ),
      mobileOptions: {
        render: (user: TblAttributeModel) => (
          <span>(Đang có: {user.countAttr} giá trị)</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      name: "Lựa chọn",
      align: "center",
      render: (online: TblAttributeModel) => {
        return (
          <>
            <EuiFlexGroup
              responsive={true}
              wrap={false}
              gutterSize="s"
              alignItems="center"
            >
              <EuiFlexItem grow={true}>
                <Button
                  onClick={async () => {
                    const idItem = [online.id];
                    if (idItem === undefined || idItem.length < 1)
                      NotificationExtension.Fails("Bạn chưa chọn thuộc tính !");
                    open();
                    const repository = new Repository(
                      process.env.REACT_APP_Demo_APP_API_URL
                    );

                    let model: EditCategoryAttrListCommand = {
                      id: id ?? 0,
                      attrs: idItem,
                    };
                    let callapi = await EditCategoryAttr(model);
                    if (!isNullOrUndefined(callapi) && callapi?.success) {
                      NotificationExtension.Success("Thao tác thành công !");
                      setUsers(users.filter((x) => x.id !== online.id));
                      console.log(users);
                      if (users === undefined || users.length < 1)
                        modals.closeAll();
                    } else
                      NotificationExtension.Fails(
                        callapi?.message ?? "Thao tác thất bại !"
                      );
                    close();
                  }}
                  leftSection={<IconPlus size={14} />}
                  color="blue"
                  variant="subtle"
                >
                  Thêm thuộc tính
                </Button>
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
    console.log(ids);
    if (isFrist) {
      setIsFrist(false);
    }

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
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = API_ROUTE.category_attr_select + `?IdCategory=${id}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      let callapi = await repository.get<MessageResponse<TblAttributeModel[]>>(
        urlSearch
      );
      if (isNullOrUndefined(callapi)) {
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else if (callapi?.success == false) {
        NotificationExtension.Fails(callapi?.message ?? "");
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else {
        if (callapi?.data.length == 0) setUsers([]);
        else if (ids.length == 0) setUsers(callapi?.data ?? []);
        else {
          setUsers(callapi?.data.filter((x) => !ids.includes(x.id)) ?? []);
        }
        if (callapi?.data.length === 0) setMessage(noItemsFoundMsg);
        setPagination({
          ...pagination,
          totalItemCount: 0,
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

  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblAttributeModel>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
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

  const onSelectionChange = (selectedItems: TblAttributeModel[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<TblAttributeModel> = {
    selectable: (user: TblAttributeModel) => true,
    onSelectionChange,
  };

  const openModal = async () => {
    const ids = isSelectedItem;
    if (ids !== undefined && ids.length > 0) {
      await editItem(ids.map((x) => x.id));
    } else NotificationExtension.Fails("Bạn chưa chọn thuộc tính !");
  };

  async function editItem(idItem: number[]) {
    if (id === undefined || id == 0)
      NotificationExtension.Fails("Danh mục không tồn tại !");
    if (idItem === undefined || idItem.length < 1)
      NotificationExtension.Fails("Bạn chưa chọn thuộc tính !");
    open();

    let model: EditCategoryAttrListCommand = {
      id: id ?? 0,
      attrs: idItem,
    };
    let callapi = await EditCategoryAttr(model);
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      NotificationExtension.Success("Thao tác thành công !");
      modals.closeAll();
      onClose(load + 1);
    } else
      NotificationExtension.Fails(callapi?.message ?? "Thao tác thất bại !");
    close();
  }

  return (
    <>
      <Box style={{ overflow: "hidden" }}>
        <Box mx="auto" mt={"xs"}>
          <Group wrap="nowrap" justify="flex-end">
            <Button
              onClick={openModal}
              leftSection={<IconPlus size={14} />}
              color="blue"
              variant="outline"
            >
              Thêm thuộc tính cho danh mục
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

export default ListAttrSelect;
