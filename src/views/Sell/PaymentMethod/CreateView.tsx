import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import "@mantine/dates/styles.css";
import moment from "moment";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { TblPaymentMethod } from "../../../model/TblPaymentMethod";
import { useDisclosure } from "@mantine/hooks";
import { API_ROUTE } from "../../../const/apiRoute";
import Repository from "../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const CreateView = ({ onClose, load }: { onClose: any; load: number }) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [isContinue, setIsContinue] = useState(true);

  const entity: TblPaymentMethod = {
    paymentId: 0,
    paymentCode: null,
    paymentName: null,
    startDateActive: null,
    endDateActive: null,
    paymentType: null,
    description: null,
    createdBy: null,
    lastUpdatedBy: null,
    creationDate: null,
    lastUpdateDate: null,
  };

  const form = useForm<TblPaymentMethod>({
    initialValues: {
      ...entity,
    },

    validate: {
      paymentName: (value: string | null) => {
        const errorMessageNotEmpty = isNotEmpty("Tên phương thức chưa nhập")(
          value
        );
        if (errorMessageNotEmpty) {
          return errorMessageNotEmpty;
        }

        return hasLength(
          { min: 2, max: 100 },
          "Tên phải từ 2-100 kí tự !"
        )(value as string);
      },
      paymentCode: (value: string | null) => {
        const errorMessageNotEmpty = isNotEmpty("Mã phương thức chưa nhập")(
          value
        );
        if (errorMessageNotEmpty) {
          return errorMessageNotEmpty;
        }

        if (!/^[a-zA-Z0-9]+$/.test(value as string)) {
          return "Mã phương thức không được chứa kí tự đặc biệt!";
        }

        return hasLength(
          { max: 30 },
          "Mã phương thức không được quá 30 kí tự!"
        )(value as string);
      },
      paymentType: isNotEmpty("Kiểu phương thức chưa nhập"),
    },
  });

  const handleCreatePayment = async (dataSubmit: TblPaymentMethod) => {
    open();
    const callApiCreate = async () => {
      let success = false;
      let urlCreate = API_ROUTE.CREATE_PAYMENT;
      let callapi = await repository.post<MessageResponse<boolean>>(
        urlCreate,
        dataSubmit
      );
      success = callapi?.success ?? false;
      if (!isNullOrUndefined(callapi) && callapi?.success) {
        // nếu chọn tiếp tục thêm, sẽ làm mới form
        if (isContinue)
          form.setValues({
            ...entity,
          });
        onClose(load + 1);
        NotificationExtension.Success("Thêm thành công !");
      } else if (callapi != null)
        NotificationExtension.Fails("Thêm thất bại !");
      if (!isContinue && success == true) modals.closeAll();
    };
    const startDate = dataSubmit.startDateActive;
    const endDate = dataSubmit.endDateActive;

    if (startDate && endDate) {
      const startDateObject = new Date(startDate);
      const endDateObject = new Date(endDate);

      if (startDateObject >= endDateObject) {
        NotificationExtension.Warn("Ngày bắt đầu phải trước ngày kết thúc!");
      } else callApiCreate();
    } else callApiCreate();
    close();
  };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: TblPaymentMethod) => {
          handleCreatePayment(e);
        })}
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên phương thức thanh toán"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("paymentName")}
          />

          <TextInput
            label={"Mã phương thức thanh toán"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("paymentCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <DateTimePicker
            value={
              form.getInputProps("startDateActive").value
                ? new Date(form.getInputProps("startDateActive").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("startDateActive")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày bắt đầu hoạt động"
            placeholder="Ngày hoạt động"
          />

          <DateTimePicker
            value={
              form.getInputProps("endDateActive").value
                ? new Date(form.getInputProps("endDateActive").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("endDateActive")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày dừng hoạt động"
            placeholder="Ngày dừng hoạt động"
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Dạng thanh toán"}
            placeholder={"Nhập dạng"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("paymentType")}
          />

          <TextInput
            label={"Mô tả"}
            placeholder={"Mô tả"}
            mt="md"
            type="text"
            {...form.getInputProps("description")}
          />
        </Group>

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            onClick={() => {
              setIsContinue(false);
            }}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>

          <Button
            variant="outline"
            color="black"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={!visible ? <IconX size={18} /> : undefined}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default CreateView;
