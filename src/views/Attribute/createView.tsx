import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  LoadingOverlay,
  Radio,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../_base/extension/StringExtension";
import Repository from "../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../const/apiRoute";
import { MessageResponse } from "../../model/MessageResponse";
import { TblAttributeCommand } from "../../model/TblAttributeCommand";
import { _validate } from "../../validate/TblAttributeCommandValidator";
const CreateView = function ({
  onClose,
  load,
}: {
  onClose: any;
  load: number;
}) {
  const entity: TblAttributeCommand = {
    id: 0,
    attributeCode: null,
    attributeName: null,
    filterCode: null,
    description: null,
    orderNumber: 0,
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
    listTblAttributeValueCommand: null,
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
  const icon = (
    <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  useEffect(() => {
    callApiGetData();
  }, []);

  const callApiGetData = async () => {
    open();
    let urlCreate = API_ROUTE.CREATE_ATTRIBUTE;
    let callapi = await repository.get<MessageResponse<TblAttributeCommand>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        form.setValues(dataApi);
        form.resetDirty(dataApi);
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };
  const apiCreate = async (data: TblAttributeCommand) => {
    open();
    let urlCreate = API_ROUTE.CREATE_ATTRIBUTE;
    let callapi = await repository.post<MessageResponse<boolean>>(
      urlCreate,
      data
    );
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      onClose(load + 1);
      NotificationExtension.Success("Thêm thành công !");
      modals.closeAll();
    } else if (callapi != null) NotificationExtension.Fails("Thêm thất bại !");
    close();
  };

  const formCreate = (
    <>
      <Divider my="sm" />
      <Box
        className="flex-none"
        component="form"
        miw={600}
        mx="auto"
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
        <Text fw={500} fs={"13px"}>
          Lựa chọn áp dụng
        </Text>
        <Checkbox
          mt={"xs"}
          label="Dùng là tiêu đề nhóm cho các thuộc tính đứng sau"
          onChange={(e) => {
            form.values.titleGroupStatus = e.target.checked ? "Y" : "N";
          }}
        />
        <Divider my="xs" variant="dotted" />
        <Checkbox
          label="Dùng lọc Sản phẩm ở danh mục"
          onChange={(e) => {
            form.values.filterProdStatus = e.target.checked ? "Y" : "N";
          }}
        />
        <Divider my="sm" variant="dotted" />
        <Checkbox
          label="Hiển thị ở thông tin tóm tắt Sản phẩm"
          onChange={(e) => {
            form.values.shortDescStatus = e.target.checked ? "Y" : "N";
          }}
        />
        <Divider my="sm" variant="dotted" />
        <Checkbox
          label="Hiển thị ở bảng thông số kỹ thuật"
          onChange={(e) => {
            form.values.displayInTechStatus = e.target.checked ? "Y" : "N";
          }}
        />
        <Divider my="sm" variant="dotted" />
        <Checkbox
          label="Dùng để tạo các cấu hình của Sản phẩm"
          onChange={(e) => {
            form.values.configProdStatus = e.target.checked ? "Y" : "N";
          }}
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
              <Radio
                value="L"
                label="Local - Chỉ áp dụng cho một số loại Sản phẩm"
              />
              <Radio
                value="G"
                label="Global - Áp dụng cho tất cả Sản phẩm (v.d: Xuất xứ, Màu sắc, Bảo hành"
              />
            </Stack>
          </Group>
        </Radio.Group>
        <TextInput
          mt={"lg"}
          label="Thứ tự xuất hiện (cao xếp trước): "
          placeholder="Nhập thứ tự..."
          min={0}
          max={32000}
          {...form.getInputProps("orderNumber")}
        />
        <Divider my="sm" />
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

  return <>{formCreate}</>;
};

export default CreateView;
