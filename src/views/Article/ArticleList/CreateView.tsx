import {
  Box,
  Button,
  ComboboxData,
  Group,
  LoadingOverlay,
  TextInput,
  Select,
  FileInput,
  rem,
  Text,
  Textarea,
  Checkbox,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconFileCv, IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createArticleList } from "../../../api/ApiArticle";
import { ArticleList } from "../../../model/Article";
import QuillEditor from "../../../common/QuillEditor";
import { getArticleCategory } from "../../../api/ApiArticle";
import ImageShow from "../../../_base/component/_image";
import { fontWeight } from "@elastic/eui/src/themes/amsterdam/global_styling/variables/_typography";

interface CategoryList {
  catid: number;
}
interface IsImageChangeType {
  thumnail: boolean;
  imageBackground: boolean;
}

const CreateView = ({ onSearch, datas }: any) => {
  const entity = {
    type: "",
    title: "",
    videoCode: "",
    externalUrl: "",
    url: "",
    requestPath: "",
    urlHash: "",
    thumnail: "",
    imageBackground: "",
    extend: "",
    content: "",
    summary: "",
    tags: "",
    ordering: null,
    reviewRate: null,
    reviewCount: null,
    status: 2,
    visit: null,
    likeCount: null,
    isFeatured: null,
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    commentCount: null,
    commentRate: null,
    isStricking: "",
    tblArticleImageCommands: [],
    tblArticleCategoryDetModels: [],
    listCategoryId: [],
  };

  const handleChangeDataContent = (content: string | null) => {
    let modifiedString = content?.replace(
      /src="\/media/g,
      'src="https://hanoicomputercdn.com/media'
    );
    return modifiedString ? modifiedString : "";
  };

  const handleCreateArticleList = async (dataSubmit: ArticleList) => {
    console.log("ok");
    open();
    await createArticleList(dataSubmit);
    close();
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();
  const [dataOption, setDataOption] = useState<ComboboxData>();
  const [isImageChange, setIsImageChange] = useState<IsImageChangeType>({
    thumnail: false,
    imageBackground: false,
  });
  useState<ArticleList[]>();
  const [dataArcticleCategory, setDataArcticleCategory] = useState<any>();

  const icon = (
    <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const [selectedItems, setSelectedItems] = useState<CategoryList[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Hàm để đếm số từ
  const countWords = (text: any) => {
    const words = text.split(/\s+/).filter((word: any) => word !== "");
    return words.length;
  };

  // Hàm để đếm số kí tự
  const countCharacters = (text: any) => {
    return text.length;
  };

  const handleInputChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "metaTitle":
        setMetaTitle(value);
        form.setValues({ metaTitle: value });
        break;
      case "metaKeywords":
        setMetaKeywords(value);
        form.setValues({ metaKeywords: value });
        break;
      case "metaDescription":
        setMetaDescription(value);
        form.setValues({ metaDescription: value });
        break;
      case "title":
        setTitle(value);
        form.setValues({ title: value });
        break;
      case "summary":
        setSummary(value);
        form.setValues({ summary: value });
        break;
      default:
        break;
    }
  };
  const handleCheckboxChange = (catid: number) => {
    setSelectedItems((prevItems) => {
      const itemIndex = prevItems.findIndex((item) => item.catid === catid);
      if (itemIndex !== -1) {
        const newSelectedItems = [...prevItems];
        newSelectedItems.splice(itemIndex, 1);
        const newArray = newSelectedItems.map((item) => item.catid);
        form.setValues({ listCategoryId: newArray });
        return newSelectedItems;
      } else {
        const newArray = [...prevItems, { catid }];
        form.setValues({ listCategoryId: newArray.map((item) => item.catid) });
        return newArray;
      }
    });
  };

  const fetchDataArticleCategory = async () => {
    try {
      open();
      const data = await getArticleCategory("Take=50");
      if (data?.data) {
        const modifiedData = data.data.map(
          (item: { id: number; name: string; code: string }) => ({
            id: item.id,
            name: item.name,
            code: item.code,
          })
        );

        setDataArcticleCategory(modifiedData);
      }
      close();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const form = useForm<ArticleList>({
    initialValues: {
      ...entity,
    },
    validate: {
      title: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Chưa nhập loại bài viết"
          // : /[^\w\sĂăÂâẹếÀàÃãỰựsàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ]/.test(
          //     value
          //   )
          // ? "Tiêu đề không được nhập kí tự đặc biệt"
          : undefined;
      },
      // status: isNotEmpty("Chưa chọn trạng thái"),
      summary: isNotEmpty("Chưa nhập bản tóm tắt"),
      // ordering: isNotEmpty("Chưa nhập thứ tự"),
      thumnail: (value) => {
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
      imageBackground: (value) => {
        if (!value) {
          return;
        }

        if (value instanceof File) {
          const allowedExtensions = [".jpg", ".png"];
          const fileName = value.name.toLowerCase();

          if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            return "Ảnh nền phải có định dạng .jpg hoặc .png";
          }
        }
      },
      metaTitle: isNotEmpty("Chưa nhập tiêu đề meta"),
      metaKeywords: isNotEmpty("Chưa nhập từ khóa meta"),
      metaDescription: isNotEmpty("Chưa nhập mô tả meta"),
      // isStricking: isNotEmpty("Chưa nhập nổi bật"),
    },
  });
  const handleChangeImage = (file: File | null, key: string) => {
    form.getInputProps(`${key}`).onChange(file);
    setIsImageChange((prevData) => ({ ...prevData, [key]: true }));
  };
  useEffect(() => {
    fetchDataArticleCategory();
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
        miw={1300}
        maw={1500}
        mx="auto"
        onSubmit={form.onSubmit((e: ArticleList) => {
          handleCreateArticleList(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <>
          <Text size="sm" mt="sm" fw={700}>
            Danh mục (có thể chọn nhiều danh mục)
          </Text>
          <Group grow wrap="wrap" gap={"lg"}>
            <Box style={{ height: 200, overflowY: "auto", paddingTop: "5px" }}>
              {dataArcticleCategory ? (
                dataArcticleCategory.map((item: any) => (
                  <Checkbox
                    style={{ paddingTop: "5px", paddingBottom: "5px" }}
                    key={item.id}
                    label={item.name}
                    checked={selectedItems.some(
                      (selectedItem) => selectedItem.catid === item.id
                    )}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                ))
              ) : (
                <p>Không có dữ liệu danh mục</p>
              )}
            </Box>
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Tiêu đề"}
              placeholder={"Nhập tiêu đề"}
              withAsterisk
              mt="md"
              type="text"
              {...form.getInputProps("title")}
              onChange={(event) =>
                handleInputChange("title", event.target.value)
              }
            />
            <p style={{ fontSize: 12.25, paddingTop: 30 }}>
              Số từ:{" "}
              <span style={{ fontWeight: 500 }}>{countWords(title)} </span>, Số
              kí tự:{" "}
              <span style={{ fontWeight: 500 }}>{countCharacters(title)}</span>
            </p>
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <Select
              label={"Trạng thái"}
              placeholder={"Trạng thái"}
              // withAsterisk
              mt="md"
              data={[
                { value: "0", label: "Chờ duyệt" },
                { value: "1", label: "Cho hiển thị" },
                { value: "2", label: "Bản nháp" },
              ]}
              {...form.getInputProps("status")}
            />
            <TextInput
              label={"Thứ tự"}
              placeholder={"Nhập thứ tự"}
              // withAsterisk
              mt="md"
              type="number"
              {...form.getInputProps("ordering")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <Select
              label={"Nổi bật"}
              placeholder={"Nhập nổi bật"}
              // withAsterisk
              mt="md"
              data={[
                { value: "Y", label: "Nổi bật" },
                { value: "N", label: "Không nổi bật" },
              ]}
              {...form.getInputProps("isStricking")}
            />
            <TextInput
              label={"Mã video"}
              placeholder={"Nhập mã video"}
              mt="md"
              type="text"
              {...form.getInputProps("videoCode")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Url ngoại tuyến"}
              placeholder={"Nhập url ngoại tuyến"}
              mt="md"
              type="text"
              {...form.getInputProps("externalUrl")}
            />
            <TextInput
              label={"Url"}
              placeholder={"Nhập url"}
              mt="md"
              type="text"
              {...form.getInputProps("url")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Đường dẫn yêu cầu"}
              placeholder={"Nhập đường dẫn yêu cầu"}
              mt="md"
              type="text"
              {...form.getInputProps("requestPath")}
            />
            <TextInput
              label={"Băm Url"}
              placeholder={"Nhập băm Url"}
              mt="md"
              type="text"
              {...form.getInputProps("urlHash")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <FileInput
              leftSection={icon}
              label={"Hình thu nhỏ"}
              placeholder={"Nhập hình thu nhỏ"}
              withAsterisk
              accept="image/png,image/jpeg"
              clearable
              mt="md"
              {...form.getInputProps("thumnail")}
              onChange={(file) => handleChangeImage(file, "thumnail")}
            />
            <FileInput
              leftSection={icon}
              label={"Hình nền"}
              placeholder={"Nhập hình nền"}
              accept="image/png,image/jpeg"
              clearable
              mt="md"
              {...form.getInputProps("imageBackground")}
              onChange={(file) => handleChangeImage(file, "imageBackground")}
            />
          </Group>

          <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
            {form.values.thumnail ? (
              <ImageShow
                h={200}
                w={200}
                img={
                  form.values.thumnail instanceof File
                    ? URL.createObjectURL(form.values.thumnail)
                    : form.values.thumnail
                }
              />
            ) : (
              <Box></Box>
            )}
            {form.values.imageBackground ? (
              <ImageShow
                h={200}
                w={200}
                img={
                  form.values.imageBackground instanceof File
                    ? URL.createObjectURL(form.values.imageBackground)
                    : form.values?.imageBackground
                }
              />
            ) : (
              <Box></Box>
            )}
          </Group>

          <Textarea
            label={"Tóm tắt"}
            placeholder={"Nhập tóm tắt"}
            withAsterisk
            mt="md"
            {...form.getInputProps("summary")}
            onChange={(event) =>
              handleInputChange("summary", event.target.value)
            }
          />
          <p style={{ fontSize: 12.25 }}>
            Số từ:{" "}
            <span style={{ fontWeight: 500 }}>{countWords(summary)} </span>, Số
            kí tự:{" "}
            <span style={{ fontWeight: 500 }}>{countCharacters(summary)}</span>
          </p>
          <Text size="sm" mt="sm" fw={500}>
            Nội dung
          </Text>
          <QuillEditor
            toolbarId="t1"
            setValue={setValue}
            onChangeValue={(html: string) =>
              (form.values.content = handleChangeDataContent(html))
            }
            description={handleChangeDataContent(form.values.content)}
          />
          <Group grow wrap="wrap" gap={"lg"}>
            <Textarea
              label={"Tags (Mỗi cụm từ 1 dòng)"}
              placeholder={"Nhập tags"}
              mt="md"
              {...form.getInputProps("tags")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Tỷ lệ đánh giá"}
              placeholder={"Nhập tỷ lệ đánh giá"}
              mt="md"
              type="number"
              {...form.getInputProps("reviewRate")}
            />
            <TextInput
              label={"Số lượt đánh giá"}
              placeholder={"Nhập số lượt đánh giá"}
              mt="md"
              type="number"
              {...form.getInputProps("reviewCount")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Số lượt thích"}
              placeholder={"Nhập số lượt thích"}
              mt="md"
              type="number"
              {...form.getInputProps("likeCount")}
            />
            <TextInput
              label={"Lượt xem"}
              placeholder={"Nhập lượt xem"}
              mt="md"
              type="number"
              {...form.getInputProps("visit")}
            />
          </Group>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Số lượt bình luận"}
              placeholder={"Nhập số lượt bình luận"}
              mt="md"
              type="number"
              {...form.getInputProps("commentCount")}
            />
            <TextInput
              label={"Tỷ lệ bình luận"}
              placeholder={"Nhập tỷ lệ bình luận"}
              mt="md"
              type="number"
              {...form.getInputProps("commentRate")}
            />
          </Group>
          <Text size="sm" mt="sm" fw={700}>
            Dùng cho SEO
          </Text>
          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Tiêu đề Meta"}
              placeholder={"Nhập tiêu đề meta"}
              withAsterisk
              {...form.getInputProps("metaTitle")}
              onChange={(event) =>
                handleInputChange("metaTitle", event.target.value)
              }
            />
            <p style={{ fontSize: 12.25, paddingTop: 20 }}>
              Số từ:{" "}
              <span style={{ fontWeight: 500 }}>{countWords(metaTitle)} </span>,
              Số kí tự:{" "}
              <span style={{ fontWeight: 500 }}>
                {countCharacters(metaTitle)}
              </span>
            </p>
          </Group>

          <Group grow wrap="wrap" gap={"lg"}>
            <TextInput
              label={"Từ khóa Meta"}
              placeholder={"Nhập từ khóa meta"}
              withAsterisk
              {...form.getInputProps("metaKeywords")}
              onChange={(event) =>
                handleInputChange("metaKeywords", event.target.value)
              }
            />
            <p style={{ fontSize: 12.25, paddingTop: 20 }}>
              Số từ:{" "}
              <span style={{ fontWeight: 500 }}>
                {countWords(metaKeywords)}{" "}
              </span>
              , Số kí tự:{" "}
              <span style={{ fontWeight: 500 }}>
                {countCharacters(metaKeywords)}
              </span>
            </p>
          </Group>

          <Textarea
            label={"Mô tả Meta"}
            placeholder={"Nhập mô tả meta"}
            withAsterisk
            {...form.getInputProps("metaDescription")}
            onChange={(event) =>
              handleInputChange("metaDescription", event.target.value)
            }
          />
          <p style={{ fontSize: 12.25 }}>
            Số từ:{" "}
            <span style={{ fontWeight: 500 }}>
              {countWords(metaDescription)}{" "}
            </span>
            , Số kí tự:{" "}
            <span style={{ fontWeight: 500 }}>
              {countCharacters(metaDescription)}
            </span>
            <span style={{ fontWeight: 500 }}> (Khuyến nghị: 160 ký tự)</span>
          </p>
        </>

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
