import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import "@mantine/dates/styles.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblTag } from "../../../model/TblTag";

const CreateView = ({ onClose, load }: { onClose: any; load: number }) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [isContinue, setIsContinue] = useState(true);

  const entity: TblTag = {
    id: 0,
    tagName: null,
    tagUrl: null,
    tagIndex: null,
    visit: null,
    requestPath: null,
    metaTitle: null,
    metaDescription: null,
    createdBy: null,
    lastUpdatedBy: null,
    creationDate: null,
    lastUpdateDate: null,
  };

  const form = useForm<TblTag>({
    initialValues: {
      ...entity,
    },

    validate: {
      tagName: isNotEmpty("Tên tag chưa nhập"),
      tagUrl: isNotEmpty("Tag Url thức chưa nhập"),
    },
  });

  const handleCreatePayment = async (dataSubmit: TblTag) => {
    open();
    let success = false;
    let urlCreate = API_ROUTE.CREATE_TAG;
    let callapi = await repository.post<MessageResponse<boolean>>(
      urlCreate,
      dataSubmit
    );
    success = callapi?.success ?? false;
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      if (isContinue)
        form.setValues({
          ...entity,
        });
      onClose(load + 1);
      NotificationExtension.Success("Thêm thành công !");
    } else if (callapi != null) NotificationExtension.Fails("Thêm thất bại !");
    close();
    if (!isContinue && success === true) modals.closeAll();
  };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: TblTag) => {
          handleCreatePayment(e);
        })}
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên Tag"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("tagName")}
          />

          <TextInput
            label={"Tag Url"}
            placeholder={"Nhập Url"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("tagUrl")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tag Index"}
            placeholder={"Nhập index"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("tagIndex")}
          />

          <TextInput
            label={"Request Path"}
            placeholder={"Nhập path"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("requestPath")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Lượt xem"}
            placeholder={"Nhập số lượt"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("visit")}
          />

          <></>
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Meta title"}
            placeholder={"Nhập meta title"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("metaTitle")}
          />

          <TextInput
            label={"Meta description"}
            placeholder={"Nhập meta description"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("metaDescription")}
          />
        </Group>

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            onClick={() => {
              setIsContinue(false);
            }}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>

          <Button
            variant="outline"
            color="black"
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
};

export default CreateView;
