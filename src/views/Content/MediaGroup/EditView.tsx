import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { modifyMediaGroup } from "../../../api/ApiMedia";
import { tblFixedContentType } from "../../../model/FixedContent";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblMediaGroup } from "../../../model/TblMedia";

const EditView = ({ onSearch, id }: any) => {
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
    await modifyMediaGroup(dataSubmit);
    close();
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
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

  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    const urlDetail = `TblMediaGroup/details?id=` + id;
    let callApi = await repository.post<MessageResponse<TblMediaGroup>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        form.setValues(dataApi);
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
        modals.closeAll();
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

export default EditView;
