import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../_base/extension/StringExtension";
import Repository from "../../_base/helper/HttpHelper";
import { MessageResponse } from "../../model/MessageResponse";
import { API_ROUTE } from "../../const/apiRoute";

const DeleteView = function ({
  ids,
  onClose,
  load,
}: {
  ids: number[];
  onClose: any;
  load: number;
}) {
  //
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(true);
  useEffect(() => {
    if (ids && ids.length < 1) {
      NotificationExtension.Fails("Bạn chưa chọn dữ liệu để xóa !");
      modals.closeAll();
    } else toggle();
    return () => {};
  }, []);
  const form = useForm({
    initialValues: {},
  });

  const apiDelete = async () => {
    open();
    let urlCreate = API_ROUTE.DELETE_ATTRIBUTE;
    let callapi = await repository.post<MessageResponse<boolean>>(
      urlCreate,
      ids
    );
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      NotificationExtension.Success("Xóa thành công !");
      onClose(load + 1);
      modals.closeAll();
    } else if (callapi != null) NotificationExtension.Fails("Xóa thất bại !");
    close();
  };

  const formCreate = (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={600}
        maw={600}
        mx="auto"
        onSubmit={form.onSubmit((e: any) => {
          toggle();
          apiDelete();
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Divider my="sm" />
        <Title order={5}>Bạn có chắc chắn muốn xóa !</Title>
        <Divider my="sm" />
        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            leftSection={<IconCheck size={18} />}
          >
            Xóa
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

export default DeleteView;
