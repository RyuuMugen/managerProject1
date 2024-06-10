import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import {
  createFixedContent,
  getDataFixedContentType,
} from "../../../api/ApiContent";
import QuillEditor from "../../../common/QuillEditor";
import { TblConfigGroup } from "../../../model/TblConfigGroup";
import { createConfigGroup } from "../../../api/ApiConfigGroup";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const CreateView = ({ onSearch }: any) => {
  const entity = {
    id: 0,
    name: "",
    description: "",
    searchFulltext: "",
    configGroupType: "",
  };

  const handleCreateConfigGroup = async (dataSubmit: TblConfigGroup) => {
    open();
    await createConfigGroup(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<TblConfigGroup>({
    initialValues: {
      ...entity,
    },
    validate: {
      name: isNotEmpty("Tên nhóm chưa chưa nhập"),
    },
  });

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={950}
        maw={950}
        mx="auto"
        onSubmit={form.onSubmit((e: TblConfigGroup) => {
          handleCreateConfigGroup(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên nhóm"}
            placeholder={"Nhập tên nhóm"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("name")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Mô tả tóm tắt"}
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
