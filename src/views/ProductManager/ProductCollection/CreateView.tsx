import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import QuillEditor from "../../../common/QuillEditor";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { TblCollection } from "../../../model/TblComboSetCollection";
import { useEffect, useState } from "react";
import {
  createCollection,
  getListCollection,
} from "../../../api/ApiCollection";

const CreateView = ({ onSearch }: any) => {
  const entity = {
    id: 0,
    title: "",
    config: "",
    description: "",
    status: "",
    fromTime: "",
    toTime: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdatedBy: "",
    creationDate: "",
    parentId: null,
    metaTitle: "",
    metaKeyword: "",
    metaDescription: "",
    tblComboSetCollectionModels: [],
    tblComboSetCollectionProdModels: [],
    tblComboSetCollectionCommands: [],
    tblComboSetCollectionProdCommands: [],
  };
  const handleChangeDataContent = (content: string | null) => {
    let modifiedString = content?.replace(
      /src="\/media/g,
      'src="https://hanoicomputercdn.com/media'
    );
    return modifiedString ? modifiedString : "";
  };
  const handleCreateCollection = async (dataSubmit: TblCollection) => {
    open();
    await createCollection(dataSubmit);
    close();
    modals.closeAll();
    onSearch();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [value, setValue] = useState();
  const [dataCollection, setDataCollection] = useState<TblCollection[]>([]);
  const [dataOptionCollection, setDataOptionCollection] = useState<any[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeyword, setMetaKeyword] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const isValidConfigFormat = (config: string): boolean => {
    const regex = /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return regex.test(config);
  };
  const form = useForm<TblCollection>({
    initialValues: {
      ...entity,
    },
    validate: {
      title: isNotEmpty("Chưa nhập tên bộ sưu tập"),
      metaTitle: isNotEmpty("Chưa nhập tiêu đề meta"),
      metaKeyword: isNotEmpty("Chưa nhập từ khóa meta"),
      metaDescription: isNotEmpty("Chưa nhập mô tả meta"),
      status: isNotEmpty("Chưa chọn trạng thái !"),
      config: (value: string | null | undefined) => {
        return !value || /^\s*$/.test(value)
          ? "Link chưa nhập"
          : !/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
          ? "Giá trị của Link phải theo định dạng /aa-bb-cc"
          : undefined;
      },
    },
  });
  const loadDataCollection = async () => {
    setDataCollection([]);
    const data = await getListCollection("Active=true&Skip=0&Take=1000");
    setDataCollection(data?.data);
  };
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
      case "metaKeyword":
        setMetaKeyword(value);
        form.setValues({ metaKeyword: value });
        break;
      case "metaDescription":
        setMetaDescription(value);
        form.setValues({ metaDescription: value });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    loadDataCollection();
  }, []);

  useEffect(() => {
    setDataOptionCollection(
      dataCollection.map((option) => {
        if (option.status === "A")
          return { value: option.id.toString(), label: option.title };
        else
          return {
            value: option.id.toString(),
            label: option.title,
          };
      })
    );
  }, [dataCollection]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1000}
        maw={1000}
        mx="auto"
        onSubmit={form.onSubmit((e: TblCollection) => {
          handleCreateCollection(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên bộ sưu tập"}
            placeholder={"Nhập tên bộ sưu tập"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("title")}
          />
          <TextInput
            label={"Link"}
            placeholder={"Nhập link"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("config")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Trạng thái"}
            placeholder={"Nhập trạng thái"}
            withAsterisk
            mt="md"
            data={[
              { value: "I", label: "Ẩn" },
              { value: "A", label: "Hiện" },
            ]}
            {...form.getInputProps("status")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Là con của"}
            placeholder={"chọn bộ sưu tập cha"}
            clearable
            data={dataOptionCollection}
            nothingFoundMessage="Không có dữ liệu"
            value={form.values.parentId?.toString()}
            onChange={(e) => (form.values.parentId = Number(e))}
          />
        </Group>
        
        <Text size="sm" mt="sm" fw={500}>
          Nội dung
        </Text>
        <QuillEditor
          toolbarId="t1"
          setValue={setValue}
          onChangeValue={(html: string) =>
            (form.values.description = handleChangeDataContent(html))
          }
          description={handleChangeDataContent(form.values.description)}
        />

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
            {...form.getInputProps("metaKeyword")}
            onChange={(event) =>
              handleInputChange("metaKeyword", event.target.value)
            }
          />
          <p style={{ fontSize: 12.25, paddingTop: 20 }}>
            Số từ:{" "}
            <span style={{ fontWeight: 500 }}>{countWords(metaKeyword)} </span>,
            Số kí tự:{" "}
            <span style={{ fontWeight: 500 }}>
              {countCharacters(metaKeyword)}
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
