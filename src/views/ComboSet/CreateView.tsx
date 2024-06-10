import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck } from "@tabler/icons-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { createComboSet } from "../../api/ApiComboSet";
import { ComboSet, tblComboSetGroupModels } from "../../model/Comboset";
import ItemProduct from "./ItemGroup";
import { useState } from "react";

const CreateView = () => {
  const navigate = useNavigate();
  const entity = {
    setName: "",
    description: "",
    status: "",
    visible: "",
    fromDate: "",
    toDate: "",
    fromHour: null,
    toHour: null,
    isActualStore: "",
    tblComboSetGroupCommands: [],
  };

  const handleCreateComboSet = async (dataSubmit: ComboSet) => {
    open();
    const startDate = dataSubmit.fromDate;
    const endDate = dataSubmit.toDate;
    const editData = {
      ...dataSubmit,
      tblComboSetGroupCommands: dataComboSetGroup,
    };
    if (startDate && endDate) {
      const startDateObject = new Date(startDate);
      const endDateObject = new Date(endDate);

      if (startDateObject >= endDateObject) {
        NotificationExtension.Warn("Ngày bắt đầu phải trước ngày kết thúc!");
      } else {
        await createComboSet(editData);
        navigate("/combo-set");
      }
    } else {
      await createComboSet(editData);
      navigate("/combo-set");
    }
    close();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataComboSetGroup, setDataComboSetGroup] = useState<
    tblComboSetGroupModels[]
  >([]);

  const form = useForm<ComboSet>({
    initialValues: {
      ...entity,
    },
    validate: {
      setName: isNotEmpty("Tên set chưa nhập"),
      description: isNotEmpty("Mô tả tóm tắt chưa nhập"),
      status: isNotEmpty("Trạng thái chưa chọn"),
      visible: isNotEmpty("Hiển thị chưa chọn"),
    },
  });

  // const handleSetDataComboSet = (value: any) => {
  //   form.values.tblComboSetGroupCommands = value;
  //   NotificationExtension.Success("Lưu nhóm sản phẩm thành công !");
  // };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        mx="auto"
        px={64}
        onSubmit={form.onSubmit((e: ComboSet) => {
          handleCreateComboSet(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="wrap" gap={"lg"}>
          <TextInput
            label={"Tên set"}
            placeholder={"Nhập tên set"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("setName")}
          />
          <TextInput
            label={"Mô tả tóm tắt"}
            placeholder={"Nhập mô tả tóm tắt"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("description")}
          />
        </Group>

        <Group grow wrap="wrap" gap={"lg"}>
          <Select
            label={"Trạng thái"}
            placeholder={"Hiển thị/Không hiển thị"}
            withAsterisk
            mt="md"
            data={[
              { value: "A", label: "Hiển thị" },
              { value: "I", label: "Không hiển thị" },
            ]}
            {...form.getInputProps("status")}
          />
          <Select
            label={"Loại hiển thị"}
            placeholder={"Luôn hiển thị/Thời gian hiển thị"}
            withAsterisk
            mt="md"
            data={[
              { value: "A", label: "Luôn hiển thị" },
              { value: "I", label: "Thời gian hiển thị" },
            ]}
            {...form.getInputProps("visible")}
          />
        </Group>

        <Group grow wrap="wrap" gap={"lg"}>
          <DateTimePicker
            disabled={form.values.visible === "I" || null ? false : true}
            value={
              form.getInputProps("fromDate").value
                ? new Date(form.getInputProps("fromDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("fromDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày bắt đầu"
            placeholder="Ngày bắt đầu"
          />
          <DateTimePicker
            disabled={form.values.visible === "I" || null ? false : true}
            value={
              form.getInputProps("toDate").value
                ? new Date(form.getInputProps("toDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("toDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày kết thúc"
            placeholder="Ngày kết thúc"
          />
        </Group>

        <Text fw={700} mt={32} fz={18}>
          Nhóm sản phẩm trong set
        </Text>

        <ItemProduct
          // onSetDataComboSet={handleSetDataComboSet}
          dataGroupItem={dataComboSetGroup || []}
          setDataGroupItem={setDataComboSetGroup}
        />

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
            onClick={() => navigate("/combo-set")}
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
