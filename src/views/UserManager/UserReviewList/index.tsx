import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiComboBox,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiHealth,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import {
  Box,
  Select,
  Menu,
  Button,
  Divider,
  CloseButton,
  Flex,
  Rating,
  Input,
  Text,
  TextInput,
  Textarea,
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
import {
  modifyDisableUserReview,
  modifyUserReview,
} from "../../../api/apiUserReview";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblUserReview } from "../../../model/TblUserReview";
import DeleteView from "./DeleteView";
import styles from "./UserReviewList.module.css";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const optionApproved = [
  {
    value: "0",
    label: "Chưa duyệt",
  },
  {
    value: "1",
    label: "Đã duyệt",
  },
];

const optionRating = [
  {
    value: "1",
    label: `1 sao`,
  },
  {
    value: "2",
    label: `2 sao`,
  },
  {
    value: "3",
    label: `3 sao`,
  },
  {
    value: "4",
    label: `4 sao`,
  },
  {
    value: "5",
    label: `5 sao`,
  },
];

const UserReviewList = () => {
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
      name: "Thông tin khách hàng",
      sortable: true,
      truncateText: true,
      render: (online: TblUserReview) => (
        <Box>
          <Text lineClamp={2}>
            <EuiLink
              style={{ fontSize: 16, fontWeight: 700 }}
              target="_blank"
              onClick={(e: any) => {
                handleEditData(online);
              }}
            >
              {online.userName}
            </EuiLink>
          </Text>

          <Text>{online.userEmail}</Text>
          <Text>{online.creationDate}</Text>
        </Box>
      ),
    },

    {
      field: "",
      name: "Nội dung",
      sortable: true,
      truncateText: true,
      width: "70%",
      render: (online: TblUserReview) => (
        <Box>
          <div className={styles.ctitle}>
            <span>{online.itemTitle}</span>
            <Rating defaultValue={online?.rate || 0} fractions={2} readOnly />
          </div>
          {selectedEdit === online ? (
            <Box>
              <TextInput
                label="Tiêu đề"
                value={selectedEditTitle || ""}
                onChange={(event) =>
                  setSelectedEditTitle(event.currentTarget.value)
                }
              />
              <Textarea
                mt={"sm"}
                label="Nội dung"
                value={selectedEditContent || ""}
                onChange={(event) =>
                  setSelectedEditContent(event.currentTarget.value)
                }
              />
              <Flex mt={"md"} gap={"sm"} mb={"sm"}>
                <Button onClick={handleUpdateReview}>Cập nhật</Button>
                <Button variant="default" onClick={() => setSelectedEdit(null)}>
                  Huỷ
                </Button>
              </Flex>
            </Box>
          ) : (
            <div className={styles.content}>{online.content}</div>
          )}
        </Box>
      ),
    },
    {
      field: "approved",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (approved: number, online: TblUserReview) => (
        <EuiLink
          // style={{ fontSize: 16, fontWeight: 700 }}
          target="_blank"
          onClick={(e: any) => {
            handleEditDisable(online.id);
          }}
        >
          <EuiHealth color={approved == 1 ? "green" : "danger"}>
            {approved == 1 ? "Đã duyệt" : "Chưa duyệt"}
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<TblUserReview[]>([]);
  const [total, setTotal] = useState(0);
  const [inputID, setInputID] = useState("");
  const [selectedApproved, setSelectedApproved] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [selectedEdit, setSelectedEdit] = useState<TblUserReview | null>(null);
  const [selectedEditTitle, setSelectedEditTitle] = useState<
    string | undefined
  >("");
  const [selectedEditContent, setSelectedEditContent] = useState<
    string | undefined
  >("");

  const handleEditData = async (data: TblUserReview) => {
    if (data) {
      editItem(data);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
  };

  const handleEditDisable = async (id: number) => {
    await modifyDisableUserReview(id);
    fetchDataUserReview(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const handleUpdateReview = async () => {
    const dataModify = {
      ...selectedEdit,
      title: selectedEditTitle,
      content: selectedEditContent,
    };
    await modifyUserReview(dataModify);
    fetchDataUserReview(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
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

  const onChangeApproved = (value: any) => {
    setSelectedApproved(value);
  };

  const onChangeRating = (value: any) => {
    setSelectedRating(value);
  };

  const handleChangeID = (selectedValue: any) => {
    setInputID(selectedValue.target.value);
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

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 danh mục bài viết để chỉnh sửa !"
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

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa đánh giá</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataUserReview(
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

  function editItem(data: TblUserReview) {
    setSelectedEdit(data);
    setSelectedEditTitle(data?.title || undefined);
    setSelectedEditContent(data?.content || undefined);
  }

  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Trạng thái">
        <Select
          placeholder={"Chọn trạng thái"}
          searchable
          defaultValue={selectedApproved}
          nothingFoundMessage="Không có dữ liệu"
          data={optionApproved}
          onChange={onChangeApproved}
          clearable
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Đánh giá">
        <Select
          placeholder={"Chọn số sao"}
          searchable
          defaultValue={selectedRating}
          nothingFoundMessage="Không có dữ liệu"
          data={optionRating}
          onChange={onChangeRating}
          clearable
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="ID sản phẩm">
        <Input
          placeholder={"Nhập ID sản phẩm"}
          value={inputID}
          onChange={handleChangeID}
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              onClick={() => setInputID("")}
              style={{ display: inputID ? undefined : "none" }}
            />
          }
        />
      </EuiFormRow>
    </Menu.Item>,
  ];

  const fetchDataUserReview = async (
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
      let urlSearch = `${API_ROUTE.GET_LIST_USER_REVIEW}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      if (!isNullOrUndefined(selectedApproved) && selectedApproved !== "")
        urlSearch = urlSearch + `&Approved=` + selectedApproved;
      if (!isNullOrUndefined(selectedRating) && selectedRating !== "")
        urlSearch = urlSearch + `&Rate=` + selectedRating;
      if (!isNullOrUndefined(inputID) && inputID !== "") {
        urlSearch = urlSearch + `&ItemId=${inputID}`;
      }
      let callapi = await repository.get<MessageResponse<any>>(urlSearch);
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
      await fetchDataUserReview(
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
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataUserReview(
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

export default UserReviewList;
