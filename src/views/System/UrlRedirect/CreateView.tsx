import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Select,
} from "@mantine/core";
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
import { createLinkRedirect } from "../../../api/ApiLinkRedirect";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblLinkRedirect } from "../../../model/TblLinkRedirect";

const CreateView = ({ onClose, load, onSearch }: CreateLinkRedirect) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [isContinue, setIsContinue] = useState(true);

  const entity: TblLinkRedirect = {
    id: 0,
    oldUrl: null,
    newUrl: null,
    redirectCode: 0,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    urlType: "redirect",
    idPath: "0",
  };

  const form = useForm<TblLinkRedirect>({
    initialValues: {
      ...entity,
    },

    validate: {
      oldUrl: isNotEmpty("Chưa nhập link cũ"),
      newUrl: isNotEmpty("Chưa nhập link mới"),
      redirectCode: isNotEmpty("Chưa chọn loại redirect"),
    },
  });

  const handleCreate = async (dataSubmit: TblLinkRedirect) => {
    open();
    await createLinkRedirect(dataSubmit);
    onSearch();
    modals.closeAll();
  };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: TblLinkRedirect) => {
          handleCreate(e);
        })}
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Link cũ"}
            placeholder={"Nhập Link cũ"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("oldUrl")}
          />

          <TextInput
            label={"Link đích mới"}
            placeholder={"Nhập Link đích mới"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("newUrl")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label="Redirect Code"
            placeholder="Redirect Code"
            data={[
              { value: "0", label: "No redirect" },
              { value: "301", label: "301 - Moved Permanently" },
              { value: "302", label: "302 - Moved Temporarily" },
            ]}
            searchable
            {...form.getInputProps("redirectCode")}
          />
          <></>
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

type CreateLinkRedirect = {
  onClose: any;
  onSearch: () => void;
  load: number;
};

export default CreateView;
