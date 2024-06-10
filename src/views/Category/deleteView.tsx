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
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../_base/extension/StringExtension";
import { deleteItemCategory } from "../../api/ApiMegaMenu";

const DeleteView = function ({
  ids,
  onClose,
  load,
}: {
  ids: number[];
  onClose: any;
  load: number;
}) {
  
  const [visible, { toggle, close, open }] = useDisclosure(true);
  const [isContinue, setIsContinue] = useState(true);
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

    let callapi = await deleteItemCategory(ids);
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      NotificationExtension.Success("Xóa thành công !");
      onClose(load + 1);
    } else if (callapi != null) NotificationExtension.Fails("Xóa thất bại !");
    close();
    if (!isContinue) modals.closeAll();
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
            onClick={() => {
              setIsContinue(false);
            }}
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
