import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Select,
  Table,
  Text,
  TextInput,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import Repository from "../../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../../model/MessageResponse";
import { API_ROUTE } from "../../../../const/apiRoute";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { modals } from "@mantine/modals";
import { getDataSaleOrderStatus } from "../../../../api/ApiOrderStatus";
import { TblOrderStatus } from "../../../../model/TblOrderStatus";
import style from "./Editview.module.css";
import {
  modifySaleOrder,
  modifySaleOrderAssign,
  modifySaleOrderEditStatus,
} from "../../../../api/ApiSaleOrder";
import {
  tblSaleOrder,
  tblAssignSaleOrders,
  tblSaleOrderDetailCommands,
} from "../../../../model/TblSaleOrder";
import {
  tblProvince,
  tblDistrict,
  tblCommune,
} from "../../../../model/TblAddress";
import { tblEmployeekdol } from "../../../../model/TblEmployee";
import { getDataEmployeekdol } from "../../../../api/ApiEmployee";
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
              {/* <Text>{online.itemInformation}</Text> */}
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
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [dataSaleOrderStatus, setDataSaleOrderStatus] = useState<
    TblOrderStatus[]
  >([]);
  const [dataEmployee, setDataEmployee] = useState<tblEmployeekdol[]>([]);
  const [dataProvice, setDataProvice] = useState<tblProvince>();
  const [dataDistrict, setDataDistrict] = useState<tblDistrict>();
  const [dataCommune, setDataCommune] = useState<tblCommune>();
  const [dataAssign, setDataAssign] = useState("");
  const [dataOptionSaleOrderStatus, setDataOptionSaleOrderStatus] =
    useState<any>([]);
  const [dataOptionEmployee, setDataOptionEmployee] = useState<any>([]);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const repository2 = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);

  const form = useForm<tblSaleOrder>();
  const form2 = useForm<tblAssignSaleOrders>();
  const formatDate = (datetime: any) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };
  const handleEditSaleOrder = async (dataSubmit: tblSaleOrder) => {
    open();
    const data = {
      orderId: dataSubmit.tblSaleOrderCommand.id,
      status: dataSubmit.tblSaleOrderCommand.orderStatus,
      description: dataSubmit.tblSaleOrderCommand.receivePayStatus,
    };
    await modifySaleOrderEditStatus(data);
    close();
    modals.closeAll();
    onSearch();
  };
  const handleEditAssign = async (dataSubmit: tblAssignSaleOrders[]) => {
    open();
    await modifySaleOrderAssign([dataSubmit]);
    close();
    modals.closeAll();
    onSearch();
  };
  const handleSelectChange = (selectedValue: any) => {
    const parts = selectedValue.split("+");
    const beforePlus = parts[0];
    const afterPlus = parts.slice(1).join("+");
    form2.setValues({
      assignId: beforePlus,
      assignName: afterPlus,
    });
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
        form2.setValues({
          orderId: dataApi?.lsTblSaleOrderModel?.id,
          assignId: dataApi?.lsTblSaleOrderModel?.assignToId,
          assignName: dataApi?.lsTblSaleOrderModel?.assignToName,
        });
        if (
          dataApi &&
          dataApi.lsTblSaleOrderModel &&
          dataApi.lsTblSaleOrderModel.orderStatus !== undefined
        ) {
          setOrderStatus(dataApi.lsTblSaleOrderModel.orderStatus);
        }
        form2.setValues({
          orderId: dataApi?.lsTblSaleOrderModel?.id,
          assignId: dataApi?.lsTblSaleOrderModel?.assignToId,
          assignName: dataApi?.lsTblSaleOrderModel?.assignToName,
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
  }, [form.values.tblSaleOrderDetailCommands]);

  useEffect(() => {
    const loadDataSaleOrderStatus = async () => {
      setDataSaleOrderStatus([]);
      const data = await getDataSaleOrderStatus("Active=true&Skip=0&Take=1000");
      setDataSaleOrderStatus(data?.data.lists);
    };
    loadDataSaleOrderStatus();
  }, []);

  useEffect(() => {
    const loadDataEmployee = async () => {
      setDataEmployee([]);
      const data = await getDataEmployeekdol("Skip=0&Take=1000");
      setDataEmployee(data?.data);
    };
    loadDataEmployee();
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

  useEffect(() => {
    if (dataEmployee) {
      setDataOptionEmployee(
        dataEmployee.map((option) => {
          return {
            value: option?.id + "+" + option?.email_organ,
            label:
              "Email: " +
              option?.email_organ +
              " - " +
              "Tên nhân viên: " +
              option?.name,
          };
        })
      );
    }
  }, [dataEmployee]);

  return (
    <div>
      <Box className="flex-none" miw={1300} maw={1300} mx="auto">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Box
          component="form"
          className={style.formInputStatus}
          onSubmit={form2.onSubmit((e: any) => {
            handleEditAssign(e);
          })}
        >
          <Text fw={700} style={{ fontSize: 15 }}>
            Cập nhật người phụ trách
          </Text>
          <Group grow wrap="nowrap" mt="md" gap={"lg"}>
            <Select
              label={"Chọn người phụ trách"}
              placeholder={"Chọn người phụ trách"}
              withAsterisk
              searchable
              nothingFoundMessage="Không có dữ liệu"
              data={dataOptionEmployee}
              disabled={
                orderStatus === "SUCCESS" ||
                orderStatus === "WEB-CANCEL" ||
                orderStatus === "CUST-CANCEL"
              }
              value={form2?.values?.assignId + "+" + form2?.values?.assignName}
              onChange={handleSelectChange}
            />
            <TextInput
              label={"Ghi chú thêm"}
              type="text"
              disabled={
                orderStatus === "SUCCESS" ||
                orderStatus === "WEB-CANCEL" ||
                orderStatus === "CUST-CANCEL"
              }
              {...form2.getInputProps("description")}
            />
          </Group>
          <Button
            mt={"md"}
            type="submit"
            disabled={
              orderStatus === "SUCCESS" ||
              orderStatus === "WEB-CANCEL" ||
              orderStatus === "CUST-CANCEL"
            }
          >
            Cập nhật
          </Button>
        </Box>

        <Box
          component="form"
          className={style.formInputStatus}
          onSubmit={form.onSubmit((e: any) => {
            handleEditSaleOrder(e);
          })}
        >
          <Text fw={700} style={{ fontSize: 15 }} mb={"md"}>
            Cập nhật trạng thái đơn hàng
          </Text>
          {(!form2?.values?.assignId || !form2?.values?.assignName) && (
            <Text className={style.errorText} mb={5}>
              * Bạn cần chọn người phụ trách cho đơn trước
            </Text>
          )}

          <Group grow wrap="nowrap" gap={"lg"}>
            <Select
              label={"Trạng thái"}
              placeholder={"Chọn trạng thái"}
              withAsterisk
              nothingFoundMessage="Không có dữ liệu"
              data={dataOptionSaleOrderStatus}
              disabled={
                !form2?.values?.assignId ||
                !form2?.values?.assignName ||
                orderStatus === "SUCCESS" ||
                orderStatus === "WEB-CANCEL" ||
                orderStatus === "CUST-CANCEL"
              }
              {...form.getInputProps("tblSaleOrderCommand.orderStatus")}
            />
            <TextInput
              label={"Ghi chú thêm"}
              type="text"
              disabled={
                !form2?.values?.assignId ||
                !form2?.values?.assignName ||
                orderStatus === "SUCCESS" ||
                orderStatus === "WEB-CANCEL" ||
                orderStatus === "CUST-CANCEL"
              }
              {...form.getInputProps("tblSaleOrderCommand.receivePayStatus")}
            />
          </Group>
          <Button
            mt={"md"}
            type="submit"
            disabled={
              !form2?.values?.assignId ||
              !form2?.values?.assignName ||
              orderStatus === "SUCCESS" ||
              orderStatus === "WEB-CANCEL" ||
              orderStatus === "CUST-CANCEL"
            }
          >
            Cập nhật
          </Button>
        </Box>

        <Text className={style.titleH1}>
          1. Thời gian: {formatDate(form.values.tblSaleOrderCommand?.orderDate)}
        </Text>
        <Text className={style.titleH1}>2. Thông tin người mua</Text>
        <Space h="sm" />
        <Box>
          <Space h="sm" />
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

        <Box>
          <Space h="md" />
          <Text fw={700}>Thông tin vẫn chuyển:</Text>
          <Flex gap={3}>
            <Box>
              <Text>Họ tên</Text>
              <Text>Địa chỉ</Text>
              <Text>Điện thoại</Text>
              <Text>Ghi chú</Text>
            </Box>
            <Box>
              <Text>:</Text>
              <Text>: </Text>
              <Text>: </Text>
              <Text>:</Text>
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
