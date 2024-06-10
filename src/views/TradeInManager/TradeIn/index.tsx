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
import {
  Anchor,
  Box,
  Divider,
  List,
  Menu,
  NumberFormatter,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
// import CreateView from "./CreateView";
// import DeleteView from "./DeleteView";
// import EditView from "./EditView";
import { useNavigate } from "react-router-dom";
import { TblTradeInOrder, TradeInProductCat } from "../../../model/TblTradeIn";
import CreateView from "./CreateView";
import DeleteView from "./deleteView";
import EditView from "./EditView";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const TradeIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [datas, setDatas] = useState<TradeInProductCat[]>([]);
  const [total, setTotal] = useState(0);

  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới danh mục</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          onSearch={() => fetchDataTradeInProductCat()}
          dataParent={datas}
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
      NotificationExtension.Warn("Xin vui lòng chọn 1 đơn để chỉnh sửa !");
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

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa đơn</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() => fetchDataTradeInProductCat()}
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
          <Title order={5}>Chỉnh sửa đơn!</Title>
        </>
      ),
      children: (
        <EditView
          id={id}
          onSearch={() => fetchDataTradeInProductCat()}
          dataParent={datas}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
      // size: 1500,
    });
  }

  const renderTable = (
    data: TradeInProductCat[],
    level = 0,
    parentCount = ""
  ) => {
    // Hàm renderTable sẽ đệ quy để hiển thị dữ liệu
    return data.map((cat, index) => {
      // Tạo số thứ tự cho mục hiện tại
      const currentNumber = parentCount
        ? `${parentCount}.${index + 1}`
        : `${index + 1}`;

      // Tạo tiền tố mới cho mục con dựa trên số thứ tự của mục cha
      const newPrefix = `${currentNumber}.`;

      return (
        <React.Fragment key={cat?.id}>
          <Table.Tr>
            <Table.Td pl={level * 25}>
              {currentNumber}. {cat?.categoryName}
            </Table.Td>
            <Table.Td>
              {cat?.itemQuantity} Sp
              {" - "}
              <EuiLink
                target="_blank"
                onClick={() =>
                  navigate("/trade-in-product", {
                    state: { id: cat?.id, catName: cat.categoryName },
                  })
                }
              >
                Xem
              </EuiLink>
            </Table.Td>
            <Table.Td>
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
                        if (isNullOrUndefined(cat))
                          NotificationExtension.Warn(
                            "Xin vui lòng chọn dữ liệu !"
                          );
                        else {
                          editItem(cat.id);
                        }
                      }}
                    />
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButtonIcon
                      iconType="trash"
                      color="danger"
                      onClick={(e: any) => {
                        if (isNullOrUndefined(cat))
                          NotificationExtension.Warn(
                            "Xin vui lòng chọn dữ liệu !"
                          );
                        else {
                          deleteItem([cat.id]);
                        }
                      }}
                    />
                  </EuiFlexItem>
                </EuiFlexGroup>
              </>
            </Table.Td>
          </Table.Tr>
          {/* Gọi lại hàm renderTable nếu có dữ liệu con */}
          {cat?.tradeInProductCatChilds.length > 0 &&
            renderTable(cat?.tradeInProductCatChilds, level + 1, currentNumber)}
        </React.Fragment>
      );
    });
  };

  const handleGotoProduct = (id: number) => {};

  const fetchDataTradeInProductCat = async () => {
    setLoading(true);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `${API_ROUTE.GET_CAT_TRADE_IN_PRODUCT}`;

      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);
      if (callapi && callapi.data && callapi.data.length > 0) {
        setDatas(callapi?.data ?? []);
        setTotal(callapi?.data.length ?? 0);
      } else setDatas([]);
      return callapi;
    } catch (error: any) {
      setDatas([]);
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataTradeInProductCat();
    };
    fetchData();
  }, []);

  return (
    <>
      <AppAction
        openModal={openModal}
        // openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />

      <EuiSpacer size="l" />

      <Table horizontalSpacing="sm" striped highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nhóm</Table.Th>
            <Table.Th>Sản phẩm</Table.Th>
            <Table.Th>Sửa/ Cài đặt</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{renderTable(datas)}</Table.Tbody>
      </Table>
    </>
  );
};

export default TradeIn;
