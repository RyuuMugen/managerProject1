import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Input,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect } from "react";
import { TblConfigWebPage } from "../../../model/TblConfigWeb";

const ConfigProductDetails = ({
  dataPage,
  handelChangeConfigWebPageTabs,
}: ConfigProductDetailsProps) => {
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

  const defaultTabOption = [
    "Miêu tả",
    "Hình ảnh",
    "Thông số kỹ thuật",
    "Phụ kiện",
    "Ý kiến người dùng",
    "Form gửi ý kiến",
    "Hướng dẫn chung",
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
      <Text size="sm" mt="sm" fw={500}>
        Kích thước ảnh sản phẩm
      </Text>
      <Text size="sm">
        Điều chỉnh kích thước ảnh cho phù hợp với giao diện website:
      </Text>
      <Group grow wrap="nowrap" mt="sm" gap={"lg"} style={{ width: 300 }}>
        <Text size="sm" style={{ maxWidth: 60 }}>
          thum
        </Text>

        <Flex style={{ minWidth: 200 }} gap={"xs"}>
          <Input
            placeholder={""}
            type="text"
            width={200}
            {...form.getInputProps("thum")}
          />
          <Text size="sm">px</Text>
        </Flex>
      </Group>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"} style={{ width: 300 }}>
        <Text size="sm" style={{ maxWidth: 60 }}>
          small
        </Text>

        <Flex style={{ minWidth: 200 }} gap={"xs"}>
          <Input
            placeholder={""}
            type="text"
            width={200}
            {...form.getInputProps("small")}
          />
          <Text size="sm">px</Text>
        </Flex>
      </Group>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"} style={{ width: 300 }}>
        <Text size="sm" style={{ maxWidth: 60 }}>
          medium
        </Text>

        <Flex style={{ minWidth: 200 }} gap={"xs"}>
          <Input
            placeholder={""}
            type="text"
            width={200}
            {...form.getInputProps("medium")}
          />
          <Text size="sm">px</Text>
        </Flex>
      </Group>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"} style={{ width: 300 }}>
        <Text size="sm" style={{ maxWidth: 60 }}>
          large
        </Text>

        <Flex style={{ minWidth: 200 }} gap={"xs"}>
          <Input
            placeholder={""}
            type="text"
            width={200}
            {...form.getInputProps("large")}
          />
          <Text size="sm">px</Text>
        </Flex>
      </Group>

      <Text size="sm" mt="md" fw={500}>
        Tạo ảnh vuông
      </Text>
      <Checkbox
        label="Tạo các ảnh nhỏ hình vuông với kích thước như trên"
        checked={form.values.isSquare === "Y" ? true : false}
        onChange={(e) =>
          form
            .getInputProps("isSquare", { type: "checkbox" })
            .onChange(e.target.checked ? "Y" : "N")
        }
      />

      <Text size="sm" mt="md" fw={500}>
        Ghi chữ bản quyền lên ảnh
      </Text>
      <Checkbox
        label="Ghi bản quyền (Tên miền website hacom.vn sẽ được ghi lên ảnh sản phẩm)"
        checked={form.values.wallterMark === "Y" ? true : false}
        onChange={(e) =>
          form
            .getInputProps("wallterMark", { type: "checkbox" })
            .onChange(e.target.checked ? "Y" : "N")
        }
      />

      <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
        <Select
          label="Tab sản phẩm mặc định"
          placeholder="Chọn danh mục"
          data={defaultTabOption}
          searchable
          {...form.getInputProps("defaultTab")}
        />
        <></>
      </Group>

      <Text size="sm" mt="md" fw={500}>
        Hiển thị toàn bộ tab sản phẩm trên 1 trang
      </Text>
      <Checkbox
        label="Hiển thị toàn bộ (Chỉ dùng nếu bạn muốn sử dụng Javascript để xem các tab hoặc hiển thị tất cả)"
        checked={form.values.visibleAll === "Y" ? true : false}
        onChange={(e) =>
          form
            .getInputProps("visibleAll", { type: "checkbox" })
            .onChange(e.target.checked ? "Y" : "N")
        }
      />

      <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
        <Flex align={"center"} gap={"lg"}>
          <TextInput
            label={"Số lượng sản phẩm liên quan muốn hiển thị"}
            placeholder={"Số lượng"}
            type="text"
            {...form.getInputProps("qtyProdVisible")}
          />

          <Text size="sm" mt="lg">
            (Tối đa 30 sản phẩm)
          </Text>
        </Flex>
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

export default ConfigProductDetails;

type ConfigProductDetailsProps = {
  dataPage: TblConfigWebPage | null;
  handelChangeConfigWebPageTabs: (data: TblConfigWebPage) => void;
};
