import { EuiLink } from "@elastic/eui";
import {
  Box,
  Button,
  Group,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { getDataProvice } from "../../../api/ApiAddress";
import { modifyInstallmentOrderStatus } from "../../../api/ApiInstallment";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import {
  editInstallmentOrderStatus,
  tblInstallmentOrder,
} from "../../../model/TblInstallment";

const View = ({ id, onSearch }: { id: number; onSearch: any }) => {
  const [visible, { toggle, close, open }] = useDisclosure(true);
  const [data, setdata] = useState<tblInstallmentOrder>();
  const [dataProvice, setDataProvice] = useState<any[]>([]);

  const handleEditOrder = async (data: any) => {
    open();
    await modifyInstallmentOrderStatus(data);
    callApiGetData();
    onSearch();
  };

  const form = useForm<editInstallmentOrderStatus>({
    initialValues: {
      id: id,
      status: "",
      description: "",
    },
    validate: {},
  });

  const formatDate = (datetime: any) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  const getNameByProvinceId = (id: any) => {
    const province = dataProvice.find(
      (item) => item.provinceId === parseInt(id)
    );
    return province ? province.provinceName : null;
  };

  const getStatusMessage = (status: any) => {
    switch (status) {
      case "1":
        return "Hủy bỏ";
      case "2":
        return "Thành công";
      default:
        return "Chờ xử lý";
    }
  };

  const callApiGetData = async () => {
    open();
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    const urlDetail = API_ROUTE.GET_DETAIL_INSTALLMENT_ORDER + `?id=${id}`;
    let callApi = await repository.get<MessageResponse<any>>(urlDetail);
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setdata(dataApi);
        form.setFieldValue("status", dataApi?.status);
        form.setFieldValue("description", dataApi?.description);
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
        modals.closeAll();
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };
  useEffect(() => {
    if (id || id === 0) {
      callApiGetData();
    }
  }, [id]);

  useEffect(() => {
    const fetchDataProvice = async () => {
      try {
        const data = await getDataProvice("Take=64");
        if (data?.data) {
          setDataProvice(data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataProvice();
  }, []);

  return (
    <>
      <Box className="flex-none" miw={800} maw={800} mx="auto">
        <form onSubmit={form.onSubmit((values) => handleEditOrder(values))}>
          <Text fw={700} style={{ fontSize: 15 }} mb={"md"}>
            1.Cập nhật trạng thái đơn
          </Text>
          <Group grow wrap="nowrap" gap={"lg"}>
            <Select
              label={"Trạng thái"}
              placeholder={"Chọn trạng thái"}
              withAsterisk
              data={[
                { value: "0", label: "Chờ xử lý" },
                { value: "1", label: "Huỷ bỏ" },
                { value: "2", label: "Thành công" },
              ]}
              nothingFoundMessage="Không có dữ liệu"
              {...form.getInputProps("status")}
            />
            <TextInput
              label={"Ghi chú thêm"}
              type="text"
              {...form.getInputProps("description")}
            />
          </Group>

          <Group mt="md">
            <Button type="submit">Lưu</Button>
          </Group>
        </form>
      </Box>
      <Box miw={800} maw={800} mt={40}>
        <Text fw={700} style={{ fontSize: 15 }} mb={"md"}>
          2.Chi tiết đơn
        </Text>
        <Table striped withTableBorder withColumnBorders>
          <Table.Tr>
            <Table.Td>Mã đơn</Table.Td>
            <Table.Td>{data?.orderNumber}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Nhà cung cấp</Table.Td>
            <Table.Td>{data?.supplierName}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Điều khoản</Table.Td>
            <Table.Td>
              <div>
                <p>{`- Giá trả góp: ${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(data?.installmentPrice || 0)}`}</p>
                <p>
                  {`- Trả trước: ${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data?.prepaymentAmount || 0)}`}
                  {data?.prepaymentPercent && (
                    <>({data?.prepaymentPercent} %)</>
                  )}
                </p>
                {data?.interestRate && (
                  <p>{`- Lãi suất: ${data?.interestRate}%`}</p>
                )}
                <p>{`- Tháng: ${data?.duration}`}</p>
              </div>
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td>Khách hàng</Table.Td>
            <Table.Td>
              <div>
                <p>{`- Tên khách hàng: ${data?.customerName}`}</p>
                <p>{`- Tỉnh: ${getNameByProvinceId(
                  data?.customerProvince
                )}`}</p>
                <p>{`- Địa chỉ: ${data?.customerAddress}`}</p>
                <p>{`- Email: ${data?.customerEmail}`}</p>
                <p>{`- Điện thoại: ${data?.telephoneNumber}`}</p>
                {data?.identifyCard && <p>{`- CCCD: ${data?.identifyCard}`}</p>}
              </div>
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td>Thời gian/ Trạng thái</Table.Td>
            <Table.Td>
              <div>
                <p>Thời gian tạo đơn: {formatDate(data?.createdDate)}</p>
                <p>Trạng thái: {getStatusMessage(data?.status)}</p>
              </div>
            </Table.Td>
          </Table.Tr>

          <Table.Tr>
            <Table.Td>Sản phẩm</Table.Td>
            <Table.Td>
              <div>
                {data?.tblInstallmentOrderDetailModels.map(
                  (productItem: any, index: number) => (
                    <div
                      key={index}
                      style={{ marginBottom: 10, marginRight: 20 }}
                    >
                      <EuiLink
                        style={{ fontSize: 14 }}
                        href={`${process.env.REACT_APP_BASE_WEB_HACOM_URL}/product-detail/${productItem?.itemUrl}`}
                        target="_blank"
                      >
                        <Text fw={700}>{`${index + 1}. ${
                          productItem.itemName
                        }`}</Text>
                      </EuiLink>

                      <Table striped withTableBorder withColumnBorders>
                        <Table.Tr>
                          <Table.Td>SKU:</Table.Td>
                          <Table.Td>{productItem.sku}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Số lượng:</Table.Td>
                          <Table.Td>{productItem.quantity}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Đơn giá:</Table.Td>
                          <Table.Td>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(productItem.itemPrice)}
                          </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                          <Table.Td>Tổng giá:</Table.Td>
                          <Table.Td>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              productItem.itemPrice * productItem.quantity
                            )}
                          </Table.Td>
                        </Table.Tr>
                      </Table>
                    </div>
                  )
                )}
              </div>
            </Table.Td>
          </Table.Tr>
        </Table>
      </Box>
      <Group justify="flex-end" mt="lg">
        <Button
          variant="outline"
          color="black"
          onClick={() => modals.closeAll()}
          leftSection={!visible ? <IconX size={18} /> : undefined}
        >
          Đóng
        </Button>
      </Group>
    </>
  );
};

export default View;
