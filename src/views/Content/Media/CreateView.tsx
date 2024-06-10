import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import { createMedia, getDataMediaGroup } from "../../../api/ApiMedia";
import { TblMedia, TblMediaGroup } from "../../../model/TblMedia";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const CreateView = ({ onSearch }: any) => {
  const entity = {
    mediaId: 0,
    mediaName: "",
    mediaCode: "",
    linkFile: "",
    mediaGroup: null,
    mediaGroupId: null,
    mediaWidth: null,
    mediaHeight: null,
    uploadFile: null,
    codeHtml: "",
    creationDate: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdatedBy: "",
  };

  const handleCreateMedia = async (dataSubmit: TblMedia) => {
    open();
    await createMedia(dataSubmit);
    close();
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataMediaGroup, setDataMediaGroup] = useState<TblMediaGroup[]>([]);
  const [dataOption, setDataOption] = useState<any[]>();

  const form = useForm<TblMedia>({
    initialValues: {
      ...entity,
    },
    validate: {
      mediaName: isNotEmpty("Tên chưa chưa nhập"),
      mediaCode: isNotEmpty("Code chưa chưa nhập"),
      linkFile: isNotEmpty("Link chưa nhập"),
      mediaWidth: isNotEmpty("Chưa nhập chiều rộng media"),
      mediaHeight: isNotEmpty("Chưa nhập chiều cao media"),
      mediaGroup: isNotEmpty("Chưa chọn danh mục media"),
      uploadFile: isNotEmpty("Chưa upload File media"),
      codeHtml: isNotEmpty("Code HTML chưa chưa nhập"),
    },
  });

  const handleChangeDataMediaGroup = (name: string | null) => {
    if (name) {
      const Province = dataMediaGroup?.filter(
        (item: TblMediaGroup) => item.name === name
      );
      form.getInputProps("mediaGroupId").onChange(Province[0].id);
      form.getInputProps("mediaGroup").onChange(Province[0].name);
    }
  };

  useEffect(() => {
    const loadDataMediaGroup = async () => {
      setDataMediaGroup([]);
      const data = await getDataMediaGroup("Active=true&Skip=0&Take=1000");
      setDataMediaGroup(data?.data);
    };
    loadDataMediaGroup();
  }, []);

  useEffect(() => {
    if (dataMediaGroup) {
      setDataOption(
        dataMediaGroup.map((option) => {
          return {
            value: option?.name,
            label: option?.name,
          };
        })
      );
    }
  }, [dataMediaGroup]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: TblMedia) => {
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
            label={"Tên media"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("mediaName")}
          />
          <TextInput
            label={"Code media"}
            placeholder={"Nhập code"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("mediaCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Link file"}
            placeholder={"Nhập link"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("linkFile")}
          />
          <Select
            label={"Phân nhóm"}
            placeholder={"Chọn danh mục media"}
            withAsterisk
            mt="md"
            data={dataOption}
            {...form.getInputProps("mediaGroup")}
            onChange={handleChangeDataMediaGroup}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Chiều rộng (width) (px)"}
            placeholder={""}
            mt="md"
            type="number"
            {...form.getInputProps("mediaWidth")}
          />
          <TextInput
            label={"Chiều cao (height) (px)"}
            placeholder={""}
            mt="md"
            type="number"
            {...form.getInputProps("mediaHeight")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <FileInput
            leftSection={icon}
            label={"Upload File"}
            placeholder={"Chọn file"}
            withAsterisk
            clearable
            mt="md"
            leftSectionPointerEvents="none"
            {...form.getInputProps("uploadFile")}
          />
          {form.values.uploadFile ? (
            <ImageShow
              h={200}
              w={200}
              img={
                form.values.uploadFile instanceof File
                  ? URL.createObjectURL(form.values.uploadFile)
                  : form.values.uploadFile
              }
            />
          ) : (
            <Box></Box>
          )}
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Code HTML"}
            placeholder={"Nhập code"}
            withAsterisk
            mt="md"
            {...form.getInputProps("codeHtml")}
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
