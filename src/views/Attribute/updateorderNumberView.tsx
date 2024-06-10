import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import Repository from "../../_base/helper/HttpHelper";
import { MessageResponse } from "../../model/MessageResponse";
import { API_ROUTE } from "../../const/apiRoute";
import { EditOrderNumber } from "../../api/ApiAttribute";
import { BaseId } from "../../model/_baseId";
import { _validate } from "../../validate/IdValidator";
import { TblAttributeModel } from "../../model/TblAttributeModel";

const UpdateOrderNumberView = function ({
  id,
  orderNumber,
  onClose,
  load,
  users,
}: {
  id: number;
  orderNumber: number;
  onClose: any;
  load: number;
  users: TblAttributeModel[];
}) {
  //
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(true);
  useEffect(() => {
    if (id < 1) {
      NotificationExtension.Fails("Bạn chưa chọn dữ liệu để cập nhật !");
      modals.closeAll();
    } else toggle();
    return () => {};
  }, []);
  const form = useForm<BaseId>({
    initialValues: {
      id: orderNumber,
    },
  });

  const apiUpdate = async (id: number, orderNumberr: number) => {
    open();
    const numberOld = users.find((x) => x.id === id);
    if (id < 1) {
      NotificationExtension.Fails("Mã danh mục không tồn tại !");
      close();
    } else if (numberOld === undefined) {
      NotificationExtension.Fails("Danh mục cập nhật không tồn tại !");
      close();
    } else if (orderNumberr < 0 || orderNumberr > 10000) {
      NotificationExtension.Fails("STT chỉ được nằm trong khoảng 0 - 1000 !");
      close();
    } else if (numberOld.orderNumber === orderNumberr) {
      NotificationExtension.Fails("Bạn chưa thay đổi STT !");
      close();
    } else {
      try {
        let urlSearch = "?id=" + id + "&order=" + orderNumberr;
        let callapi = await EditOrderNumber(urlSearch);
        close();
        if (callapi?.success) {
          close();
          NotificationExtension.Success("Thao tác thành công !");
          onClose(load + 1);
        } else NotificationExtension.Fails("Thao tác thất bại !");
      } catch (error: any) {
        throw new Error(error);
      } finally {
        close();
      }
      modals.closeAll();
    }
  };

  const formCreate = (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={600}
        maw={600}
        mx="auto"
        onSubmit={form.onSubmit(async (e: any) => {
          toggle();
          await apiUpdate(id, form.values.id);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Divider my="sm" />
        <TextInput
          label="STT: "
          placeholder="Nhập STT..."
          type="number"
          withAsterisk
          {...form.getInputProps("id")}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>

          <Button
            variant="outline"
            color="black"
            type="button"
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
  return <>{formCreate}</>;
};

export default UpdateOrderNumberView;
