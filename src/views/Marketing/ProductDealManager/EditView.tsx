import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import moment from "moment";
import { useEffect } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { modifyProductDeal } from "../../../api/ApiProductDeal";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblProductDeal } from "../../../model/TblProductDeal";

const CreateView = ({ id, onSearch }: CreateViewProps) => {
  const entity = {
    id: 0,
    productId: 0,
    productImgUrl: null,
    productSku: null,
    productCode: null,
    unitSellingPrice: null,
    dealTitle: null,
    dealDescription: null,
    dealUnitSellingPrice: null,
    dealQuantity: null,
    minPurchaseQty: null,
    maxPurchaseQty: null,
    fromDate: null,
    toDate: null,
    active: null,
    orderNumber: null,
    totalSaleOrder: null,
    totalSaleOrderBought: null,
    totalViews: null,
    totalRating: null,
    reviewCount: null,
    autoRenew: null,
    priority: "N",
    rate: null,
    marketPrice: null,
  };

  const handleCreateProductDeal = async (dataSubmit: TblProductDeal) => {
    open();
    const startDate = dataSubmit.fromDate;
    const endDate = dataSubmit.toDate;
    if (startDate && endDate) {
      const startDateObject = new Date(startDate);
      const endDateObject = new Date(endDate);

      if (startDateObject >= endDateObject) {
        NotificationExtension.Warn("Ngày bắt đầu phải trước ngày kết thúc!");
      } else {
        await modifyProductDeal(dataSubmit);
      }
    }
    onSearch();
    close();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<TblProductDeal>({
    initialValues: {
      ...entity,
    },
    validate: {
      dealTitle: isNotEmpty("Tên tiêu đề chưa chưa nhập"),
      dealUnitSellingPrice: isNotEmpty("Giá deal chưa chưa nhập"),
      dealQuantity: isNotEmpty("Số lượng bán chưa chưa nhập"),
      minPurchaseQty: isNotEmpty("Số lượng tối thiểu chưa chưa nhập"),
      maxPurchaseQty: isNotEmpty("Số lượng tối đa chưa chưa nhập"),
      fromDate: isNotEmpty("Thời gian bắt đầu chưa chưa nhập"),
      toDate: isNotEmpty("Thời gian kết thúc chưa chưa nhập"),
      active: isNotEmpty("Trạng thái chưa chưa nhập"),
    },
  });

  const callApiGetData = async () => {
    open();
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    let urlCreate = API_ROUTE.GET_PRODUCT_DEAL_DETAIL + id;
    let callapi = await repository.get<MessageResponse<TblProductDeal>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        form.setValues(dataApi);
      }

      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  useEffect(() => {
    callApiGetData();
  }, [id]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={950}
        maw={950}
        mx="auto"
        onSubmit={form.onSubmit((e: TblProductDeal) => {
          handleCreateProductDeal(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tiêu đề của deal"}
            placeholder={"Nhập tiêu đề"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("dealTitle")}
          />
        </Group>

        <Text size="md" mt="lg" fw={700}>
          Thông tin bán sản phẩm
        </Text>

        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label={"Giá đang bán"}
            disabled
            mt="md"
            type="number"
            {...form.getInputProps("unitSellingPrice")}
          />
        </Group>

        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label={"Giá deal mặc định"}
            placeholder={"Nhập giá"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("dealUnitSellingPrice")}
          />
          <TextInput
            label={"Số lượng bán"}
            placeholder={"Nhập số lượng"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("dealQuantity")}
          />
        </Group>

        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label={"Số lượng tối thiểu phải mua"}
            placeholder={"Nhập giá"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("minPurchaseQty")}
          />
          <TextInput
            label={"Số lượng tối đa được mua"}
            placeholder={"Nhập số lượng"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("maxPurchaseQty")}
          />
        </Group>

        <Group grow wrap="wrap" gap={"lg"}>
          <DateTimePicker
            {...form.getInputProps("fromDate")}
            value={
              form.getInputProps("fromDate").value
                ? new Date(form.getInputProps("fromDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("fromDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            withAsterisk
            mt="md"
            label="Thời gian bắt đầu"
            placeholder="Thời gian bắt đầu"
          />
          <DateTimePicker
            {...form.getInputProps("toDate")}
            value={
              form.getInputProps("toDate").value
                ? new Date(form.getInputProps("toDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("toDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            withAsterisk
            mt="md"
            label="Thời gian kết thúc"
            placeholder="Thời gian kết thúc"
          />
        </Group>

        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label={"Thứ tự hiển thị"}
            placeholder={"Nhập thứ tự"}
            mt="md"
            type="number"
            {...form.getInputProps("orderNumber")}
          />
          <Select
            label={"Trạng thái"}
            placeholder={"Hiển thị/Không hiển thị"}
            withAsterisk
            mt="md"
            data={[
              { value: "A", label: "Hiển thị" },
              { value: "I", label: "Không hiển thị" },
            ]}
            {...form.getInputProps("active")}
          />
        </Group>

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default CreateView;

type CreateViewProps = {
  id: number;
  onSearch: Function;
};
