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
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../const/apiRoute";
import { modifyLinkRedirect } from "../../../api/ApiLinkRedirect";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblLinkRedirect } from "../../../model/TblLinkRedirect";

const EditView = ({ id, onSearch, onClose }: EditLinkRedirect) => {
  const [visible, { toggle, close, open }] = useDisclosure(true);
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
    urlType: null,
    idPath: null,
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

  const handleCreatePayment = async (dataSubmit: TblLinkRedirect) => {
    open();
    modifyLinkRedirect(dataSubmit);
    onSearch();
    modals.closeAll();
  };

  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    const urlDetail = `/TblLinkRedirect/get-detail/` + id;
    let callApi = await repository.get<MessageResponse<TblLinkRedirect>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        form.setValues(dataApi);
        form.resetDirty(dataApi);
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
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: TblLinkRedirect) => {
          handleCreatePayment(e);
        })}
      >
        <LoadingOverlay
          // visible={visible}
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

type EditLinkRedirect = {
  id: number;
  onSearch: () => void;
  onClose: any;
};

export default EditView;
