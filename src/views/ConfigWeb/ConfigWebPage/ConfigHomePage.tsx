import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect } from "react";
import { TblConfigWebPage } from "../../../model/TblConfigWeb";

const ConfigHomePage = ({
  dataPage,
  handelChangeConfigWebPageTabs,
}: ConfigHomePageProps) => {
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
    qtyBestsaleProdByCat1: null,
    newProdByCat1: null,
    qtyNewProdByCat1: null,
    saleoffProdByCat1: null,
    qtySaleoffProdByCat1: null,
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

  useEffect(() => {
    if (dataPage) form.setValues(dataPage);
  }, [dataPage]);

  return (
    <Box mx={"sm"} mb={"md"}>
      <Text size="sm" mt={"sm"}>
        Hướng dẫn :
      </Text>
      <Text size="sm">
        - ID danh mục: nhập danh sách các ID danh mục cách nhau dấu , hoặc
        khoảng trắng. Để percat nếu muốn hệ thống tự động lấy theo danh mục sản
        phẩm đang xem
      </Text>
      <Text size="sm">
        - Số lượng hiển thị : Nhập 0 nếu không muốn dùng nội dung, điền số {">"}{" "}
        0 để có số lượng cần lấy
      </Text>
      <Text size="sm">
        Để website chạy nhanh nhất, chỉ kích hoạt các nội dung mà giao diện hiển
        thị cần đến.
      </Text>

      <Box
        className="flex-none"
        component="form"
        miw={1000}
        maw={1000}
        onSubmit={form.onSubmit((e: TblConfigWebPage) => {
          handelChangeConfigWebPageTabs(e);
        })}
      >
        <Group
          grow
          wrap="nowrap"
          mt="xs"
          gap={"lg"}
          style={{ borderTop: "1px solid #ced4da" }}
        >
          <Text size="sm" fw={500}>
            Sản phẩm nổi bật (HOT)
          </Text>
          <TextInput
            label={"ID danh mục"}
            placeholder={""}
            type="text"
            {...form.getInputProps("hotProdByCat")}
          />

          <TextInput
            label={"Số lượng hiển thị"}
            placeholder={""}
            type="text"
            {...form.getInputProps("qtyHotProdByCat")}
          />
        </Group>

        <Group
          grow
          wrap="nowrap"
          mt="xs"
          gap={"lg"}
          style={{ borderTop: "1px solid #ced4da" }}
        >
          <Text size="sm" fw={500}>
            Sản phẩm bán chạy nhất (BEST SALE)
          </Text>
          <TextInput
            label={"ID danh mục"}
            placeholder={""}
            type="text"
            {...form.getInputProps("bestsaleProdByCat")}
          />

          <TextInput
            label={"Số lượng hiển thị"}
            placeholder={""}
            type="text"
            {...form.getInputProps("qtyBestsaleProdByCat")}
          />
        </Group>

        <Group
          grow
          wrap="nowrap"
          mt="xs"
          gap={"lg"}
          style={{ borderTop: "1px solid #ced4da" }}
        >
          <Text size="sm" fw={500}>
            Sản phẩm mới nhất (NEW)
          </Text>
          <TextInput
            label={"ID danh mục"}
            placeholder={""}
            type="text"
            {...form.getInputProps("newProdByCat")}
          />

          <TextInput
            label={"Số lượng hiển thị"}
            placeholder={""}
            type="text"
            {...form.getInputProps("qtyNewProdByCat")}
          />
        </Group>

        <Group
          grow
          wrap="nowrap"
          mt="xs"
          gap={"lg"}
          style={{ borderTop: "1px solid #ced4da" }}
        >
          <Text size="sm" fw={500}>
            Sản phẩm xả hàng (SALE OFF)
          </Text>
          <TextInput
            label={"ID danh mục"}
            placeholder={""}
            type="text"
            {...form.getInputProps("saleoffProdByCat")}
          />

          <TextInput
            label={"Số lượng hiển thị"}
            placeholder={""}
            type="text"
            {...form.getInputProps("qtySaleoffProdByCat")}
          />
        </Group>

        <Group
          grow
          wrap="nowrap"
          mt="xs"
          gap={"lg"}
          style={{ borderTop: "1px solid #ced4da" }}
        >
          <Text size="sm" fw={500}>
            Tin tức
          </Text>
          <TextInput
            label={"ID danh mục"}
            placeholder={""}
            type="text"
            {...form.getInputProps("articleByCat")}
          />

          <TextInput
            label={"Số lượng hiển thị"}
            placeholder={""}
            type="text"
            {...form.getInputProps("qtyArticleByCat")}
          />
        </Group>

        <Group
          grow
          wrap="nowrap"
          mt="xs"
          gap={"lg"}
          style={{ borderTop: "1px solid #ced4da" }}
        >
          <Text size="sm" fw={500}>
            Bộ sưu tập sản phẩm
          </Text>
          <TextInput
            label={"ID danh mục"}
            placeholder={""}
            type="text"
            {...form.getInputProps("collectProdByCat")}
          />

          <TextInput
            label={"Số lượng hiển thị"}
            placeholder={""}
            type="text"
            {...form.getInputProps("qtyCollectProdByCat")}
          />
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
    </Box>
  );
};

export default ConfigHomePage;

type ConfigHomePageProps = {
  dataPage: TblConfigWebPage | null;
  handelChangeConfigWebPageTabs: (data: TblConfigWebPage) => void;
};
