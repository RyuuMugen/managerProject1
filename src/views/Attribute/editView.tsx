import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  TextInput,
  Textarea,
  Text,
  Checkbox,
  Radio,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure} from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrUndefined,
} from "../../_base/extension/StringExtension";
import Repository from "../../_base/helper/HttpHelper";
import { MessageResponse } from "../../model/MessageResponse";
import { API_ROUTE } from "../../const/apiRoute";
import { TblAttributeCommand } from "../../model/TblAttributeCommand";
import { _validate } from "../../validate/TblAttributeCommandValidator";
import { TblAttributeValueCommand } from "../../model/TblAttributeValueCommand";
import { _validateValue } from "../../validate/TblAttributeValueCommandValidator";
import FormValueAdd from "./formValueAdd";


const EditView = function ({
  id,
  onClose,
  load,
}: {
  id: number;
  onClose: any;
  load: number;
}) {
  const entity: TblAttributeCommand = {
    id: 0,
    attributeCode: null,
    attributeName: null,
    filterCode: null,
    description: null,
    orderNumber: null,
    status: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdatedLogin: null,
    attributeGroup: null,
    filterProdStatus: null,
    titleGroupStatus: null,
    shortDescStatus: null,
    displayInTechStatus: null,
    configProdStatus: null,
    listTblAttributeValueCommand: null
  };

  const entityy: TblAttributeValueCommand = {
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
    lastUpdatedLogin: null
  };
  const form = useForm<TblAttributeCommand>({
    initialValues: {
      ...entity,
    },

    validate: _validate,
  });

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [isContinue, setIsContinue] = useState(true);
  const [loading, setloading] = useState<boolean>(false);
  const [vTblAttributeValueCommand, setTblAttributeValueCommand] = useState<TblAttributeValueCommand[]>([]);

  const handleChangeValue = (e: any, label: string) => {
    form.setValues({
      ...entity,
      [label]: e,
    });
  };
  useEffect(() => {
    callApiGetData();
  }, []);

  const callApiGetData = async () => {
    open();
    let urlCreate = API_ROUTE.MODIFY_ATTRIBUTE + `?id=${id}`;
    let callapi = await repository.get<MessageResponse<TblAttributeCommand>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        dataApi.titleGroupStatus = dataApi.titleGroupStatus === 'Y';
        dataApi.configProdStatus = dataApi.configProdStatus === 'Y';
        dataApi.displayInTechStatus = dataApi.displayInTechStatus === 'Y';
        dataApi.filterProdStatus = dataApi.filterProdStatus === 'Y';
        dataApi.shortDescStatus = dataApi.shortDescStatus === 'Y';
        form.setValues(dataApi);
        form.resetDirty(dataApi);
        setTblAttributeValueCommand(dataApi.listTblAttributeValueCommand ?? [])
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };
  const apiCreate = async (data: TblAttributeCommand) => {
    open();
    data.titleGroupStatus = data.titleGroupStatus ? 'Y' : 'N';
    data.configProdStatus = data.configProdStatus ? 'Y' : 'N';
    data.displayInTechStatus = data.displayInTechStatus ? 'Y' : 'N';
    data.filterProdStatus = data.filterProdStatus ? 'Y' : 'N';
    data.shortDescStatus = data.shortDescStatus ? 'Y' : 'N';
    data.listTblAttributeValueCommand = vTblAttributeValueCommand;
    let urlCreate = API_ROUTE.MODIFY_ATTRIBUTE;
    let callapi = await repository.post<MessageResponse<boolean>>(
      urlCreate,
      data
    );
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      onClose(load + 1);
      NotificationExtension.Success("Thao tác thành công !");
      modals.closeAll();
    }
    else if
      (callapi != null)
      NotificationExtension.Fails("Thao tác thất bại !");
    close();
  };
  const fields = vTblAttributeValueCommand?.map((_, index) => (
    <FormValueAdd idAttr={form.values.id} data={_} index={index} list={vTblAttributeValueCommand} set={setTblAttributeValueCommand} />
  ));

  const formCreate = (
    <>
      <Divider my="sm" />
      <Box
        className="flex-none"
        component="form"
        miw={1000}
        onSubmit={form.onSubmit((e: TblAttributeCommand) => {
          apiCreate(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <TextInput
          label="Tên thuộc tính: "
          placeholder="Nhập tên thuộc tính..."
          withAsterisk
          {...form.getInputProps("attributeName")}
        />
        <TextInput
          mt={"lg"}
          label="Mã thuộc tính: "
          placeholder="Nhập mã thuộc tính..."
          withAsterisk
          {...form.getInputProps("attributeCode")}
        />
        <Textarea
          label="Mô tả tóm tắt (nếu muốn hiển thị và giải thích ý nghĩa cho khách hàng)"
          placeholder="Nhập khoảng lọc giá..."
          mt="lg"
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />
        <Text fw={500} fs={'13px'}>
          Lựa chọn áp dụng
        </Text>
        <Checkbox
          mt={"xs"}
          label="Dùng là tiêu đề nhóm cho các thuộc tính đứng sau"
          checked={form.values.titleGroupStatus}
          {...form.getInputProps("titleGroupStatus")}

        />
        <Divider my="xs" variant="dotted" />
        <Checkbox
          label="Dùng lọc Sản phẩm ở danh mục"
          checked={form.values.filterProdStatus}
          {...form.getInputProps("filterProdStatus")}
        />
        <Divider my="sm" variant="dotted" />
        <Checkbox
          label="Hiển thị ở thông tin tóm tắt Sản phẩm"
          checked={form.values.shortDescStatus}
          {...form.getInputProps("shortDescStatus")}
        />
        <Divider my="sm" variant="dotted" />
        <Checkbox
          label="Hiển thị ở bảng thông số kỹ thuật"
          checked={form.values.displayInTechStatus}
          {...form.getInputProps("displayInTechStatus")}
        />
        <Divider my="sm" variant="dotted" />
        <Checkbox
          label="Dùng để tạo các cấu hình của Sản phẩm"
          checked={form.values.configProdStatus}
          {...form.getInputProps("configProdStatus")}
        />
        <TextInput
          mt={"lg"}
          label="Mã bộ lọc trên Url (v.d. cpu (trên link lọc ?cpu=32Ghz&ram=32GB)): "
          placeholder="Nhập mã bộ lọc..."
          {...form.getInputProps("filterCode")}
        />
        <Radio.Group
          name="favoriteFramework"
          label="Phân loại"
          withAsterisk
          {...form.getInputProps("attributeGroup")}
        >
          <Group mt="xs">
            <Stack>
              <Radio value="L" label="Local - Chỉ áp dụng cho một số loại Sản phẩm" />
              <Radio value="G" label="Global - Áp dụng cho tất cả Sản phẩm (v.d: Xuất xứ, Màu sắc, Bảo hành" />
            </Stack>
          </Group>
        </Radio.Group>
        <TextInput
          mt={"lg"}
          type="number"
          label="Thứ tự xuất hiện (cao xếp trước): "
          placeholder="Nhập thứ tự..."
          min={0}
          max={32000}
          {...form.getInputProps("orderNumber")}
        />


        <Text mt={"xl"} fw={500} fs={'11px'}>
          Quản lý các giá trị
        </Text>
        {fields}
        <Group justify="center" mt="md">
          <Button onClick={() => {
            let check = vTblAttributeValueCommand.filter(x => x.value === undefined || x.value === null || x.value.length < 1)
            if (check && check.length > 0) {
              NotificationExtension.Info("Có giá trị chưa được nhập !");
              return;
            }
            setTblAttributeValueCommand((prevValues) => [...prevValues, entityy]);
          }
          }>
            Thêm giá trị
          </Button>
        </Group>

        <Divider my="sm" />

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

  return <>{formCreate}</>;
};

export default EditView;
