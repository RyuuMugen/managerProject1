import {
  Box,
  Button,
  ComboboxData,
  FileInput,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import {
  createFixedContentType,
  getDataFixedContentType,
} from "../../../api/ApiContent";
import QuillEditor from "../../../common/QuillEditor";
import { tblFixedContentType } from "../../../model/FixedContent";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const CreateView = ({ onSearch }: any) => {
  const [dataFixedContentType, setDataFixedContentType] = useState<
    tblFixedContentType[]
  >([]);
  const [dataOptionFixedContentType, setDataOptionFixedContentType] = useState<
    any[]
  >([]);
  const entity = {
    id: 0,
    name: "",
    description: "",
    image: "",
    parentId: null,
    status: null,
    orderNumber: null,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    creationDate: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdatedBy: "",
  };

  const loadDataFixedContentType = async () => {
    setDataFixedContentType([]);
    const data = await getDataFixedContentType("Active=true&Skip=0&Take=1000");
    setDataFixedContentType(data?.data);
  };

  const handleCreateFixedContentType = async (
    dataSubmit: tblFixedContentType
  ) => {
    open();
    await createFixedContentType(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();
  const [dataOption, setDataOption] = useState<ComboboxData>();
  useState<tblFixedContentType[]>();

  const form = useForm<tblFixedContentType>({
    initialValues: {
      ...entity,
    },
    validate: {
      name: isNotEmpty("Tên chưa chưa nhập"),
      image: (value) => {
        if (value) {
          if (value instanceof File) {
            const allowedExtensions = [".jpg", ".png"];
            const fileName = value.name.toLowerCase();

            if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
              return "Ảnh phải có dạng .jpg hoặc .png";
            }
          }
        } else return "Chưa nhập ảnh";
      },
      status: isNotEmpty("Trạng thái chưa nhập"),
      orderNumber: isNotEmpty("Số thứ tự chưa nhập"),
      metaTitle: isNotEmpty("Tiêu đề meta chưa nhập"),
      metaKeyword: isNotEmpty("Từ khóa meta chưa nhập"),
      metaDescription: isNotEmpty("Mô tả meta chưa nhập"),
    },
  });

  useEffect(() => {
    loadDataFixedContentType();
  }, []);

  useEffect(() => {
    setDataOptionFixedContentType(
      dataFixedContentType.map((option) => {
        return { value: option.id.toString(), label: option.name };
      })
    );
  }, [dataFixedContentType]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: tblFixedContentType) => {
          handleCreateFixedContentType(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên danh mục nội dung"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("name")}
          />
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
          <Select
            mt="lg"
            label="Là danh mục con của :"
            placeholder="Chọn danh mục cha"
            data={dataOptionFixedContentType}
            mb={"lg"}
            searchable
            value={form.values.parentId?.toString()}
            onChange={(e) => (form.values.parentId = Number(e))}
          />
          <NumberInput
            label={"Thứ tự xuất hiện (cao xếp trước)"}
            placeholder={""}
            withAsterisk
            {...form.getInputProps("orderNumber")}
          />
        </Group>

        <Text size="sm" mt="sm" fw={500}>
          Tóm tắt (nếu có)
        </Text>
        <QuillEditor
          toolbarId="t1"
          setValue={setValue}
          onChangeValue={(html: string) => (form.values.description = html)}
        />

        <Text size="sm" mt="sm" fw={700}>
          Dùng cho SEO
        </Text>

        <TextInput
          label={"Meta Title"}
          placeholder={""}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("metaTitle")}
        />
        <TextInput
          label={"Meta Keyword"}
          placeholder={""}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("metaKeyword")}
        />
        <TextInput
          label={"Meta Description"}
          placeholder={""}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("metaDescription")}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
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
