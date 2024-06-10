import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import Repository from "../../../_base/helper/HttpHelper";
import { createInstallment } from "../../../api/ApiInstallment";
import { tblInstallmentCommand } from "../../../model/TblInstallment";

const CreateView = ({
  load,
  onClose,
  onSearch,
}: {
  load: number;
  onClose: any;
  onSearch: () => void;
}) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [isContinue, setIsContinue] = useState(true);

  const entity: tblInstallmentCommand = {
    id: 0,
    companyCode: null,
    companyName: null,
    desciption: null,
    active: null,
    createdBy: null,
    creationDate: null,
    lastUpdateBy: null,
    lastUpdateDate: null,
  };

  const form = useForm<tblInstallmentCommand>({
    initialValues: {
      ...entity,
    },

    validate: {
      companyName: isNotEmpty("Tên công ty chưa nhập"),
      companyCode: isNotEmpty("Mã công ty chưa nhập"),
      active: isNotEmpty("Chưa chọn trạng thái"),
    },
  });

  const handleCreatePayment = async (dataSubmit: tblInstallmentCommand) => {
    open();
    const data = {
      tblInstallmentCommand: dataSubmit,
      tblInstallmentPayCommands: [],
      tblInstallmentDurationCommands: [],
    };
    createInstallment(data);
    onSearch();
    modals.closeAll();
  };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={600}
        maw={600}
        mx="auto"
        onSubmit={form.onSubmit((e: tblInstallmentCommand) => {
          handleCreatePayment(e);
        })}
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <TextInput
          label={"Tên công ty"}
          placeholder={"Nhập tên công ty"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("companyName")}
        />

        <TextInput
          label={"Mã công ty"}
          placeholder={"Nhập mã công ty"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("companyCode")}
        />

        <TextInput
          label={"Mô tả công ty"}
          placeholder={"Nhập mô tả công ty"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("desciption")}
        />

        {/* <TextInput
          label={"Thứ tự hiển thị"}
          placeholder={"Nhập Thứ tự hiển thị"}
          withAsterisk
          mt="md"
          type="number"
          {...form.getInputProps("tagUrl")}
        /> */}

        <Select
          label={"Trạng thái"}
          placeholder={"Trạng thái"}
          // withAsterisk
          mt="md"
          data={[
            { value: "A", label: "Kích hoạt" },
            { value: "I", label: "Không kích hoạt" },
          ]}
          {...form.getInputProps("active")}
        />

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
