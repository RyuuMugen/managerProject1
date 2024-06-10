import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiEmptyPrompt,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiHighlight,
  EuiSpacer,
  EuiTableFieldDataColumnType,
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
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import DeleteView from "./deleteView";
import EditView from "./editView";
import { useDisclosure } from "@mantine/hooks";
import { TblAttributeValueCommand } from "../../model/TblAttributeValueCommand";
import {
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import CreateAttValueView from "./createAttValue";

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
const TblAttributeValueCommandView = ({
  data,
}: {
  data: TblAttributeValueCommand[];
}) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblAttributeValueCommand[]>(data);
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
    TblAttributeValueCommand[]
  >([]);
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);

  const columns: Array<EuiBasicTableColumn<TblAttributeValueCommand>> = [
    {
      field: "id",
      name: "ID",
      width: "10%",
      sortable: true,
      dataType: "string",
      render: (categroyName: string) => <Text>{categroyName}</Text>,
      mobileOptions: {
        render: (user: TblAttributeValueCommand) => <span>{user.id}</span>,
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "value",
      name: "Giá trị",
      width: "20%",
      sortable: true,
      dataType: "string",
      render: (categroyName: string) => <Text>{categroyName}</Text>,
      mobileOptions: {
        render: (user: TblAttributeValueCommand) => <span>{user.value}</span>,
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "description",
      name: "Mô tả",
      width: "10%",
      sortable: true,
      align: "center",
      render: (id: string) => <Text>{id}</Text>,
      mobileOptions: {
        render: (user: TblAttributeValueCommand) => (
          <span>{user.description}</span>
        ),
        header: false,
        truncateText: false,
        enlarge: true,
        width: "100%",
      },
    },
    {
      field: "orderNumber",
      name: "Thứ tự hiển thị",
      width: "6%",
      render: (online: TblAttributeValueCommand) => {
        return (
          <Text>
            <EuiHealth color="primary"> {online.orderNumber} </EuiHealth>
          </Text>
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
      render: (online: TblAttributeValueCommand) => {
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

  const getRowProps = (user: TblAttributeValueCommand) => {
    const { id } = user;
    return {
      "data-test-subj": `row-${id}`,
      className: "customRowClass",
      onClick: (e: any) => {
        {

        }
      },
    };
  };

  const getCellProps = (
    user: TblAttributeValueCommand,
    column: EuiTableFieldDataColumnType<TblAttributeValueCommand>
  ) => {
    const { id } = user;
    const { field } = column;
    return {
      className: "customCellClass",
      "data-test-subj": `cell-${id}-${String(field)}`,
      textOnly: true,
    };
  };

  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
  };
  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblAttributeValueCommand>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
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
  useEffect(() => {}, []);
  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới giá trị !</Title>
          </div>
        </>
      ),
      children: <CreateAttValueView data={data} />,
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
          </Group>
        </Box>
      </Box>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Divider my="sm" />
      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={users}
        itemId="id"
        error={error}
        loading={loading}
        noItemsMessage={isNullOrUndefinedArry(users) ? message : ""}
        columns={columns}
        pagination={pagination}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        onChange={onTableChange}
        compressed={true}
        rowProps={getRowProps}
        cellProps={getCellProps}
      />
    </>
  );
};

export default TblAttributeValueCommandView;
