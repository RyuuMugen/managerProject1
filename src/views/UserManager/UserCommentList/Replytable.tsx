import React, { useState } from "react";
import {
  EuiBasicTable,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLink,
} from "@elastic/eui";
import { Button, Modal, Title, Flex, Box, Text } from "@mantine/core";
import { IconCheck, IconX, IconTrash } from "@tabler/icons-react";
import { tblUserCommentReply } from "../../../model/TblUserComment";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { deleteUserCommentReply } from "../../../api/ApiUserComment";

interface Props {
  replies: tblUserCommentReply[];
  handleEditReplyDisable: (id: number) => Promise<void>;
  onSearch: Function;
}

const ReplyTable: React.FC<Props> = ({
  replies,
  handleEditReplyDisable,
  onSearch,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReply, setSelectedReply] =
    useState<tblUserCommentReply | null>(null);

  const columns = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "",
      name: "Khách hàng",
      render: (online: tblUserCommentReply) => (
        <Box>
          <Text style={{ fontSize: 15 }} fw={700}>
            {online.userName}
          </Text>
          <Text>{online.userEmail}</Text>
          <Text>{online.creationDate}</Text>
        </Box>
      ),
    },
    {
      field: "",
      name: "Nội dung",
      width: "60%",
      render: (online: tblUserCommentReply) => <Text>{online.content}</Text>,
    },
    {
      field: "approved",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      render: (approved: string, online: tblUserCommentReply) => (
        <EuiLink
          // style={{ fontSize: 16, fontWeight: 700 }}
          target="_blank"
          onClick={(e: any) => {
            handleEditReplyDisable(online.id);
          }}
        >
          <EuiHealth color={approved == "1" ? "green" : "danger"}>
            {approved == "1" ? "Đã duyệt" : "Chưa duyệt"}
          </EuiHealth>
        </EuiLink>
      ),
    },
    {
      field: "",
      width: "5%",
      name: "Lựa chọn",
      render: (online: tblUserCommentReply) => (
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
                    deleteItem(online);
                  }
                }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </>
      ),
    },
  ];
  const deleteItem = (reply: tblUserCommentReply) => {
    setSelectedReply(reply);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    if (selectedReply) {
      await deleteUserCommentReply([selectedReply.id]);
      setShowDeleteModal(false);
      setSelectedReply(null);
      onSearch();
    }
  };
  return (
    <div
      style={{
        marginTop: "10px",
        marginBottom: "10px",
        border: "1px solid #e5e5e5",
      }}
    >
      <EuiBasicTable
        items={replies || []}
        columns={columns}
        style={{ width: "100%" }}
      />
      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={<Title order={5}>Xác nhận xóa</Title>}
      >
        <p style={{ fontSize: "24px", paddingBottom: "20px" }}>
          Bạn có chắc chắn muốn xóa phản hồi này không?
        </p>
        <Flex justify="center">
          <Button
            onClick={handleDeleteConfirm}
            leftSection={<IconCheck size={18} />}
          >
            Xóa
          </Button>
          <Button
            style={{ marginLeft: "15px" }}
            onClick={() => setShowDeleteModal(false)}
            leftSection={<IconX size={18} />}
          >
            Hủy
          </Button>
        </Flex>
      </Modal>
    </div>
  );
};

export default ReplyTable;
