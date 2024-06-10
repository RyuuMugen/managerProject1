import {
  Box,
  Flex,
  LoadingOverlay,
  NumberFormatter,
  Table,
  Text,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { getDataSaleOrderStatus } from "../../../../api/ApiOrderStatus";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblOrderStatus } from "../../../../model/TblOrderStatus";
import {
  tblSaleOrder,
  tblSaleOrderDetailCommands,
} from "../../../../model/TblSaleOrder";
import {
  tblProvince,
  tblDistrict,
  tblCommune,
} from "../../../../model/TblAddress";
import { TblPaymentMethod } from "../../../../model/TblPaymentMethod";
import style from "./Orderview.module.css";

import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiImage,
  EuiLink,
} from "@elastic/eui";

const columnsStatus: Array<EuiBasicTableColumn<any>> = [
  {
    field: "id",
    name: "Id",
    sortable: true,
    truncateText: true,
    width: "4%",
  },
  {
    field: "status",
    name: "Trạng thái",
    sortable: true,
    truncateText: true,
    width: "18%",
    render: (status: any) => {
      if (status === null) {
        return <>NEW</>; // Hiển thị "NEW" nếu status là null
      }
      return <>{status}</>;
    },
  },
  {
    field: "description",
    name: "Ghi chú",
    sortable: true,
    truncateText: true,
  },
  {
    field: "assignName",
    name: "Người phụ trách",
    sortable: true,
    truncateText: true,
    width: "18%",
  },
  {
    field: "createdBy",
    name: "Người cập nhật",
    sortable: true,
    truncateText: true,
    width: "18%",
  },
  {
    field: "assignDate",
    name: "Ngày cập nhật",
    sortable: true,
    truncateText: true,
    width: "15%",
  },
];

