import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Table, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import Repository from "../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../model/MessageResponse";
import { API_ROUTE } from "../../../const/apiRoute";
import { TblPaymentMethod } from "../../../model/TblPaymentMethod";
import moment from "moment";

const BehavioralStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);

  const [data, setdata] = useState<any>();
  const [message, setMessage] = useState<ReactNode>();
  const fetchDataLoggingAction = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setdata([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Auth_APP_API_URL);
    try {
      let urlSearch = `${API_ROUTE.GET_LOGGING_ACTION}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;

      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);

      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage("Không có dữ liệu");
      } else {
        setdata(callapi?.data ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.totalCount ?? 0,
        });
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  const [isFrist, setIsFrist] = useState(true);

  useEffect(() => {
    if (isFrist) setIsFrist(false);

    const fetchData = async () => {
      await fetchDataLoggingAction(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, deleteViewStatus]);

  return (
    <>
      <AppAction></AppAction>
      <Divider my="sm" />
      {/* <AppSearch
        loading={loading}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataLoggingAction(
            pagination.pageIndex,
            pagination.pageSize,
            paramSearch?.keyWord,
            paramSearch?.inActive
          )
        }
      /> */}
      <EuiSpacer size="l" />

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Hành vi</Table.Th>
            <Table.Th>Số lượt</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Số lượng sản phẩm được xem</Table.Td>
            <Table.Td>{data?.viewedProductCount}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Số lượng sản phẩm thêm vào giỏ</Table.Td>
            <Table.Td>{data?.addedToCartProductCount}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Số lượng sản phẩm bỏ khỏi giỏ</Table.Td>
            <Table.Td>{data?.removedFromCartProductCount}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Số lượng click sản phẩm tương tự</Table.Td>
            <Table.Td>{data?.similarProductClickEventCount}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Số lượng click sản phẩm comboSet</Table.Td>
            <Table.Td>{data?.comboSetProductLinkCount}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>
              Số lượng click xem thêm khuyến mãi/ưu đãi sản phẩm
            </Table.Td>
            <Table.Td>{data?.moreInfoGiftPromoLinkCount}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </>
  );
};

export default BehavioralStatistics;
