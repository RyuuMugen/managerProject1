import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import "@mantine/dates/styles.css";
import { TblTechnicalCommon } from "../../../../model/TblTechnicalCommon";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import { MessageResponse } from "../../../../model/MessageResponse";
import Repository from "../../../../_base/helper/HttpHelper";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { createTechnicalCommon } from "../../../../api/ApiProduct";
import { useDisclosure } from "@mantine/hooks";
import { API_ROUTE } from "../../../../const/apiRoute";

const CreateView = ({ onClose, load }: { onClose: any; load: number }) => {
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [isContinue, setIsContinue] = useState(true);

  const entity: TblTechnicalCommon = {
    id: 0,
    techComCode: null,
    techComName: null,
    orgId: null,
    description: null,
    createdBy: null,
    lastUpdatedBy: null,
    creationDate: null,
    lastUpdateDate: null,
  };

  const form = useForm<TblTechnicalCommon>({
    initialValues: {
      ...entity,
    },

    validate: {
      techComName: hasLength(
        { min: 2, max: 100 },
        "Tên phải chưa từ 2-100 kí tự !"
      ),
      // techComCode: isNotEmpty("Mã công nghệ chưa nhập"),
      techComCode: hasLength(
        { min: 2, max: 100 },
        "Tên phải chưa từ 2-100 kí tự !"
      ),
    },
  });

  const handleCreatePayment = async (dataSubmit: TblTechnicalCommon) => {
    open();
    let success = false;
    let callapi = await createTechnicalCommon(dataSubmit);
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
    if (!isContinue && success == true) modals.closeAll();
  };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: TblTechnicalCommon) => {
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
            label={"Tên thông số kỹ thuật"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("techComName")}
          />

          <TextInput
            label={"Mã thông số kỹ thuật"}
            placeholder={"Nhập mã thông số kỹ thuật"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("techComCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Mã chi nhánh"}
            placeholder={"Nhập mã chi nhánh"}
            mt="md"
            type="number"
            {...form.getInputProps("orgId")}
          />

          <TextInput
            label={"Mô tả"}
            placeholder={"Nhập mô tả"}
            mt="md"
            type="text"
            {...form.getInputProps("description")}
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
