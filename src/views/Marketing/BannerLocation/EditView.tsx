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
import { modifyBannerLocation } from "../../../api/ApiBannerManager";
import { useEffect } from "react";
import Repository from "../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";

const dataOptionLocation =[
  { value: "header", label: "Đầu trang - header" },
  { value: "homepage", label: "Trang chủ - homepage" },
  { value: "column_left", label: "Cột trái - column-left" },
  { value: "column_right", label: "Cột phải - column-right" },
  { value: "footer", label: "Chân trang - footer" },
  { value: "product_detail", label: "Chi tiết sản phẩm - product-detail" },
  { value: "product_list", label: "Danh sách & Danh mục sản phẩm - product-list" },
  { value: "collection_list", label: "Bộ sưu tập - collection-list" },
  { value: "article_home", label: "Trang chủ tin tức - article_home" },
  { value: "brand_detail", label: "Chi tiết thương hiệu - brand_detail" },
  { value: "deal_group", label: "Nhóm deal - deal_group" }
];
const EditView = ({ id, onSearch }: { id: number; onSearch: any }) => {
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
    await modifyBannerLocation(dataSubmit);
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
      bannerLocName: isNotEmpty("Mã vị trí không được để trống"),
      bannerLocCode: isNotEmpty("Mã vị trí không được để trống"),
      templatePage: isNotEmpty("Chưa chọn vị trí template hiển thị"),
    },
  });

  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    const urlDetail = `TblBannerLocation/get-detail/` + id;
    let callApi = await repository.get<MessageResponse<tblBannerLocation>>(
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

  useEffect(() => {
    callApiGetData();
  }, [id]);

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

export default EditView;
