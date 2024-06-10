import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv } from "@tabler/icons-react";
import { createCustomerGroup } from "../../../api/ApiCustomer";
import { tblCustomerGroup } from "../../../model/TblCustomer";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const CreateView = ({ onSearch }: any) => {
  const entity = {
    id: 0,
    groupCode: null,
    groupName: null,
    orgId: null,
    creationDate: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdateLogin: null,
    lastUpdatedBy: "",
  };

  const handleCreateMedia = async (dataSubmit: tblCustomerGroup) => {
    open();
    await createCustomerGroup(dataSubmit);
    close();
    modals.closeAll();
    onSearch();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<tblCustomerGroup>({
    initialValues: {
      ...entity,
    },
    validate: {
      groupCode: isNotEmpty("Mã chưa chưa nhập"),
      groupName: isNotEmpty("Tên chưa chưa nhập"),
    },
  });

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: tblCustomerGroup) => {
          handleCreateMedia(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên danh mục media"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("groupName")}
          />
          <TextInput
            label={"Code danh mục media"}
            placeholder={"Nhập code"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("groupCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Miêu tả (nếu có)"}
            placeholder={"Nhập miêu tả"}
            mt="md"
            {...form.getInputProps("description")}
          />
        </Group>

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
            onClick={() => modals.closeAll()}
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default CreateView;
