import { Box, Button, Group, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TblConfigWebBanner } from "../../../model/TblConfigWeb";
import { IconEdit } from "@tabler/icons-react";

const ConfigBannerOtherInformation = ({
  dataBanner,
  handelChangeConfigWebBannerTabs,
}: ConfigBannerOtherInformationProps) => {
  const [data, setData] = useState<any>();
  const entity: TblConfigWebBanner = {
    logoUrl: null,
    faviconUrl: null,
    sitemapUrl: null,
    robotUrl: null,
    headerWidth: null,
    headerHeight: null,
    headerImgUrl: null,
    linkBanner: null,
    bannerImgUrl: null,
    visibaleType: null,
    status: null,
    visible: null,
    wallpaperColorCode: null,
    wallpaperImgUrl: null,
    other: null,
    customDesc1: null,
    customTitle1: null,
    timeDeal: null,
    videoPopup: null,
    fanpage: null,
    videoMainPage: null,
    videoFotter: null,
    customTitle2: null,
    customDesc2: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
  };

  const form = useForm<TblConfigWebBanner>({
    initialValues: {
      ...entity,
    },

    validate: {},
  });

  const [selectedValues, setSelectedValues] = useState<any[]>([]);

  const handleAddSelect = () => {
    setSelectedValues([...selectedValues, {}]);
  };

  const handleRemoveSelect = (index: number) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues.splice(index, 1);
    setSelectedValues(newSelectedValues);
  };

  const handleChange = (
    valueSelectCategory: string,
    index: number,
    field: string
  ) => {
    const data = [...selectedValues];
    const itemToUpdate = data[index];

    // Cập nhật giá trị cho trường cụ thể (field)
    itemToUpdate[field] = valueSelectCategory;

    setSelectedValues(data);
  };

  const handleSubmitForm = (dataSubmit: TblConfigWebBanner) => {
    let data: any = {};
    const {
      wallpaperImgUrl,
      logoUrl,
      headerImgUrl,
      bannerImgUrl,
      faviconUrl,
      sitemapUrl,
      robotUrl,
      ...restGroup
    } = dataSubmit;
    data = restGroup;
    handelChangeConfigWebBannerTabs(data);
  };

  useEffect(() => {
    if (dataBanner) {
      form.setValues(dataBanner);
      setSelectedValues(dataBanner.other || []);
    }
  }, [dataBanner]);

  useEffect(() => {
    const handleEditConfigWebOtherInfo = () => {
      form.values.other = selectedValues;
    };
    if (selectedValues) {
      handleEditConfigWebOtherInfo();
    }
  }, [selectedValues]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1000}
      maw={1000}
      mx={"sm"}
      mb={"md"}
      onSubmit={form.onSubmit((e: TblConfigWebBanner) => {
        handleSubmitForm(e);
      })}
    >
      <Text fw={600}>Hãy chọn danh mục cho sản phẩm</Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddSelect}>
        Thêm danh mục
      </Button>

      {selectedValues?.map((item, index) => (
        <div key={index}>
          <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
            <TextInput
              label={"Tên biến :"}
              placeholder={"Nhập tên"}
              type="text"
              onChange={(value) =>
                handleChange(value.target.value, index, "code")
              }
              value={selectedValues[index]?.code}
            />
            <Button
              mt={"lg"}
              style={{ maxWidth: 80 }}
              type="button"
              color="red"
              onClick={() => handleRemoveSelect(index)}
            >
              Xóa
            </Button>
          </Group>

          <Textarea
            label={"Giá trị của biến :"}
            onChange={(value) =>
              handleChange(value.target.value, index, "name")
            }
            value={selectedValues[index]?.name}
          />
        </div>
      ))}
      <Group justify="start" mt="lg">
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

export default ConfigBannerOtherInformation;

type ConfigBannerOtherInformationProps = {
  dataBanner: TblConfigWebBanner | null;
  handelChangeConfigWebBannerTabs: (data: TblConfigWebBanner) => void;
};
