import { Box, Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { TblAttributeValueCommand } from "../../model/TblAttributeValueCommand";
import { _validateValue } from "../../validate/TblAttributeValueCommandValidator";
const FormValueAdd = function ({
  idAttr,
  data,
  list,
  set,
}: {
  idAttr: number;
  data: TblAttributeValueCommand;
  list: TblAttributeValueCommand[];
  index: number;
  set: React.Dispatch<React.SetStateAction<TblAttributeValueCommand[]>>;
}) {
  const entity: TblAttributeValueCommand = {
    id: 0,
    attributeId: null,
    value: null,
    description: null,
    orderNumber: null,
    status: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdatedLogin: null,
  };
  const form = useForm<TblAttributeValueCommand>({
    initialValues: {
      ...entity,
    },

    validate: _validateValue,
  });

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  useEffect(() => {
    data.attributeId = idAttr;
    form.setValues(data);
    form.resetDirty(data);
    if (data.id === undefined || data.id === null || data.id < 1)
      setIsCreate(true);
  }, [list]);

  const apiCreate = (d: TblAttributeValueCommand) => {
    // console.log(list);
    if (d.value === null || d.value === undefined || d.value.length < 1) {
      NotificationExtension.Fails("Giá trị chưa nhập !");
      return;
    }
    let check = list.findIndex((x) => x.value === d.value);
    if (check > -1) {
      NotificationExtension.Fails("Giá trị đã tồn tại !");
      return;
    }
    list.push(d);
    list = list.filter(
      (x) => x.value !== null && x.value !== undefined && x.value.length > 0
    );
    set(list);
    NotificationExtension.Success("Thêm thành công !");
  };
  const apiEdit = (d: TblAttributeValueCommand) => {
    if (d.value === null || d.value === undefined || d.value.length < 1) {
      NotificationExtension.Fails("Giá trị chưa nhập !");
      return;
    }
    let check = list.findIndex((x) => x.id === d.id);
    if (check < 0) {
      NotificationExtension.Fails("Giá trị không tồn tại !");
      return;
    }
    list = list.filter(
      (x) =>
        x.value !== null &&
        x.value !== undefined &&
        x.value.length > 0 &&
        x.id !== d.id
    );
    list.push(d);
    set(list);
    NotificationExtension.Success("Thao tác thành công !");
  };

  const apiDelete = (d: TblAttributeValueCommand) => {
    if (isCreate) {
      if (d.value === null || d.value === undefined || d.value.length < 1) {
        NotificationExtension.Fails("Giá trị không có !");
        return;
      }
      let check = list.findIndex((x) => x.value === d.value);
      if (check < 0) {
        NotificationExtension.Fails("Giá trị không tồn tại !");
        return;
      }
      list = list.filter(
        (x) =>
          x.value !== null &&
          x.value !== undefined &&
          x.value.length > 0 &&
          x.value !== d.value
      );
      set(list);
      NotificationExtension.Success("Xóa thành công !");
    } else {
      if (d.id === null || d.id === undefined || d.id < 1) {
        NotificationExtension.Fails("Giá trị không có !");
        return;
      }
      let check = list.findIndex((x) => x.id === d.id);
      if (check < 0) {
        NotificationExtension.Fails("Giá trị không tồn tại !");
        return;
      }
      list = list.filter(
        (x) => x.id !== null && x.id !== undefined && x.id !== d.id
      );
      // console.log(list);
      set(list);
      NotificationExtension.Success("Xóa thành công !");
    }
  };
  const formCreate = (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={600}
        mx="auto"
        onSubmit={form.onSubmit((e: TblAttributeValueCommand) => {
          console.log(e);
        })}
      >
        <Group justify="flex-end">
          <TextInput
            mt={"xs"}
            label="ID: "
            disabled={true}
            withAsterisk
            {...form.getInputProps("id")}
          />
          <TextInput
            mt={"xs"}
            label="Giá trị: "
            placeholder={"Nhập giá trị..."}
            withAsterisk
            {...form.getInputProps("value")}
          />
          <Textarea
            mt={"xs"}
            label="Mô tả :"
            placeholder={"Nhập mô tả..."}
            autosize
            minRows={1}
            {...form.getInputProps("description")}
          />
          <TextInput
            mt={"xs"}
            type="number"
            label="Thứ tự xuất hiện (cao xếp trước): "
            placeholder={"Nhập thứ tự..."}
            {...form.getInputProps("orderNumber")}
          />
          <Button
            mt={"xl"}
            type="button"
            color="#3598dc"
            loading={visible}
            onClick={(e) => {
              if (isCreate) apiCreate(form.values);
              else apiEdit(form.values);
            }}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            {isCreate ? "Lưu" : "Sửa"}
          </Button>
          <Button
            mt={"xl"}
            variant="outline"
            color="black"
            type="button"
            loading={visible}
            onClick={() => {
              apiDelete(form.values);
            }}
            leftSection={!visible ? <IconX size={18} /> : undefined}
          >
            Xóa
          </Button>
        </Group>
      </Box>
    </>
  );

  return <>{formCreate}</>;
};

export default FormValueAdd;
