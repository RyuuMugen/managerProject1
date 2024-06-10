import {
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Divider,
  FileInput,
  Group,
  LoadingOverlay,
  MultiSelect,
  Select,
  Tabs,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  rem,
  useCombobox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv } from "@tabler/icons-react";
import { ReactElement, useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import {
  formatFormData,
  urlToImageFile,
} from "../../../_base/helper/FunctionHelper";
import Repository from "../../../_base/helper/HttpHelper";
import { datavisibleType } from "../../../_data-fix/datavisibleType";
import QuillEditor from "../../../common/QuillEditor";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import {
  TblCategoryModel,
  listTblCategoryAttribute,
  listTblCategoryImage,
} from "../../../model/TblCategoryModel";
import { _validate } from "../../../validate/TblCategoryModelValidate";
import ListTblCategoryImageView from "./ListTblCategoryImageView";
import { getDataBrand } from "../../../api/ApiSell";
import { Brand } from "../../../model/ProductList";
import ListTblCategoryAttributeView from "./ListTblCategoryAttributeView";
import { CategoryTree } from "../../../model/TblCategoryCommand";
import {
  modifyMegaMenuGet,
  modifyMegaMenuPost,
} from "../../../api/ApiMegaMenu";
const EditView = function ({
  id,
  onClose,
  load,
}: {
  id: number;
  onClose: any;
  load: number;
}) {
  const entity: TblCategoryModel = {
    id: id,
    categoryCode: null,
    categoryName: "",
    idParent: null,
    description: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    isBuildPc: null,
    isMegaMenu: null,
    lastUpdatedBy: null,
    lastUpdateLogin: null,
    orgId: null,
    categoryType: null,
    content: null,
    tags: null,
    imageIcon: null,
    imageOwner: null,
    priceRange: null,
    visibleType: null,
    fixedContent: null,
    orderedNumber: null,
    urlRedirect: null,
    templateFile: null,
    visibleItemQty: null,
    urlCanonicalForSeo: null,
    linkForSeo: null,
    idexForSeo: null,
    enableChangeLink: null,
    metaTitle: null,
    metaKeyword: null,
    metaDescription: null,
    itemCount: 0,
    tblCategoryModels: [],
    categoryTreeModels: [],
    tblCategoryAttributeModel: null,
    tblCategoryImageModels: null,
    listTblCategoryImage: null,
    listTblCategoryAttribute: [],
    status: null,
    priorityStatus: null,
    brandIds: [],
  };
  const form = useForm<TblCategoryModel>({
    initialValues: {
      ...entity,
    },

    validate: _validate,
  });

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const icon = (
    <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  const [Urlcanonical, setUrlcanonical] = useState<string>(
    `Url canonical ${0} ký tự,${0} từ :`
  );
  const [MetaKeywords, setMetaKeywords] = useState<string>(
    `Meta Keywords ${0} ký tự,${0} từ :`
  );
  const [modal, setModel] = useState("");
  const [valueTags, setValueTags] = useState<string[]>([]);
  const [iconimage, seticonimage] = useState<string>("");
  const [isImageChange, setIsImageChange] = useState<boolean[]>([]);
  const [isCategoryImageChange, setIsCategoryImageChange] = useState(false);
  const [dataBrand, setDataBrand] = useState<Brand[]>([]);
  const [owen, setowen] = useState<string>("");

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });
  const [dataDrop, setDataDrop] = useState<ComboboxItem[]>([]);
  const [dataCategory, setDataCategory] = useState<CategoryTree[]>([]);
  const _datavisibleType = datavisibleType;
  const callApiGetData = async () => {
    open();
    let urlCreate = `?id=${id}`;
    let callapi = await modifyMegaMenuGet(urlCreate);
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        if (
          dataApi.imageIcon !== null &&
          dataApi.imageIcon !== undefined &&
          typeof dataApi.imageIcon == "string"
        ) {
          seticonimage(dataApi.imageIcon);
          dataApi.imageIcon = await urlToImageFile(dataApi.imageIcon);
        }
        if (
          dataApi.imageOwner !== null &&
          dataApi.imageOwner !== undefined &&
          typeof dataApi.imageOwner == "string"
        ) {
          setowen(dataApi.imageOwner);
          dataApi.imageOwner = await urlToImageFile(dataApi.imageOwner);
        }
        const {
          tblCategoryImageModels,
          tblCategoryAttributeModel,
          ...restGroup
        } = dataApi;
        form.setValues({
          ...restGroup,
          listTblCategoryImage: tblCategoryImageModels,
          listTblCategoryAttribute: tblCategoryAttributeModel || [],
        });
        form.resetDirty(dataApi);
        GetUrlcanonical(dataApi.urlCanonicalForSeo ?? "");
        GetMetaKeywords(dataApi.metaKeyword ?? "");
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  const apiCreate = async (data: any) => {
    open();

    data.tags = valueTags.join(",");

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "listTblCategoryImage") {
        const listTblCategoryImage = data[key];
        listTblCategoryImage?.forEach((item: any, index: number) => {
          Object.keys(item).forEach((itemKey) => {
            const formDataKey = `listTblCategoryImage[${index}].${itemKey}`;
            if (item[itemKey]) {
              formData.append(formDataKey, item[itemKey]);
            }
          });
        });
      } else if (key === "brandIds") {
        const brandIds = data[key];
        brandIds.forEach((item: any, index: number) => {
          const formDataKey = `brandIds[${index}]`;
          if (item !== null && item !== undefined) {
            if (item instanceof Object && !(item instanceof File)) {
              formData.append(formDataKey, item.id);
            } else formData.append(formDataKey, item);
          }
        });
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: any) => {
          formatFormData(item, formData, `${key}[${index}]`);
        });
      } else if (data[key] instanceof Object && !(data[key] instanceof File)) {
        formatFormData(data[key], formData, key);
      } else {
        if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      }
    });

    let callapi = await modifyMegaMenuPost(formData);
    if (!isNullOrUndefined(callapi) && callapi?.success) {
      onClose(load + 1);
      NotificationExtension.Success("Chỉnh sửa thành công !");
      modals.closeAll();
    } else if (callapi != null)
      NotificationExtension.Fails("Chỉnh sửa thất bại !");
    close();
  };

  function GetUrlcanonical(url: string) {
    const one = url.split(" ").length;
    setUrlcanonical(`Url canonical ${one} ký tự,${url.length} từ :`);
  }
  function GetMetaKeywords(url: string) {
    const one = url.split(" ").length;
    setMetaKeywords(`Meta Keyword ${one} ký tự,${url.length} từ :`);
  }
  const handleAddCategoryImage = (
    dataCategoryImage: listTblCategoryImage[],
    isImageChange: boolean[]
  ) => {
    NotificationExtension.Success("Thêm dữ liệu ảnh thành công");
    setIsImageChange(isImageChange);
    setIsCategoryImageChange(true);
    form.values.listTblCategoryImage = dataCategoryImage;
  };

  const handleAddCategoryAttribute = (
    dataCategoryAttribute: listTblCategoryAttribute[]
  ) => {
    NotificationExtension.Success("Thêm dữ liệu thuộc tính thành công");
    form.values.listTblCategoryAttribute = dataCategoryAttribute;
  };

  const handleSubmitForm = (dataSubmit: TblCategoryModel) => {
    const {
      tblCategoryImageModels,
      listTblCategoryImage,
      tblCategoryModels,
      ...restGroup
    } = dataSubmit;
    var dataImage: listTblCategoryImage[] = [
      {
        imageCode: null,
        imageName: null,
        description: null,
        image: null,
        status: null,
        title: null,
        linkUrl: null,
        imageGroup: null,
        orgId: null,
        categoryId: null,
        createdBy: null,
        lastUpdateDate: null,
        lastUpdatedBy: null,
        lastUpdateLogin: null,
      },
    ];
    if (isCategoryImageChange) {
      dataImage = (listTblCategoryImage || [])?.map((item, index) => {
        const { image, ...restGroup } = item;
        return isImageChange[index] ? item : { ...restGroup, image: null };
      });
    } else {
      dataImage = (listTblCategoryImage || [])?.map((item) => {
        return { ...item, image: null };
      });
    }
    apiCreate({ ...restGroup, listTblCategoryImage: dataImage });
  };

  const handleConverDataOption = (data: any) => {
    return data?.map((item: any) => {
      return {
        value: String(item.id),
        label: item.name,
      };
    });
  };

  useEffect(() => {
    callApiGetData();
    const fetchDataProvince = async () => {
      open();
      const data = await getDataBrand();
      setDataBrand(data?.data.lists);
      close();
    };
    fetchDataProvince();
  }, []);

  useEffect(() => {
    const callDataCategoryTree = async () => {
      // setLoading(true);
      // setError(undefined);
      try {
        let urlSearch =
          API_ROUTE.GET_CATEGORY_TREE + `?IsTradeIn=N&Skip=0&Take=2000`;
        let callapi = await repository.get<MessageResponse<CategoryTree[]>>(
          urlSearch
        );
        if (
          isNullOrUndefined(callapi) ||
          isNullOrUndefinedArry(callapi?.data)
        ) {
          setDataCategory([]);
        } else {
          setDataCategory(callapi?.data ?? []);
        }
        return callapi?.data;
      } catch (error: any) {
        return null;
      } finally {
        // setLoading(false);
      }
    };
    callDataCategoryTree();
  }, []);

  useEffect(() => {
    const flattenCategoryTree = (categories: CategoryTree[], level = 0) => {
      let result: { value: string; label: string }[] = [];

      categories.forEach((category) => {
        result.push({
          value: category.id.toString(),
          label: `${"\u00A0\u00A0\u00A0\u00A0\u00A0 ".repeat(level)} - ${
            category.categoryName
          }`,
        });

        if (category.categoryChildModels.length > 0) {
          result = result.concat(
            flattenCategoryTree(category.categoryChildModels, level + 1)
          );
        }
      });

      return result;
    };

    const flattenedCategories = flattenCategoryTree(dataCategory);
    setDataDrop(flattenedCategories);
  }, [dataCategory]);

  const formCreate = (
    <>
      <Divider my="sm" />
      <Box className="flex-none" component="form" miw={600} mx="auto">
        <TextInput
          label="Tên danh mục: "
          placeholder="Tên danh mục..."
          withAsterisk
          {...form.getInputProps("categoryName")}
        />
        <TextInput
          mt={"lg"}
          label="Mã danh mục: "
          placeholder="Mã danh mục..."
          withAsterisk
          {...form.getInputProps("categoryCode")}
        />

        <Group grow wrap="nowrap" gap={"lg"}>
          <Select
            label={"Nổi bật"}
            placeholder={"Nhập trạng thái nổi bật"}
            withAsterisk
            mt="md"
            data={[
              { value: "Y", label: "Nổi bật" },
              { value: "N", label: "Không nổi bật" },
            ]}
            {...form.getInputProps("priorityStatus")}
          />
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
        <Group grow wrap="nowrap" gap={"lg"}>
          <Select
            label={"Thay đổi liên kết"}
            placeholder={"Bật/Tắt"}
            mt="md"
            data={[
              { value: "Y", label: "Bật" },
              { value: "N", label: "Tắt" },
            ]}
            {...form.getInputProps("enableChangeLink")}
          />
          <MultiSelect
            label="Thương hiệu: "
            placeholder="Chọn thương hiệu..."
            mt="md"
            data={handleConverDataOption(dataBrand)}
            searchable
            clearable
            nothingFoundMessage="Không có dữ liệu"
            {...form.getInputProps("brandIds")}
            value={form.values.brandIds?.map((so) => String(so))}
          />
        </Group>

        <Group grow wrap="nowrap" gap={"lg"}>
          <Select
            mt={"lg"}
            label="Là danh mục con của: "
            placeholder="Chọn danh mục cha..."
            data={dataDrop}
            searchable
            clearable
            nothingFoundMessage="Không có dữ liệu"
            {...form.getInputProps("idParent")}
            value={form.values.idParent?.toString()}
            mb={"lg"}
          />
          <Select
            mt={"lg"}
            label="Loại nội dung hiển thị: "
            placeholder="Chọn loại nội dung hiển thị..."
            data={_datavisibleType}
            searchable
            withAsterisk
            {...form.getInputProps("visibleType")}
            mb={"lg"}
          />
        </Group>
        <Group grow wrap="nowrap" gap={"lg"}>
          <Select
            label="Là danh mục sản phẩm hay danh mục SEO"
            mt={"lg"}
            placeholder="Chọn danh mục sản phẩm hay danh mục SEO"
            data={[
              { label: "Category", value: "Category" },
              { label: "SEO", value: "SEO" },
            ]}
            withAsterisk
            searchable
            {...form.getInputProps("categoryType")}
            mb={"lg"}
          />
          <>
            <Checkbox
              mt={"xs"}
              label="Dùng làm danh mục build pc"
              checked={form.values.isBuildPc === "Y" ? true : false}
              onChange={(e) => {
                form
                  .getInputProps("isBuildPc", { type: "checkbox" })
                  .onChange(e.target.checked ? "Y" : "N");
              }}
            />
            <Checkbox
              mt={"xs"}
              label="Dùng làm mega menu"
              checked={form.values.isMegaMenu === "Y" ? true : false}
              onChange={(e) => {
                form
                  .getInputProps("isMegaMenu", { type: "checkbox" })
                  .onChange(e.target.checked ? "Y" : "N");
              }}
            />
          </>
        </Group>

        <Text size="sm" mt="lg" fw={500}>
          Mô tả (nếu có):
          {/* Thư viện ảnh Bạn cần tạo danh mục trước khi có thể
          upload ảnh */}
        </Text>
        {/* <QuillEditor
          description={form.values.description}
          toolbarId="t1"
          setValue={setModel}
          onChangeValue={(html: string) => (form.values.description = html)}
        /> */}
        <Textarea
          mt={"lg"}
          placeholder="Mã danh mục..."
          withAsterisk
          {...form.getInputProps("description")}
        />

        <TagsInput
          label="Từ khóa (tags, nếu có - nhập mỗi cụm từ 1 dòng)"
          placeholder="Từ khóa..."
          mt="lg"
          {...form.getInputProps("tags")}
          data={[]}
          value={valueTags}
          onChange={setValueTags}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <FileInput
            leftSection={icon}
            label="Ảnh icon"
            placeholder="Chọn tệp..."
            accept="image/png,image/jpeg"
            leftSectionPointerEvents="none"
            {...form.getInputProps("imageIcon")}
          />

          <FileInput
            leftSection={icon}
            label="Ảnh đại diện"
            placeholder="Chọn tệp..."
            accept="image/png,image/jpeg"
            leftSectionPointerEvents="none"
            {...form.getInputProps("imageOwner")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <ImageShow h={300} w={300} img={iconimage} />
          <ImageShow h={300} w={300} img={owen} />
        </Group>
        <Textarea
          label="Khoảng lọc giá: "
          placeholder="Nhập khoảng lọc giá..."
          mt="lg"
          autosize
          minRows={3}
          {...form.getInputProps("priceRange")}
        />
        <Text size="sm" mt="xs" fw={400}>
          (Nhập từng giá cách nhau dấu ;) ví dụ: 300000;800000;1500000 có nghĩa
          là tạo ra 4 khoảng giá cho khách hàng lọc Sản phẩm
        </Text>
        <Text size="sm" fw={400}>
          Đó là: - Dưới 300000, - Từ 300000 đến 800000, - Từ 800000 đến 1500000
          và - Trên 1500000
        </Text>

        <Text size="sm" mt="sm" fw={500}>
          Nhập nội dung
        </Text>
        <Text size="sm" mt="sm" fw={300}>
          Thư viện ảnh Bạn cần tạo danh mục trước khi có thể upload ảnh
        </Text>
        <QuillEditor
          description={form.values.content}
          toolbarId="t3"
          setValue={setModel}
          onChangeValue={(html: string) => (form.values.content = html)}
        />

        <Text size="sm" mt="sm" fw={500}>
          Nhập nội dung cố định (HTML)
        </Text>
        <Text size="sm" mt="sm" fw={300}>
          Thư viện ảnh Bạn cần tạo danh mục trước khi có thể upload ảnh
        </Text>
        <QuillEditor
          description={form.values.fixedContent}
          toolbarId="t2"
          setValue={setModel}
          onChangeValue={(html: string) => (form.values.fixedContent = html)}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label="Thứ tự xuất hiện (cao xếp trước): "
            placeholder="Thứ tự..."
            {...form.getInputProps("orderedNumber")}
            type="number"
          />

          <TextInput
            label="Template File: "
            placeholder="Template File..."
            {...form.getInputProps("templateFile")}
          />
        </Group>

        <Group mb={"lg"} grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label="Redirect tới URL (khi truy cập danh mục sẽ chuyển sang link này): "
            placeholder="URL..."
            {...form.getInputProps("urlRedirect")}
          />

          <TextInput
            label="Số Sản phẩm hiển thị (để = 0 nếu mặc định theo hệ thống cài đặt chung): "
            placeholder="Số Sản phẩm..."
            type="number"
            {...form.getInputProps("visibleItemQty")}
          />
        </Group>
        <Text size="md" mt="lg" fw={500}>
          Dùng cho SEO
        </Text>

        <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Textarea
            label={Urlcanonical}
            placeholder="Url canonical..."
            autosize
            {...form.getInputProps("urlCanonicalForSeo")}
            onChange={(e) => {
              GetUrlcanonical(e.target.value);
              if (form.getInputProps(`urlCanonicalForSeo`).onChange)
                form.getInputProps(`urlCanonicalForSeo`).onChange(e);
            }}
            minRows={3}
            withAsterisk
          />

          <Textarea
            label="Meta Title: "
            placeholder="Meta Title..."
            {...form.getInputProps("metaTitle")}
            autosize
            minRows={3}
            withAsterisk
          />
        </Group>

        <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Textarea
            label={MetaKeywords}
            placeholder="Meta Keywords..."
            {...form.getInputProps("metaKeyword")}
            autosize
            withAsterisk
            onChange={(e) => {
              GetMetaKeywords(e.target.value);
              if (form.getInputProps(`metaKeyword`).onChange)
                form.getInputProps(`metaKeyword`).onChange(e);
            }}
            minRows={3}
          />

          <Textarea
            label="Meta Description	: "
            placeholder="Meta Description..."
            withAsterisk
            autosize
            minRows={3}
            {...form.getInputProps("metaDescription")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Textarea
            label="Link for SEO	: "
            placeholder="Link..."
            {...form.getInputProps("linkForSeo")}
            autosize
            minRows={3}
          />

          <Textarea
            label="Index for SEO	: "
            placeholder="Index..."
            {...form.getInputProps("idexForSeo")}
            autosize
            minRows={3}
          />
        </Group>

        <Divider my="sm" />
      </Box>
    </>
  );

  return (
    <>
      <Box
        component="form"
        onSubmit={form.onSubmit((e: TblCategoryModel) => {
          handleSubmitForm(e);
        })}
        style={{ position: "relative" }}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Tabs defaultValue="info1" style={{ position: "relative" }}>
          <Tabs.List
            style={{
              position: "sticky",
              top: 52,
              zIndex: 1,
              backgroundColor: "white",
            }}
          >
            <Tabs.Tab value="info1">Cơ bản</Tabs.Tab>
            <Tabs.Tab
              value="info2"
              disabled={form.values.idParent ? true : false}
            >
              Ảnh danh mục
            </Tabs.Tab>
            <Tabs.Tab value="info3">Thuộc tính danh mục</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info1">{formCreate}</Tabs.Panel>
          <Tabs.Panel value="info2">
            <ListTblCategoryImageView
              dataCategoryImage={form.values.listTblCategoryImage}
              onAddCategoryImage={handleAddCategoryImage}
            />
          </Tabs.Panel>
          <Tabs.Panel value="info3">
            <ListTblCategoryAttributeView
              dataCategoryAttribute={form.values.listTblCategoryAttribute || []}
              onAddItemCategoryAttribute={handleAddCategoryAttribute}
            />
          </Tabs.Panel>
        </Tabs>
        <Group
          justify="center"
          mt="xs"
          p="10px 0"
          style={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "white",
          }}
        >
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Sửa danh mục
          </Button>
          <></>
        </Group>
      </Box>
    </>
  );
};

export default EditView;
