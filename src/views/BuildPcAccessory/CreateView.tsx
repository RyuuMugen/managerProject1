import { Box, Button, Group, LoadingOverlay, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry
} from "../../_base/extension/StringExtension";
import { createBuildPcCat } from "../../api/ApiBuildPC";
import { getDataMegaMenu } from "../../api/ApiMegaMenu";
import { TblBuildPcCatRel } from "../../model/TblBuildPc";
import { TblCategoryModel } from "../../model/TblCategoryModel";

const CreateView = ({ onSearch }: CreateViewProps) => {
  const entity = {
    id: 0,
    categoryId: 0,
    categoryName: null,
    categoryRelId: null,
    categoryRelName: null,
  };

  const handleCreateCustomer = async (dataSubmit: TblBuildPcCatRel) => {
    open();
    await createBuildPcCat(dataSubmit);
    close();
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataCategory, setDataCategory] = useState<TblCategoryModel[]>([]);
  const [dataOption, setDataOption] = useState<
    { value: string; label: string }[]
  >([]);

  const form = useForm<TblBuildPcCatRel>({
    initialValues: {
      ...entity,
    },
    validate: {},
  });

  const callApiCategory = async () => {
    try {
      let urlSearch = `?Skip=0&Take=1000&IsBuildPC=Y`;
      let callapi = await getDataMegaMenu(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
      } else {
        setDataCategory(callapi?.data ?? []);
      }
      return callapi?.data;
    } catch (error: any) {
      NotificationExtension.Fails("Có lỗi xảy ra");
    }
  };

  const handleChangeDataCategoryRel = (id: string | null) => {
    if (id) {
      const customer = dataCategory?.filter((item) => item.id === Number(id));
      form.getInputProps("relCategoryId").onChange(customer[0].id);
      form.getInputProps("relCategoryName").onChange(customer[0].categoryName);
    }
  };

  const handleChangeDataCategory = (id: string | null) => {
    if (id) {
      const customer = dataCategory?.filter((item) => item.id === Number(id));
      form.getInputProps("categoryId").onChange(customer[0].id);
      form.getInputProps("categoryName").onChange(customer[0].categoryName);
    }
  };

  useEffect(() => {
    callApiCategory();
  }, []);

  useEffect(() => {
    if (dataCategory)
      setDataOption(
        dataCategory.map((category) => ({
          value: category.id.toString(),
          label: category.categoryName,
          disabled: false,
        }))
      );
  }, [dataCategory]);

  useEffect(() => {
    setDataOption((prevData) =>
      prevData.map((category) =>
        category.value === form.values.categoryId.toString() ||
        category.value === form.values.categoryRelId?.toString()
          ? { ...category, disabled: true }
          : { ...category, disabled: false }
      )
    );
  }, [form.values.categoryId, form.values.categoryRelId]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: TblBuildPcCatRel) => {
          handleCreateCustomer(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Danh mục"}
            placeholder={"Chọn danh mục"}
            mt="md"
            data={dataOption}
            nothingFoundMessage={"Không có dữ liệu"}
            {...form.getInputProps("categoryId")}
            value={form.values.categoryId.toString()}
            onChange={handleChangeDataCategory}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Danh mục liên quan"}
            placeholder={"Chọn danh mục liên quan"}
            mt="md"
            data={dataOption}
            nothingFoundMessage={"Không có dữ liệu"}
            {...form.getInputProps("categoryRelId")}
            value={form.values.categoryRelId?.toString()}
            onChange={handleChangeDataCategoryRel}
          />
        </Group>

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

type CreateViewProps = {
  onSearch: Function;
};
