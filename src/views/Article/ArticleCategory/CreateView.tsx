import {
  Box,
  Button,
  ComboboxData,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createArticleCategory } from "../../../api/ApiArticle";
import QuillEditor from "../../../common/QuillEditor";
import { ArticleCategory } from "../../../model/Article";

const ShowType = [
  { value: "1", label: "Chỉ hiển thị danh mục con" },
  { value: "2", label: "Chỉ hiển thị bài" },
  { value: "3", label: "Hiển thị bài + Danh mục con " },
];

const CreateView = ({ onSearch, datas }: any) => {
  const entity = {
    name: "",
    code: "",
    linkIndex: "",
    description: "",
    // imageUrl: "",
    parentId: null,
    status: null,
    type: "",
    orderNumber: null,
    creationDate: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdatedBy: "",
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    note: "",
  };

  const handleChangeDatadescription = (description: string | null) => {
    let modifiedString = description?.replace(
      /src="\/media/g,
      'src="https://hanoicomputercdn.com/media'
    );
    return modifiedString ? modifiedString : "";
  };

  const handleCreateArticleCategory = async (dataSubmit: ArticleCategory) => {
    await createArticleCategory(dataSubmit);
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();
  const [dataOption, setDataOption] = useState<ComboboxData>();
  useState<ArticleCategory[]>();

  const form = useForm<ArticleCategory>({
    initialValues: {
      ...entity,
    },
    validate: {
      code: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Mã Danh Mục Bài Viết chưa nhập"
          : value.length > 50
          ? "Mã Danh Mục Bài Viết không được vượt quá 50 ký tự"
          : // : !/^[a-zA-Z0-9\sàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ]+$/u.test(
            //   value
            // )
            // ? "Tên Danh Mục Bài Viết không được chứa kí tự đặc biệt"
            // : !/^\d+$/.test(value)
            // ? "Mã Danh Mục Bài Viết chỉ được nhập số"
            undefined;
      },
      name: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Tên Danh Mục Bài Viết chưa nhập"
          : // : !/^[a-zA-Z0-9\sàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ]+$/u.test(
            //     value
            //   )
            // ? "Tên Danh Mục Bài Viết không được chứa kí tự đặc biệt"
            undefined;
      },

      // linkIndex: isNotEmpty("Link Index chưa nhập"),
      // imageUrl: isNotEmpty("URL ảnh chưa nhập"),
      // status: isNotEmpty("Trạng thái chưa nhập"),
      // type: isNotEmpty("Loại chưa nhập"),
      // orderNumber: isNotEmpty("Số thứ tự chưa nhập"),
      metaTitle: isNotEmpty("Tiêu đề meta chưa nhập"),
      metaKeyword: isNotEmpty("Từ khóa meta chưa nhập"),
      metaDescription: isNotEmpty("Mô tả meta chưa nhập"),
      // note: isNotEmpty("Ghi chú chưa nhập"),
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
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: ArticleCategory) => {
          handleCreateArticleCategory(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên danh mục bài viết"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("name")}
          />
          <Select
            label={"Trạng thái"}
            placeholder={"Trạng thái"}
            // withAsterisk
            mt="md"
            data={[
              { value: "Y", label: "Hoạt động" },
              { value: "N", label: "Không hoạt động" },
            ]}
            {...form.getInputProps("status")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Mã danh mục bài viết"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("code")}
          />
          <TextInput
            label={"Link Index"}
            placeholder={"Nhập link trang bài viết"}
            // withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("linkIndex")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tóm tắt"}
            placeholder={"Nhập tóm tắt"}
            // withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("note")}
          />
        </Group>

        <Text size="sm" mt="sm" fw={500}>
          Mô tả chi tiết (nếu có)
        </Text>
        <QuillEditor
          toolbarId="t1"
          setValue={setValue}
          onChangeValue={(html: string) =>
            (form.values.description = handleChangeDatadescription(html))
          }
          description={handleChangeDatadescription(form.values.description)}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          {/* <TextInput
            label={"Link ảnh đại diện"}
            placeholder={"Nhập link"}
            withAsterisk
            type="text"
            {...form.getInputProps("imageUrl")}
          /> */}

          <Select
            mt={"lg"}
            label="Là danh mục con của :"
            placeholder="Chọn danh mục cha"
            data={dataOption}
            searchable
            {...form.getInputProps("parentId")}
            mb={"lg"}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            mt={"lg"}
            label="Loại nội dung hiển thị"
            placeholder=""
            data={ShowType}
            searchable
            // withAsterisk
            {...form.getInputProps("type")}
            mb={"lg"}
          />
          <NumberInput
            label={"Thứ tự xuất hiện (cao xếp trước)"}
            placeholder={""}
            // withAsterisk
            {...form.getInputProps("orderNumber")}
          />
        </Group>

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
            leftSection={<IconCheck size={18} />}
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
