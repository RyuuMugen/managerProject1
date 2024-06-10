import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTableSelectionType,
  Pagination,
  EuiLink,
} from "@elastic/eui";
import { Title, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import { TblCollection } from "../../../model/TblComboSetCollection";
import { useNavigate } from "react-router";
import DeleteView from "./DeleteView";
import EditView from "./EditView";

const CollectionChild = ({ data, onSearch }: ViewCollectionChild) => {
  const columns: Array<EuiBasicTableColumn<TblCollection>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "10%",
    },

    {
      field: "title",
      name: "Tên bộ sưu tập con",
      sortable: true,
      truncateText: true,
    },

    {
      name: "Số sản phẩm",
      width: "25%",
      render: (item: TblCollection) => {
        return (
          <>
            {item.tblComboSetCollectionModels.length > 0 ? (
              <Text>Bộ sưu tập mẹ</Text>
            ) : (
              <Text>
                {item.productCount || 0} sp ( <EuiLink
                  target="_blank"
                  onClick={() =>
                    navigate("/product-collection", { state: { id: item.id } })
                  }
                >
                  Xem sản phẩm
                </EuiLink> ) 
              </Text>
            )}
          </>
        );
      },
    },
    {
      name: "Sửa",
      width: "10%",
      render: (item: TblCollection) => {
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
                    if (isNullOrUndefined(item))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      editItem(item.id);
                    }
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(item))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteItem([item.id]);
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

  const [datas, setDatas] = useState<TblCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [error, setError] = useState<string | undefined>();
  const [total, setTotal] = useState(0);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const navigate = useNavigate();
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

  const onSelectionChange = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
  };

  const selection: EuiTableSelectionType<any> = {
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa bộ sưu tập</Title>
        </>
      ),
      children: <DeleteView onSearch={() => onSearch()} idItem={idItem} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  function editItem(id: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa bộ sưu tập!</Title>
        </>
      ),

      children: <EditView id={id} onSearch={() => onSearch()} />,
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  return (
    <>
      <EuiBasicTable
        border={1}
        tableCaption="Demo of EuiDataGrid with selection"
        items={data ? data : []}
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

type ViewCollectionChild = {
  data: TblCollection[];
  onSearch: () => void;
};

export default CollectionChild;
