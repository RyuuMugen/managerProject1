import {
  Box,
  Button,
  Flex,
  Group,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect } from "react";
import { TblConfigWebPage } from "../../../model/TblConfigWeb";

const ConfigGeneralSettings = ({
  dataPage,
  handelChangeConfigWebPageTabs,
}: ConfigGeneralSettingsProps) => {
  const entity: TblConfigWebPage = {
    closeWebsite: null,
    faviconUrl: null,
    veryfyDomain: null,
    qtyProdPerPage: null,
    orderProdBy: null,
    qtyArticlePerPage: null,
    hotProdByCat: null,
    qtyHotProdByCat: null,
    bestsaleProdByCat: null,
    qtyBestsaleProdByCat: null,
    newProdByCat: null,
    qtyNewProdByCat: null,
    saleoffProdByCat: null,
    qtySaleoffProdByCat: null,
    articleByCat: null,
    qtyArticleByCat: null,
    collectProdByCat: null,
    qtyCollectProdByCat: null,
    hotProdByCat1: null,
    qtyHotProdByCat1: null,
    bestsaleProdByCat1: null,
    qtyBestsaleProdByCat1: 0,
    newProdByCat1: null,
    qtyNewProdByCat1: null,
    saleoffProdByCat1: null,
    qtySaleoffProdByCat1: 0,
    articleByCat1: null,
    qtyArticleByCat1: null,
    collectProdByCat1: null,
    qtyCollectProdByCat1: null,
    thum: null,
    small: null,
    medium: null,
    large: null,
    isSquare: null,
    wallterMark: null,
    defaultTab: null,
    visibleAll: null,
    qtyProdVisible: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
  };

  const form = useForm<TblConfigWebPage>({
    initialValues: {
      ...entity,
    },

    validate: {},
  });

  const orderProdByOption = [
    "Thứ tự cài đặt, mới nhất",
    "Thứ tự cài đặt, mới cập nhật",
    "Thứ tự cài đặt",
    "Mới nhất trước",
    "Mới cập nhật trước",
    "Giá: Cao -> Thấp",
    "Giá: Thấp -> Cao",
  ];

  useEffect(() => {
    if (dataPage) form.setValues(dataPage);
  }, [dataPage]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={800}
      maw={800}
      mx={"sm"}
      mb={"md"}
      onSubmit={form.onSubmit((e: TblConfigWebPage) => {
        handelChangeConfigWebPageTabs(e);
      })}
    >
      <Flex wrap="nowrap" mt="lg" gap={"lg"} align={"center"}>
        <Text size="sm" mt="md" fw={500} style={{ flex: 1 }}>
          Tạm đóng website (Nếu bạn chưa muốn người dùng xem website, hãy tạm
          đóng lại)
        </Text>
        <Flex direction={"column"} style={{ flex: 2 }}>
          <Flex gap={"sm"} align={"center"}>
            <TextInput
              label={"Mật khẩu để xem:"}
              placeholder={"Nhập URL đầy đủ"}
              miw={250}
              mt="md"
              type="text"
              {...form.getInputProps("")}
            />
            <Text size="sm" mt="xl">
              (
              <Text size="sm" color="red" span>
                Xóa bỏ mật khẩu để mở lại website
              </Text>
              )
            </Text>
          </Flex>

          <Textarea
            label={"Nội dung thông báo khách hàng:"}
            placeholder={""}
            mt="md"
            {...form.getInputProps("closeWebsite")}
          />
        </Flex>
      </Flex>

      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TextInput
          label={"Hình favicon"}
          placeholder={"Nhập URL đầy đủ"}
          mt="md"
          type="text"
          {...form.getInputProps("faviconUrl")}
        />
      </Group>

      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TextInput
          label={
            "Xác thực tên miền với Google (Sử dụng khi cài email của Google)"
          }
          placeholder={""}
          type="text"
          {...form.getInputProps("veryfyDomain")}
        />
      </Group>

      <Text size="sm">
        Nhập nội dung của file Google vào ô trên (v.d.{" "}
        <Text size="sm" color="red" span>
          google-site-verification: google0b0cdca26a03ce2e.html
        </Text>{" "}
        )
      </Text>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
        <TextInput
          label={"Số lượng sản phẩm liên quan muốn hiển thị"}
          placeholder={"Số lượng"}
          type="number"
          {...form.getInputProps("qtyProdPerPage")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
        <Select
          label="Tab sản phẩm mặc định"
          placeholder="Chọn danh mục"
          data={orderProdByOption}
          searchable
          {...form.getInputProps("orderProdBy")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
        <TextInput
          label={"Số lượng sản phẩm liên quan muốn hiển thị"}
          placeholder={"Số lượng"}
          type="number"
          {...form.getInputProps("qtyArticlePerPage")}
        />
        <></>
      </Group>

      <Group justify="start" mt="md">
        <Button
          type="submit"
          color="#3598dc"
          leftSection={<IconEdit size={18} />}
        >
          Cập nhật
        </Button>
        <></>
      </Group>
    </Box>
  );
};

export default ConfigGeneralSettings;

type ConfigGeneralSettingsProps = {
  dataPage: TblConfigWebPage | null;
  handelChangeConfigWebPageTabs: (data: TblConfigWebPage) => void;
};
