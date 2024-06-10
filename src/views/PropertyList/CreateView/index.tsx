import {
  Box,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Radio,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Children from "./Children/Children";
import {
  createDataAttribute,
  modifyAttribute,
} from "../../../api/ApiAttribute";

interface listChildren {
  value: string;
  description: string;
  orderNumber: number | null;
  status: string;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedLogin: string | null;
}

interface listParent {
  attributeCode: string;
  attributeName: string;
  filterCode: string;
  description: string;
  orderNumber: number;
  status: string;
  filterProdStatus: string;
  titleGroupStatus: string;
  shortDescStatus: string;
  displayInTechStatus: string;
  configProdStatus: string;
  attributeGroup: string;
}

interface createViewProps {
  data?: any;
  onSearch: () => void;
}

const CreateView = ({ data, onSearch }: createViewProps) => {
  const [dataParent, setDataParent] = useState<listParent>({
    attributeCode: "",
    attributeName: "",
    filterCode: "",
    description: "",
    orderNumber: 0,
    status: "",
    filterProdStatus: "N",
    titleGroupStatus: "N",
    shortDescStatus: "N",
    displayInTechStatus: "N",
    configProdStatus: "N",
    attributeGroup: "G",
  });

  const [listChildren, setListChildren] = useState<listChildren[]>([
    {
      value: "",
      description: "",
      orderNumber: null,
      status: "",
      creationDate: "",
      createdBy: null,
      lastUpdateDate: null,
      lastUpdatedBy: null,
      lastUpdatedLogin: null,
    },
  ]);

  const handleChangeValue = (value: string, key: string) => {
    setDataParent({
      ...dataParent,
      [key]: value,
    });
  };

  const handleCreateAttribute = async () => {
    if (data) {
      const payload = {
        tblAttributeCommand: { ...dataParent, id: data?.id },
        listTblAttributeValueCommand: listChildren,
      };
      await modifyAttribute(payload);
    } else {
      const payload = {
        tblAttributeCommand: dataParent,
        listTblAttributeValueCommand: listChildren,
      };
      await createDataAttribute(payload);
    }
    onSearch();
    modals.closeAll();
  };

  useEffect(() => {
    if (data) {
      setDataParent({
        attributeCode: data?.attributeCode,
        attributeName: data?.attributeName,
        filterCode: data?.filterCode,
        description: data?.description,
        orderNumber: data?.orderNumber,
        status: data?.status,
        filterProdStatus: data?.filterProdStatus,
        titleGroupStatus: data?.titleGroupStatus,
        shortDescStatus: data?.shortDescStatus,
        displayInTechStatus: data?.displayInTechStatus,
        configProdStatus: data?.configProdStatus,
        attributeGroup: data?.attributeGroup,
      });
      setListChildren([...data?.tblAttributeValueModels]);
    }
  }, [data]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Mã thuộc tính"}
            placeholder={"Mã thuộc tính"}
            withAsterisk
            mt="md"
            type="text"
            value={dataParent?.attributeCode}
            onChange={(e) => handleChangeValue(e.target.value, "attributeCode")}
          />
          <TextInput
            label={"Tên thuộc tính"}
            placeholder={"Tên thuộc tính"}
            withAsterisk
            mt="md"
            type="text"
            value={dataParent?.attributeName}
            onChange={(e) => handleChangeValue(e.target.value, "attributeName")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Mã bộ lọc"}
            placeholder={"Mã bộ lọc"}
            withAsterisk
            mt="md"
            type="text"
            value={dataParent?.filterCode}
            onChange={(e) => handleChangeValue(e.target.value, "filterCode")}
          />
          <TextInput
            label={"Mô tả thuộc tính"}
            placeholder={"Mô tả thuộc tính"}
            withAsterisk
            mt="md"
            type="text"
            value={dataParent?.description}
            onChange={(e) => handleChangeValue(e.target.value, "description")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Thứ tự"}
            placeholder={"Thứ tự"}
            withAsterisk
            mt="md"
            type="number"
            value={dataParent?.orderNumber}
            onChange={(e) => handleChangeValue(e.target.value, "orderNumber")}
          />
          <TextInput
            label={"Trạng thái"}
            placeholder={"Trạng thái"}
            maxLength={3}
            withAsterisk
            mt="md"
            type="text"
            value={dataParent?.status}
            onChange={(e) => handleChangeValue(e.target.value, "status")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Box style={{ rowGap: 12, flexDirection: "column" }} display={"flex"}>
            <Text fw={600}>Lựa chọn áp dụng</Text>
            <Checkbox
              label="Dùng là tiêu đề nhóm cho các thuộc tính đứng sau"
              checked={dataParent?.titleGroupStatus === "N" ? false : true}
              onChange={(event) => {
                setDataParent({
                  ...dataParent,
                  titleGroupStatus: event.currentTarget.checked ? "Y" : "N",
                });
              }}
            />
            <Checkbox
              label="Dùng lọc Sản phẩm ở danh mục"
              checked={dataParent?.filterProdStatus === "N" ? false : true}
              onChange={(event) =>
                setDataParent({
                  ...dataParent,
                  filterProdStatus: event.currentTarget.checked ? "Y" : "N",
                })
              }
            />
            <Checkbox
              label="Hiển thị ở thông tin tóm tắt Sản phẩm"
              checked={dataParent?.shortDescStatus === "N" ? false : true}
              onChange={(event) =>
                setDataParent({
                  ...dataParent,
                  shortDescStatus: event.currentTarget.checked ? "Y" : "N",
                })
              }
            />
            <Checkbox
              label="Hiển thị ở bảng thông số kỹ thuật"
              checked={dataParent?.displayInTechStatus === "N" ? false : true}
              onChange={(event) =>
                setDataParent({
                  ...dataParent,
                  displayInTechStatus: event.currentTarget.checked ? "Y" : "N",
                })
              }
            />
            <Checkbox
              label="Dùng để tạo các cấu hình của Sản phẩm"
              checked={dataParent?.configProdStatus === "N" ? false : true}
              onChange={(event) =>
                setDataParent({
                  ...dataParent,
                  configProdStatus: event.currentTarget.checked ? "Y" : "N",
                })
              }
            />
          </Box>
          <Radio.Group
            value={dataParent?.attributeGroup}
            onChange={(e) =>
              setDataParent({
                ...dataParent,
                attributeGroup: e,
              })
            }
            name="favoriteFramework"
            label="Phân loại"
            withAsterisk
          >
            <Box style={{ display: "flex", columnGap: 12, marginTop: 12 }}>
              <Radio value="G" label="Global" />
              <Radio value="L" label="Local" />
            </Box>
          </Radio.Group>
        </Group>
        <Children
          setListChildren={setListChildren}
          listChildren={listChildren}
        />
        <Group justify="flex-end" mt="lg">
          <Button
            type="button"
            color="#3598dc"
            onClick={handleCreateAttribute}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
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