const EditView = ({ onSearch, id }: any) => {
  let sttCounter = 0;
  const columnsProduct: Array<EuiBasicTableColumn<any>> = [
    {
      field: "",
      name: "STT",
      sortable: true,
      truncateText: true,
      width: "3%",
      render: () => {
        sttCounter++;
        return sttCounter.toString();
      },
    },
    {
      field: "itemImage",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (image: string | null) => {
        return image === null ? null : (
          <EuiImage width={60} height={100} src={image} alt="file" />
        );
      },
    },
    {
      field: "itemCode",
      name: "Mã kho hàng",
      sortable: true,
      truncateText: true,
      width: "10%",
    },

    {
      field: "itemName",
      name: "Tên sản phẩm",
      sortable: true,
      truncateText: true,
      width: "35%",
      render: (itemName: string, online: tblSaleOrderDetailCommands) => (
        <Box>
          <EuiLink
            style={{ fontSize: 14 }}
            href={`${process.env.REACT_APP_BASE_WEB_HACOM_URL}/product-detail/${online.itemUrl}`}
            target="_blank"
          >
            {itemName}
          </EuiLink>
          {online.promotion && (
            <Box>
              <Text fw={600} mt={3}>
                Khuyến mãi:
              </Text>
              {/* <Text lineClamp={4}>{online.promotion}</Text> */}
              <Text
                mt={-10}
                dangerouslySetInnerHTML={{ __html: online.promotion }}
              />
            </Box>
          )}
        </Box>
      ),
    },

    {
      field: "itemPrice",
      name: "Giá bán",
      sortable: true,
      truncateText: true,
      width: "12%",
      render: (price: number) => (
        <NumberFormatter value={price || 0} thousandSeparator suffix=" VND" />
      ),
    },
    {
      field: "quantity",
      name: "Số lượng",
      sortable: true,
      truncateText: true,
      width: "8%",
    },
    {
      field: "totalAmount",
      name: "Tổng",
      sortable: true,
      truncateText: true,
      width: "12%",
      render: (price: number, online: tblSaleOrderDetailCommands) => (
        <NumberFormatter
          value={price || (online.itemPrice || 0) * (online.quantity || 0) || 0}
          thousandSeparator
          suffix=" VND"
        />
      ),
    },
    {
      field: "description",
      name: "Ghi chú",
      sortable: true,
      truncateText: true,
    },
  ];

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataOrderDetail, setDataOrderDetail] = useState<tblSaleOrder>();
  const [total, setTotal] = useState(0);
  const [dataSaleOrderStatus, setDataSaleOrderStatus] = useState<
    TblOrderStatus[]
  >([]);

  const [dataOptionSaleOrderStatus, setDataOptionSaleOrderStatus] =
    useState<any>([]);
  const [dataProvice, setDataProvice] = useState<tblProvince>();
  const [dataDistrict, setDataDistrict] = useState<tblDistrict>();
  const [dataCommune, setDataCommune] = useState<tblCommune>();
  const [dataPaymentMethod, setDataPaymentMethod] =
    useState<TblPaymentMethod>();
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const repository2 = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
  const form = useForm<tblSaleOrder>();
  const formatDate = (datetime: any) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };
  const callApiGetDataProvince = async (idProvince: any) => {
    open();
    let urlCreate = API_ROUTE.DETAIL_PROVINCE + idProvince;
    let callapi = await repository.post<MessageResponse<tblProvince>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setDataProvice(dataApi);
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };
  const callApiGetDataDistrict = async (idDistrict: any) => {
    open();
    let urlCreate = API_ROUTE.DETAIL_DISTRICT + idDistrict;
    let callapi = await repository.post<MessageResponse<tblDistrict>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setDataDistrict(dataApi);
      }

      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };
  const callApiGetDataCommune = async (idCommune: any) => {
    open();
    let urlCreate = API_ROUTE.DETAIL_COMMUNE + idCommune;
    let callapi = await repository.post<MessageResponse<tblCommune>>(urlCreate);
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setDataCommune(dataApi);
      }

      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  const callApiGetData = async () => {
    open();
    let urlCreate = API_ROUTE.DETAIL_SALE_ORDER + id;
    let callapi = await repository2.post<MessageResponse<tblSaleOrder>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setDataOrderDetail({
          tblSaleOrderCommand: dataApi?.lsTblSaleOrderModel!,
          tblSaleOrderDetailCommands: dataApi?.lsTblSaleOrderDetailModel || [],
          tblSaleOrderHisCommands: dataApi?.tblSaleOrderHisModels || [],
        });
        form.setValues({
          tblSaleOrderCommand: dataApi?.lsTblSaleOrderModel!,
          tblSaleOrderDetailCommands: dataApi?.lsTblSaleOrderDetailModel || [],
          tblSaleOrderHisCommands: dataApi?.tblSaleOrderHisModels || [],
        });
        dataApi.lsTblSaleOrderModel?.provinceId &&
          callApiGetDataProvince(dataApi.lsTblSaleOrderModel?.provinceId);
        dataApi.lsTblSaleOrderModel?.districtId &&
          callApiGetDataDistrict(dataApi.lsTblSaleOrderModel?.districtId);
        dataApi.lsTblSaleOrderModel?.communeId &&
          callApiGetDataCommune(dataApi.lsTblSaleOrderModel?.communeId);
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  const shippingMethods: { [key: number]: string } = {
    0: "Giao hàng tiêu chuẩn (hacom vận chuyển)",
    1: "Giao hàng tiết kiệm",
    2: "Nhật tín logistic",
    // Các phương thức giao hàng khác nếu có
  };

  useEffect(() => {
    if (id) {
      callApiGetData();
    }
  }, [id]);

  useEffect(() => {
    const total = (
      (form.values
        .tblSaleOrderDetailCommands as tblSaleOrderDetailCommands[]) || []
    ).reduce((acc: number, item: tblSaleOrderDetailCommands) => {
      return (
        acc +
        (item.totalAmount || (item.itemPrice || 0) * (item.quantity || 0) || 0)
      );
    }, 0);
    setTotal(total);
  }, [form.values.tblSaleOrderDetailCommands, form.values.lsTblSaleOrderModel]);

  useEffect(() => {
    const loadDataSaleOrderStatus = async () => {
      setDataSaleOrderStatus([]);
      const data = await getDataSaleOrderStatus("Active=true&Skip=0&Take=1000");
      setDataSaleOrderStatus(data?.data.lists);
    };
    loadDataSaleOrderStatus();
  }, []);

  useEffect(() => {
    if (dataSaleOrderStatus) {
      setDataOptionSaleOrderStatus(
        dataSaleOrderStatus.map((option) => {
          return {
            value: option?.status,
            label: option?.status,
          };
        })
      );
    }
  }, [dataSaleOrderStatus]);

  return (
    <div>
      <Box className="flex-none" miw={1300} maw={1300} mx="auto">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Text className={style.titleH1}>
          1. Thời gian: {formatDate(form.values.tblSaleOrderCommand?.orderDate)}
        </Text>
        <Text className={style.titleH1}>2. Thông tin người mua</Text>
        <Space h="sm" />
        <Box>
          <Text fw={700}>Thông tin đặt hàng:</Text>
          <Flex gap={3}>
            <Box>
              <Text>Họ tên</Text>
              <Text>Email</Text>
              <Text>Địa chỉ</Text>
              <Text>Điện thoại</Text>
              <Text>Tên công ty</Text>
              <Text>Địa chỉ công ty </Text>
              <Text>Mã số thuế</Text>
            </Box>
            <Box>
              <Text>: {form.values.tblSaleOrderCommand?.buyerName}</Text>
              <Text>: {form.values.tblSaleOrderCommand?.buyerEmail}</Text>
              <Text>
                : {form.values.tblSaleOrderCommand?.shippingAddress} ,{" "}
                {dataCommune?.communeName}, {dataDistrict?.districtName},{" "}
                {dataProvice?.provinceName}
              </Text>
              <Text>: {form.values.tblSaleOrderCommand?.buyerTelephone}</Text>
              <Text>: {form.values.tblSaleOrderCommand?.taxCompany}</Text>
              <Text>: {form.values.tblSaleOrderCommand?.taxAddress}</Text>
              <Text>: {form.values.tblSaleOrderCommand?.taxCode}</Text>
            </Box>
          </Flex>
        </Box>
        <Space h="md" />
        <Box>
          <Text fw={700}>Thông tin vẫn chuyển:</Text>
          <Flex gap={3}>
            <Box>
              <Text>Họ tên</Text>
              <Text>Địa chỉ</Text>
              <Text>Điện thoại</Text>
              <Text>Ghi chú</Text>
            </Box>
            <Box>
              <Text>: </Text>
              <Text>: </Text>
              <Text>: </Text>
              <Text>: {form.values.tblSaleOrderCommand?.shippingComment}</Text>
            </Box>
          </Flex>
        </Box>
        <Space h="sm" />
        <Box>
          <Text className={style.titleH1}>3. Thông tin đơn hàng</Text>
          <Text mt={"xs"} mb={5}>
            - Phương thức thanh toán:{" "}
            {form.values.tblSaleOrderCommand?.payStatus}
          </Text>
          <Text mt={"xs"} mb={5}>
            - Phương thức vận chuyển:{" "}
            {form.values.tblSaleOrderCommand?.shippingCompany}
          </Text>
          <EuiBasicTable
            tableCaption="Demo of EuiDataGrid with selection"
            items={form.values.tblSaleOrderDetailCommands || []}
            itemId="id"
            noItemsMessage={"Không có dữ liệu"}
            columns={columnsProduct}
            isSelectable={true}
            hasActions={true}
            responsive={true}
            compressed={true}
          />
          <Table withColumnBorders>
            <Table.Tr key={1}>
              <Table.Td>
                <Text ta="right">Đã giảm giá khuyến mại</Text>
              </Table.Td>
              <Table.Td>
                <Text>
                  <Text span fw={600}>
                    <NumberFormatter
                      value={form.values.tblSaleOrderCommand?.voucherValue || 0}
                      thousandSeparator
                      suffix=" Đ"
                    />
                  </Text>
                  (Phiếu KM: {form.values.tblSaleOrderCommand?.voucherCode} -
                  Mã: {form.values.tblSaleOrderCommand?.voucherId})
                </Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr key={2}>
              <Table.Td>
                <Text ta="right">Khuyến mại khác</Text>
              </Table.Td>
              <Table.Td>
                <Text></Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr key={3}>
              <Table.Td>
                <Text ta="right">Tổng giá trị</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={600}>
                  <NumberFormatter value={total} thousandSeparator />
                  <Text span> VND</Text>
                </Text>
                <Text>(Chưa gồm phí vận chuyển)</Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr key={4}>
              <Table.Td>
                <Text ta="right">Phí vận chuyển & giao hàng</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={600}>
                  <NumberFormatter
                    value={form.values.tblSaleOrderCommand?.shippingFee || 0}
                    thousandSeparator
                  />
                  <Text span> VND</Text>
                </Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr key={5}>
              <Table.Td>
                <Text ta="right">Phí thu hộ</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={600}>
                  <NumberFormatter value={0} thousandSeparator />
                  <Text span> VND</Text>
                </Text>
              </Table.Td>
            </Table.Tr>

            <Table.Tr key={6}>
              <Table.Td>
                <Text ta="right">Tổng thu</Text>
              </Table.Td>
              <Table.Td>
                <Text fw={600}>
                  <NumberFormatter
                    value={
                      form.values.tblSaleOrderCommand?.totalRemainingAmount ||
                      total ||
                      0
                    }
                    thousandSeparator
                  />
                  <Text span> VND</Text>
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table>
        </Box>
        <Space h="sm" />
        <Text className={style.titleH1}>4. Lịch sử trạng thái</Text>
        <Space h="sm" />
        <EuiBasicTable
          tableCaption="Demo of EuiDataGrid with selection"
          items={
            form.values.tblSaleOrderHisCommands
              ? form.values.tblSaleOrderHisCommands
              : []
          }
          itemId="id"
          noItemsMessage={"Không có dữ liệu"}
          columns={columnsStatus}
          isSelectable={true}
          hasActions={true}
          responsive={true}
          compressed={true}
          // style={{ width: 550 }}
        />
      </Box>
    </div>
  );
};

export default EditView;
