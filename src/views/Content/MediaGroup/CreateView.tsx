import {
  Box,
  Button,
  ComboboxData,
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
import { useState } from "react";
import { createMediaGroup } from "../../../api/ApiMedia";
import { tblFixedContentType } from "../../../model/FixedContent";
import { TblMediaGroup } from "../../../model/TblMedia";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const CreateView = ({ onSearch }: any) => {
  const entity = {
    id: 0,
    name: "",
    code: "",
    description: "",
    creationDate: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdatedBy: "",
  };

  const handleCreateMedia = async (dataSubmit: TblMediaGroup) => {
    open();
    await createMediaGroup(dataSubmit);
    close();
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();
  const [dataOption, setDataOption] = useState<ComboboxData>();
  useState<tblFixedContentType[]>();

  const form = useForm<TblMediaGroup>({
    initialValues: {
      ...entity,
    },
    validate: {
      name: isNotEmpty("Tên chưa chưa nhập"),
      code: isNotEmpty("Code chưa chưa nhập"),
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
        onSubmit={form.onSubmit((e: TblMediaGroup) => {
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
            {...form.getInputProps("name")}
          />
          <TextInput
            label={"Code danh mục media"}
            placeholder={"Nhập code"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("code")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Mô tả"}
            placeholder={"Nhập mô tả"}
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
