import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { modifyTradeInOrder } from "../../../api/ApiTradeIn";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblTradeInOrder } from "../../../model/TblTradeIn";

const CreateView = ({ id, onSearch }: CreateViewProps) => {
  const entity = {
    id: 0,
    type: null,
    code: null,
    codeUpgrade: null,
    cusName: null,
    cusEmail: null,
    mobileNumber: null,
    ipAddress: null,
    productName: null,
    productCondition: null,
    accessory: null,
    estimate: null,
    description: null,
    itemCode: null,
    itemId: null,
    itemUpgradeId: null,
    itemUpgradeCode: null,
    orgId: null,
    status: null,
    note: null,
  };

  const handleCreateProductDeal = async (dataSubmit: TblTradeInOrder) => {
    open();
    await modifyTradeInOrder(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<TblTradeInOrder>({
    initialValues: {
      ...entity,
    },
    validate: {},
  });

  const callApiGetData = async () => {
    open();
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    let urlCreate = API_ROUTE.DETAIL_TRADE_IN_ORDER + id;
    let callapi = await repository.get<MessageResponse<TblTradeInOrder>>(
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
        onSubmit={form.onSubmit((e: TblTradeInOrder) => {
          handleCreateProductDeal(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Group grow wrap="nowrap" mt="md" gap={"lg"}>
          <Select
            label={"Trạng thái"}
            placeholder={"Hiển thị/Không hiển thị"}
            withAsterisk
            data={[
              { value: "S", label: "Thành công" },
              { value: "C", label: "Huỷ bỏ" },
              { value: "P", label: "Chờ xử lý" },
            ]}
            {...form.getInputProps("status")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="md" gap={"lg"}>
          <Textarea
            label="Ghi chú"
            placeholder="Nhập ghi chú "
            {...form.getInputProps("note")}
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
