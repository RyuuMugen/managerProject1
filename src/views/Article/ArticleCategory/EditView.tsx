import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
  ComboboxData,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Repository from "../../../_base/helper/HttpHelper";
import { modifyArticleCategory } from "../../../api/ApiArticle";
import QuillEditor from "../../../common/QuillEditor";
import { ArticleCategory } from "../../../model/Article";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const ShowType = [
  { value: "1", label: "Chỉ hiển thị danh mục con" },
  { value: "2", label: "Chỉ hiển thị bài" },
  { value: "3", label: "Hiển thị bài + Danh mục con " },
];

const EditView = ({ onSearch, id, datas }: any) => {
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
    await modifyArticleCategory(dataSubmit);

    onSearch();
    modals.closeAll();
  };

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();

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
      // type: isNotEmpty("Loại Chưa Nhập"),
      // orderNumber: isNotEmpty("Số thứ tự chưa nhập"),
      metaTitle: isNotEmpty("Tiêu đề meta chưa nhập"),
      metaKeyword: isNotEmpty("Từ khóa meta chưa nhập"),
      metaDescription: isNotEmpty("Mô tả meta chưa nhập"),
      // note: isNotEmpty("Ghi chú chưa nhập"),
      // parentId: isNotEmpty("Chưa Chọn Danh Mục Con"),
    },
  });

  useEffect(() => {
    const callApiGetData = async () => {
      open();
      const urlDetail = `/TblArticleCategory/details?id=` + id;
      let callApi = await repository.post<MessageResponse<ArticleCategory>>(
        urlDetail
      );
      if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
        const dataApi = callApi?.data;
        if (dataApi != null && !isNullOrUndefined(dataApi)) {
          form.setValues(dataApi);
        } else {
          NotificationExtension.Fails("Dữ liệu không tồn tại");
          modals.closeAll();
        }
        close();
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
        modals.closeAll();
      }
    };
    if (id || id === 0) {
      callApiGetData();
    }
  }, [id]);

  const [dataOption, setDataOption] = useState<ComboboxData>();

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
          // onChangeValue={(html: string) => (form.values.description = html)}
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
            searchable
            // withAsterisk
            data={dataOption}
            value={form.values.parentId?.toString()}
            // {...form.getInputProps("parentId")}
            onChange={(e) => (form.values.parentId = Number(e))}
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

type DataProvince = {
  provinceCode: string;
  provinceName: string;
};

export default EditView;
