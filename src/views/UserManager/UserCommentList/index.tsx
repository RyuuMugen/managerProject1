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
  Button,
  Divider,
  Input,
  Flex,
  CloseButton,
  Text,
  TextInput,
  Select,
  Textarea,
  Title,
  Menu,
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
  createUserCommentReply,
  modifyDisableUserComment,
  modifyDisableUserCommentReply,
  modifyUserComment,
} from "../../../api/ApiUserComment";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblUserComment } from "../../../model/TblUserComment";
import DeleteView from "./DeleteView";
import ReplyTable from "./Replytable";
import styles from "./UserCommentList.module.css";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const optionType = [
  {
    value: "product",
    label: "Sản phẩm",
  },
  {
    value: "article",
    label: "Bài viết",
  },
];

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
const UserCommentList = () => {
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
      render: (online: TblUserComment) => (
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
      render: (online: TblUserComment) => (
        <Box>
          <div className={styles.ctitle}>
            <span>{online.itemTitle}</span>
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
                <Button onClick={handleUpdateComment}>Cập nhật</Button>
                <Button variant="default" onClick={() => setSelectedEdit(null)}>
                  Huỷ
                </Button>
              </Flex>
            </Box>
          ) : (
            <div className={styles.content}>{online.content}</div>
          )}

          <span className={styles.btext2}>
            Phản hồi: {online.replyCount || 0} -
            <span
              className={styles.addreply}
              onClick={() => setSelectedReplyId(online.id)}
            >
              {" "}
              Thêm phản hồi
            </span>
          </span>
          {selectedReplyId === online.id && (
            <Box>
              <Textarea
                mt={"sm"}
                label="Nội dung trả lời"
                value={selectedReplyIdContent || ""}
                onChange={(event) =>
                  setSelectedReplyIdContent(event.currentTarget.value)
                }
              />
              <Flex mt={"md"} gap={"sm"} mb={"sm"}>
                <Button onClick={handleCreateReply}>Gửi</Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setSelectedReplyId(null);
                    setSelectedReplyIdContent("");
                  }}
                >
                  Huỷ
                </Button>
              </Flex>
            </Box>
          )}

          {online.tblUserCommentReplyModels &&
            online.tblUserCommentReplyModels.length > 0 && (
              <div>
                <ReplyTable
                  replies={online.tblUserCommentReplyModels}
                  handleEditReplyDisable={handleEditReplyDisable}
                  onSearch={() =>
                    fetchDataUserComment(
                      pagination.pageIndex,
                      pagination.pageSize,
                      paramSearch?.keyWord,
                      paramSearch?.inActive
                    )
                  }
                />
              </div>
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
      render: (approved: string, online: TblUserComment) => (
        <EuiLink
          // style={{ fontSize: 16, fontWeight: 700 }}
          target="_blank"
          onClick={(e: any) => {
            handleEditDisable(online.id);
          }}
        >
          <EuiHealth color={approved == "1" ? "green" : "danger"}>
            {approved == "1" ? "Đã duyệt" : "Chưa duyệt"}
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<TblUserComment[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedType, setSelectedType] = useState("");
  const [inputID, setInputID] = useState("");
  const [selectedApproved, setSelectedApproved] = useState("");
  const [selectedActive, setSelectedActive] = useState<any[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<TblUserComment | null>(null);
  const [selectedEditTitle, setSelectedEditTitle] = useState<
    string | undefined
  >("");
  const [selectedEditContent, setSelectedEditContent] = useState<
    string | undefined
  >("");
  const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
  const [selectedReplyIdContent, setSelectedReplyIdContent] = useState<
    string | undefined
  >("");

  const handleEditData = async (data: TblUserComment) => {
    if (data) {
      editItem(data);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
  };

  const handleEditDisable = async (id: number) => {
    await modifyDisableUserComment(id);
    fetchDataUserComment(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const handleEditReplyDisable = async (id: number) => {
    await modifyDisableUserCommentReply(id);
    fetchDataUserComment(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const handleUpdateComment = async () => {
    const dataModify = {
      ...selectedEdit,
      title: selectedEditTitle,
      content: selectedEditContent,
    };
    await modifyUserComment(dataModify);
    fetchDataUserComment(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const handleCreateReply = async () => {
    const data = {
      id: 0,
      commentId: selectedReplyId,
      isUserAdmin: null,
      userId: null,
      userEmail: "userEmail@gmail.com",
      userName: "userName",
      userAvatar: null,
      userNote: null,
      rate: null,
      title: null,
      content: selectedReplyIdContent,
      files: null,
      approved: 0,
      postTime: null,
      ipAddress: null,
      orderNumber: null,
      isFeatured: null,
      peopleIdVote: null,
      peopleLikeCount: null,
      peopleDislikeCount: null,
      creationDate: null,
      createdBy: null,
      lastUpdateDate: null,
      lastUpdateBy: null,
    };

    await createUserCommentReply(data);
    fetchDataUserComment(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
    setSelectedReplyId(null);
    setSelectedReplyIdContent("");
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

  const onChangeType = (value: any) => {
    setSelectedType(value);
  };

  const onChangeApproved = (value: any) => {
    setSelectedApproved(value);
  };

  const handleChangeID = (selectedValue: any) => {
    setInputID(selectedValue.target.value);
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
          <Title order={5}>Xóa bình luận</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataUserComment(
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

  function editItem(data: TblUserComment) {
    setSelectedEdit(data);
    setSelectedEditTitle(data?.title || undefined);
    setSelectedEditContent(data?.content || undefined);
  }
  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Thể loại">
        <Select
          placeholder={"Chọn thể loại"}
          searchable
          defaultValue={selectedType}
          nothingFoundMessage="Không có dữ liệu"
          data={optionType}
          onChange={onChangeType}
          clearable
        />
      </EuiFormRow>
    </Menu.Item>,
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

  const fetchDataUserComment = async (
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
      let urlSearch = `${API_ROUTE.GET_LIST_USER_COMMENT}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(selectedType) && selectedType !== "")
        urlSearch = urlSearch + `&ItemType=` + selectedType;
      if (!isNullOrUndefined(selectedApproved) && selectedApproved !== "")
        urlSearch = urlSearch + `&Approved=` + selectedApproved;
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
      await fetchDataUserComment(
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
          fetchDataUserComment(
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

export default UserCommentList;
