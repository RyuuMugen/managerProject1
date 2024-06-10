import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck } from "@tabler/icons-react";
import { tblBannerLocation } from "../../../model/TblBanner";
import { createBannerLocation } from "../../../api/ApiBannerManager";

const dataOptionLocation = [
  "header - Đầu trang",
  "homepage - Trang chủ",
  "column-left - Cột trái",
  "column-right - Cột phải",
  "footer - Chân trang",
  "product-detail - Chi tiết sản phẩm",
  "product-list - Danh sách & Danh mục sản phẩm",
  "collection-list - Bộ sưu tập",
  "article_home - Trang chủ tin tức",
  "brand_detail - Chi tiết thương hiệu",
  "deal_group - Nhóm deal",
];
const CreateView = ({ onSearch }: any) => {
  const entity = {
    id: 0,
    templatePage: null,
    bannerLocCode: null,
    bannerLocName: null,
    description: null,
    status: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdateLogin: null,
    creationDate: null,
  };

  const handleCreateProductAdsCategory = async (
    dataSubmit: tblBannerLocation
  ) => {
    open();
    await createBannerLocation(dataSubmit);
    close();
    modals.closeAll();
    onSearch();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<tblBannerLocation>({
    initialValues: {
      ...entity,
    },
    validate: {
      bannerLocName: isNotEmpty("Tên vị trí không được để trống"),
      bannerLocCode: isNotEmpty("Mã vị trí không được để trống"),
      templatePage: isNotEmpty("Chưa chọn vị trí template hiển thị"),
    },
  });

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1000}
        maw={1000}
        mx="auto"
        onSubmit={form.onSubmit((e: tblBannerLocation) => {
          handleCreateProductAdsCategory(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên vị trí"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("bannerLocName")}
          />
          <TextInput
            label={"Mã vị trí"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("bannerLocCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Chọn template hiển thị"}
            placeholder={""}
            withAsterisk
            clearable
            data={dataOptionLocation}
            {...form.getInputProps("templatePage")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Ghi chú / Mô tả"}
            placeholder={"Nhập ghi chú"}
            {...form.getInputProps("description")}
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
