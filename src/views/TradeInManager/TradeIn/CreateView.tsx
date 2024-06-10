import {
  Box,
  Button,
  ComboboxItem,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createItemCategory } from "../../../api/ApiMegaMenu";
import { TblCategoryModel } from "../../../model/TblCategoryModel";
import { TradeInProductCat } from "../../../model/TblTradeIn";

type CreateViewProps = {
  onSearch: Function;
  dataParent: TradeInProductCat[];
};

const CreateView = ({ onSearch, dataParent }: CreateViewProps) => {
  const entity: TblCategoryModel = {
    id: 0,
    categoryCode: null,
    categoryName: "",
    isBuildPc: "N",
    isMegaMenu: "N",
    idParent: null,
    description: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
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
    isTradeIn: "Y",
  };
  const form = useForm<TblCategoryModel>({
    initialValues: {
      ...entity,
    },

    validate: {
      categoryName: (value: string | null) => {
        if (!value) {
          return "Vui Lòng Nhập Tên Danh Mục!";
        }
        return hasLength(
          { min: 2, max: 50 },
          "Tên phải từ 2-50 kí tự!"
        )(value as string);
      },
      categoryCode: (value: string | null) => {
        if (!value) {
          return "Vui Lòng Nhập Mã Danh Mục!";
        }
        return hasLength(
          { min: 2, max: 50 },
          "Tên phải từ 2-50 kí tự!"
        )(value as string);
      },
    },
  });

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [parentOption, setParentOption] = useState<ComboboxItem[]>([]);

  const handleCreateCategory = async (dataSubmit: TblCategoryModel) => {
    open();
    await createItemCategory(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  useEffect(() => {
    function flattenData(data: TradeInProductCat[], level = 1) {
      return data.flatMap((cat) => {
        const label =
          "-".repeat(level) + " " + `[${cat.categoryCode}] ` + cat.categoryName;
        const result: ComboboxItem[] = [{ value: cat.id.toString(), label }];
        if (
          cat.tradeInProductCatChilds &&
          cat.tradeInProductCatChilds.length > 0
        ) {
          result.push(...flattenData(cat.tradeInProductCatChilds, level + 1));
        }
        return result;
      });
    }

    if (dataParent && dataParent.length > 0) {
      const dataOption = flattenData(dataParent);
      setParentOption(dataOption);
    }
  }, [dataParent]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={950}
        maw={950}
        mx="auto"
        onSubmit={form.onSubmit((e: TblCategoryModel) => {
          handleCreateCategory(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label="Tên danh mục: "
            placeholder="Tên danh mục..."
            withAsterisk
            {...form.getInputProps("categoryName")}
          />
          <TextInput
            label="Mã danh mục: "
            placeholder="Mã danh mục..."
            withAsterisk
            {...form.getInputProps("categoryCode")}
          />
        </Group>

        <Group grow wrap="nowrap" gap={"lg"}>
          <Select
            mt={"lg"}
            label="Là danh mục con của: "
            placeholder="Chọn danh mục cha..."
            data={parentOption}
            searchable
            clearable
            nothingFoundMessage="Không có dữ liệu"
            {...form.getInputProps("idParent")}
            mb={"lg"}
          />
          {/* <Select
            label={"Trạng thái"}
            placeholder={"Nhập trạng thái"}
            withAsterisk
            mt="md"
            data={[
              { value: "I", label: "Ẩn" },
              { value: "A", label: "Hiện" },
            ]}
            {...form.getInputProps("status")}
          /> */}
        </Group>

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
