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
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import {
  createFixedContent,
  getDataFixedContentType,
} from "../../../api/ApiContent";
import QuillEditor from "../../../common/QuillEditor";
import {
  tblFixedContent,
  tblFixedContentType,
} from "../../../model/FixedContent";

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
    title: "",
    linkIndex: "",
    description: "",
    image: "",
    contentTypeId: null,
    templateContent: "",
    content: "",
    status: null,
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

  const handleCreateFixedContent = async (dataSubmit: tblFixedContent) => {
    open();
    await createFixedContent(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();
  useState<tblFixedContent[]>();

  const form = useForm<tblFixedContent>({
    initialValues: {
      ...entity,
    },
    validate: {
      title: isNotEmpty("Tên chưa chưa nhập"),
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
      linkIndex: isNotEmpty("Link chưa nhập"),
      status: isNotEmpty("Trạng thái chưa nhập"),
      contentTypeId: isNotEmpty("Nhóm danh mục chưa chọn"),
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
        if (option.status === "A")
          return { value: option.id.toString(), label: option.name };
        else
          return {
            value: option.id.toString(),
            label: option.name,
            disabled: true,
          };
      })
    );
  }, [dataFixedContentType]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={950}
        maw={950}
        mx="auto"
        onSubmit={form.onSubmit((e: tblFixedContent) => {
          handleCreateFixedContent(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tiêu đề nội dung"}
            placeholder={"Nhập tiêu đề"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("title")}
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
          <TextInput
            label={"Link Index"}
            placeholder={"Nhập link trang bài viết"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("linkIndex")}
          />
          <Select
            mt="md"
            label="Nhóm danh mục:"
            placeholder="Chọn danh mục"
            data={dataOptionFixedContentType}
            searchable
            withAsterisk
            value={form.values.contentTypeId?.toString()}
            onChange={(e) => (form.values.contentTypeId = Number(e))}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Nội dung tóm tắt (nếu có)"}
            placeholder={"Nhập tóm tắt"}
            mt="md"
            {...form.getInputProps("description")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <FileInput
            leftSection={icon}
            label={"Ảnh đại diện"}
            placeholder={"Chọn ảnh"}
            accept="image/png,image/jpeg"
            withAsterisk
            clearable
            mt="md"
            mb="md"
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

        <Text size="sm" mt="sm" fw={500}>
          Nội dung chi tiết
        </Text>
        <Group display={"flex"}>
          <Text>Hiển thị nội dung từ template: </Text>
          <TextInput type="text" {...form.getInputProps("templateContent")} />
          <Text>
            (* phải nằm trong thư mục static/, chỉ chấp nhận ký tự a-z0-9 và _)
          </Text>
        </Group>

        <QuillEditor
          toolbarId="t1"
          setValue={setValue}
          onChangeValue={(html: string) => (form.values.content = html)}
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
