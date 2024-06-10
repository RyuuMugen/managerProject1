import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { TblAttributeValueCommand } from "../../model/TblAttributeValueCommand";
import { _validateValue } from "../../validate/TblAttributeValueCommandValidator";
const CreateAttValueView = function ({
  data,
}: {
  data: TblAttributeValueCommand[];
}) {
  const entity: TblAttributeValueCommand = {
    id: 0,
    attributeId: null,
    value: null,
    description: null,
    orderNumber: null,
    status: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdatedLogin: null,
  };
  const form = useForm<TblAttributeValueCommand>({
    initialValues: {
      ...entity,
    },

    validate: _validateValue,
  });

  const [visible, { toggle, close, open }] = useDisclosure(false);
  useEffect(() => {}, []);

  const apiCreate = async (d: TblAttributeValueCommand) => {
    open();
    data.push(d);
    NotificationExtension.Success("Thêm thành công !");
    modals.closeAll();
    close();
  };

  const formCreate = (
    <>
      <Divider my="sm" />
      <Box
        className="flex-none"
        component="form"
        miw={600}
        mx="auto"
        onSubmit={form.onSubmit((e: TblAttributeValueCommand) => {
          apiCreate(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <TextInput
          label="Giá trị: "
          placeholder="Nhập giá trị..."
          withAsterisk
          {...form.getInputProps("value")}
        />
        <Textarea
          label="Mô tả :"
          placeholder="Nhập mô tả..."
          mt="lg"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />
        <TextInput
          mt={"lg"}
          type="number"
          label="Thứ tự xuất hiện (cao xếp trước): "
          placeholder="Nhập thứ tự..."
          {...form.getInputProps("orderNumber")}
        />
        <Divider my="sm" />
        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
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

  return <>{formCreate}</>;
};

export default CreateAttValueView;
