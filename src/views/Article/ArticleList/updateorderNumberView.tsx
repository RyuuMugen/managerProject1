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
import Repository from "../../../_base/helper/HttpHelper";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { BaseId } from "../../../model/_baseId";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";

const UpdateOrderNumberView = function ({
  id,
  orderNumber,
  data,
  onSearch,
}: {
  id: number;
  orderNumber: number;
  onSearch: () => Promise<any[] | null | undefined>;
  data: any[];
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

  const apiUpdate = async (id: number, order: number) => {
    open();
    const numberOld = data.find((x) => x.id === id);
    if (id < 1) {
      NotificationExtension.Fails("Mã sản phẩm không tồn tại !");
      close();
    } else if (numberOld === undefined) {
      NotificationExtension.Fails("Sản phẩm cập nhật không tồn tại !");
      close();
    } else if (order < 0 || order > 10000) {
      NotificationExtension.Fails("STT chỉ được nằm trong khoảng 0 - 10000 !");
      close();
    } else if (numberOld.orderNumber === order) {
      NotificationExtension.Fails("Bạn chưa thay đổi STT !");
      close();
    } else {
      let urlSearch =
        API_ROUTE.MODIFY_ARTICLE_LIST_ORDER + id + "&order=" + order;
      let callapi = await repository.post<MessageResponse<boolean>>(urlSearch);
      if (isNullOrUndefined(callapi)) {
        NotificationExtension.Fails(
          "Thao tác không thành công, xin vui lòng thử lại !"
        );
      } else {
        if (callapi?.success) {
          NotificationExtension.Success("Thao tác thành công !");
        } else NotificationExtension.Fails("Thao tác thất bại !");
      }
      onSearch();
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
