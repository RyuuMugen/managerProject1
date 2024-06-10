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
  Menu,
  Text,
  Title,
  Tooltip,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArrowsLeftRight,
  IconChevronDown,
  IconDotsVertical,
  IconEdit,
  IconMessageCircle,
  IconPhoto,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import React, { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import { datavisibleType } from "../../_data-fix/datavisibleType";
import { getDataMegaMenu } from "../../api/ApiMegaMenu";
import { TblCategoryModel } from "../../model/TblCategoryModel";
import CreateView from "./CreateView/createView";
import EditView from "./EditView/editView";
import DeleteView from "./deleteView";

const userData: TblCategoryModel[] = [];

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
const HomeView1 = () => {
  const [toltal, setTotal] = useState(0);

  const columns: Array<EuiBasicTableColumn<TblCategoryModel>> = [
    {
      field: "categoryName",
      name: "Danh mục",
      width: "15%",
      footer: <em>Page totals: {toltal}</em>,
      sortable: true,
      truncateText: true,
      render: (categroyName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
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
      width: "10%",
      sortable: true,
      truncateText: true,
      render: (categroyName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            console.log(e);
          }}
        >
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
      field: "categroyName",
      name: "Nội dung nổi bật",
      width: "10%",
      sortable: true,
      truncateText: true,
      render: (categroyName: string) => (
        <EuiLink
          target="_blank"
          onClick={(e: any) => {
            console.log(e);
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
      field: "id",
      name: "Nổi bật",
      dataType: "boolean",
      width: "8%",
      render: (online: TblCategoryModel["id"]) => {
        return (
          <EuiLink
            target="_blank"
            onClick={(e: any) => {
              console.log(e);
            }}
          >
            Hạ nổi bật
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
      width: "5%",
      sortable: true,
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
      field: "view",
      name: "View",
      width: "5%",
      dataType: "boolean",
      render: (u: number) => <Text>12345</Text>,
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "itemCount",
      name: "SP",
      dataType: "auto",
      width: "5%",
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
      field: "orderedNumber",
      name: "STT",
      width: "5%",
      render: (online: TblCategoryModel["orderedNumber"]) => {
        return <Text>{online}</Text>;
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
      dataType: "boolean",
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
      field: "itemCount",
      width: "6%",
      name: "Thuộc tính",
      dataType: "string",
      render: (online: TblCategoryModel["itemCount"]) => {
        return (
          <Text>
            <EuiLink
              target="_blank"
              onClick={(e: any) => {
                console.log(e);
              }}
            >
              Tổng
            </EuiLink>{" "}
            ({online})
          </Text>
        );
      },
      sortable: true,
      mobileOptions: {
        show: false,
      },
    },
    {
      field: "orderedNumber",
      name: "Trạng thái",
      width: "8%",
      dataType: "string",
      render: (online: TblCategoryModel["orderedNumber"]) => {
        const color = online ? "success" : "danger";
        const label = online ? "Kích hoạt" : "Chưa kích hoạt";
        return (
          <EuiLink
            target="_blank"
            onClick={(e: any) => {
              console.log(e);
            }}
          >
            <EuiHealth color={color}>{label}</EuiHealth>
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
      width: "8%",
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
  ];

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblCategoryModel[]>([]);
  const [isFrist, setIsFrist] = useState(true);
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

  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
  };
  useEffect(() => {
    if (isFrist) setIsFrist(false);
    else
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
  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblCategoryModel>) => {
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

  const onSelectionChange = (selectedItems: TblCategoryModel[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<TblCategoryModel> = {
    selectable: (user: TblCategoryModel) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
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
              Thêm mới
            </Button>
            <Button
              leftSection={<IconEdit size={14} />}
              onClick={openModalEdit}
              color="orange"
              variant="outline"
            >
              Chỉnh sửa
            </Button>
            <Button
              leftSection={<IconTrash size={14} />}
              onClick={openModalDelete}
              color="red"
              variant="outline"
            >
              Xóa (Đã chọn)
            </Button>
            <Menu shadow="md" trigger="hover" openDelay={100} closeDelay={200}>
              <Menu.Target>
                <Button
                  rightSection={<IconChevronDown size={14} />}
                  leftSection={<IconDotsVertical size={14} />}
                  color="violet"
                  variant="outline"
                >
                  Thao tác khác
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Ứng dụng</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Quản lý thuộc tính sản phẩm
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconMessageCircle
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Messages
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconPhoto style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Gallery
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSearch style={{ width: rem(14), height: rem(14) }} />
                  }
                  rightSection={
                    <Text size="xs" c="dimmed">
                      ⌘K
                    </Text>
                  }
                >
                  Search
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconArrowsLeftRight
                      style={{ width: rem(14), height: rem(14) }}
                    />
                  }
                >
                  Transfer my data
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                >
                  Delete my account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Box>
      </Box>
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
      />
    </>
  );
};

export default HomeView1;
