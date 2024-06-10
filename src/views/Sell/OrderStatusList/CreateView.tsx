import {
  Box,
  Button,
  ComboboxData,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createOrderDetailStatus } from "../../../api/ApiOrderStatus";
import { TblOrderStatus } from "../../../model/TblOrderStatus";

const CreateView = ({ onSearch, datas }: any) => {
  const entity: TblOrderStatus = {
    id: 0,
    status: null,
    createdBy: null,
    description: null,
  };

  const handleCreateOrderStatus = async (dataSubmit: TblOrderStatus) => {
    open();
    await createOrderDetailStatus(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const [dataOption, setDataOption] = useState<ComboboxData>();
  const [visible, { toggle, close, open }] = useDisclosure(false);

  useState<TblOrderStatus[]>();

  const form = useForm<TblOrderStatus>({
    initialValues: {
      ...entity,
    },
    validate: {
      status: isNotEmpty("Trạng thái chưa nhập"),
      description: isNotEmpty("Trạng thái hệ thống chưa nhập"),
    },
  });

  useEffect(() => {
    const dataOption = datas?.map((item: any) => {
      return { value: item?.id?.toString(), label: item?.name };
    });
    setDataOption(dataOption);
  }, [datas]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1000}
        maw={1000}
        mx="auto"
        onSubmit={form.onSubmit((e: TblOrderStatus) => {
          handleCreateOrderStatus(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Nhập trạng thái đơn hàng bán"}
            placeholder={"Trạng thái đơn hàng bán"}
            mt="md"
            withAsterisk
            type="text"
            {...form.getInputProps("status")}
          />

          <TextInput
            label={"Mô tả trạng thái đơn hàng bán"}
            placeholder={"Trạng thái đơn hàng bán"}
            mt="md"
            type="text"
            withAsterisk
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
