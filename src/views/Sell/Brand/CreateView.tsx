import {
  Box,
  Button,
  FileInput,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv, IconX } from "@tabler/icons-react";
import { useState } from "react";
import "@mantine/dates/styles.css";
import { TblBrandCommand } from "../../../model/TblBrandCommand";
import { API_ROUTE } from "../../../const/apiRoute";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { hasLength, isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import Repository from "../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../model/MessageResponse";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import ImageShow from "../../../_base/component/_image";

const CreateView = ({ onClose, load }: { onClose: any; load: number }) => {
  const icon = (
    <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  const entity: TblBrandCommand = {
    id: 0,
    brandIndex: null,
    name: null,
    summary: null,
    image: null,
    product: null,
    status: null,
    isFeatured: null,
    ordering: null,
    letter: null,
    brandPageView: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    metaTitle: null,
    metaKeywords: null,
    metaDescription: null,
    description: null,
    priorityStatus: null,
  };

  const form = useForm<TblBrandCommand>({
    initialValues: {
      ...entity,
    },

    validate: {
      name: hasLength({ min: 2, max: 100 }, "Tên phải chưa từ 2-100 kí tự !"),
      brandIndex: (value: string | null) => {
        if (value && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
          return "Link không hợp lệ!";
        }

        return undefined; // Trường hợp hợp lệ hoặc giá trị rỗng
      },
      image: (value) => {
        if (value) {
          if (value instanceof File) {
            const allowedExtensions = [".jpg", ".png"];
            const fileName = value.name.toLowerCase();

            if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
              return "Logo phải có dạng .jpg hoặc .png";
            }
          }
        } else return "Chưa nhập logo thương hiệu";
      },
      letter: (value) => {
        if (value && value.length > 2) {
          return "Lời nhắn tối đa 2 ký tự";
        }
      },
    },
  });

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [isContinue, setIsContinue] = useState(true);

  const handleCreatePayment = async (data: TblBrandCommand) => {
    open();
    let success = false;
    let urlCreate = API_ROUTE.CREATE_BRAND;
    let callapi = await repository.post<MessageResponse<boolean>>(
      urlCreate,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
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
    if (!isContinue && success == true) modals.closeAll();
  };

  const formCreate = (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: TblBrandCommand) => {
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
            label={"Tên thương hiệu"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("name")}
          />

          <TextInput
            label={"Link Web"}
            placeholder={"Nhập link"}
            mt="md"
            type="text"
            {...form.getInputProps("brandIndex")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Thứ tự xuất hiện"}
            placeholder={"Nhập thứ tự"}
            mt="md"
            type="number"
            {...form.getInputProps("ordering")}
          />

          <Select
            label={"Nổi bật"}
            placeholder={"Nhập"}
            mt="md"
            data={[
              { value: "A", label: "Priority" },
              { value: "I", label: "NonePriority" },
            ]}
            {...form.getInputProps(" isFeatured")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Số lượng view"}
            placeholder={"Nhập số lượng"}
            mt="md"
            type="number"
            {...form.getInputProps("brandPageView")}
          />

          <TextInput
            label={"Số lượng sản phẩm"}
            placeholder={"Nhập số lượng"}
            mt="md"
            type="number"
            {...form.getInputProps("product")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Lời nhắn"}
            placeholder={"Nhập lời nhắn"}
            mt="md"
            type="text"
            {...form.getInputProps("letter")}
          />

          <TextInput
            label={"Mô tả"}
            placeholder={"Mô tả"}
            mt="md"
            type="text"
            {...form.getInputProps("description")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <FileInput
            leftSection={icon}
            label={"Logo thương hiệu"}
            placeholder={"Chọn logo"}
            accept="image/png,image/jpeg"
            withAsterisk
            clearable
            mt="md"
            {...form.getInputProps("image")}
          />
          {form.values.image ? (
            <ImageShow
              h={200}
              w={300}
              img={
                form.values.image instanceof File
                  ? URL.createObjectURL(form.values.image)
                  : form.values.image
              }
            />
          ) : (
            <Box></Box>
          )}
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Mô tả tóm tắt"}
            placeholder={"Nhập tóm tắt"}
            autosize
            minRows={3}
            mt="md"
            {...form.getInputProps("summary")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Trạng thái"}
            placeholder={"Trạng thái"}
            mt="md"
            data={["Active", "Inactive"]}
            {...form.getInputProps("status")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Text fz={17} fw={700}>
            Dùng cho SEO
          </Text>
        </Group>
        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label={"Meta Title"}
            placeholder={"Nhập title"}
            mt="md"
            type="text"
            {...form.getInputProps("metaTitle")}
          />

          <TextInput
            label={"Meta Keywords"}
            placeholder={"Nhập Keywords"}
            mt="md"
            type="text"
            {...form.getInputProps("metaKeywords")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Meta Description"}
            placeholder={"Nhập Description"}
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

  return <>{formCreate}</>;
};

export default CreateView;
