import {
  Box,
  Button,
  FileInput,
  Group,
  Select,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import { urlToImageFile } from "../../../_base/helper/FunctionHelper";
import { TblConfigWebBanner } from "../../../model/TblConfigWeb";

const ConfigBannerPopUp = ({
  dataBanner,
  handelChangeConfigWebBannerTabs,
}: ConfigBannerPopUpProps) => {
  const [isImageChange, setIsImageChange] = useState<boolean>(false);
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

    validate: {
      bannerImgUrl: (value) => {
        if (value instanceof File) {
          const allowedExtensions = [".jpg", ".png"];
          const fileName = value.name.toLowerCase();

          if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            return "Logo phải có dạng .jpg hoặc .png";
          }
        }
      },
    },
  });

  const handleChangeImage = (file: File | null) => {
    form.getInputProps("bannerImgUrl").onChange(file);
    setIsImageChange(true);
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
    if (isImageChange) {
      data = { ...restGroup, bannerImgUrl: bannerImgUrl };
    } else data = restGroup;

    handelChangeConfigWebBannerTabs(data);
  };

  useEffect(() => {
    const getImage = async () => {
      if (dataBanner) {
        var data = dataBanner;
        if (
          data.bannerImgUrl !== null &&
          data.bannerImgUrl !== undefined &&
          typeof data.bannerImgUrl == "string"
        ) {
          data.bannerImgUrl = await urlToImageFile(data.bannerImgUrl);
        }

        form.setValues(data);
      }
    };
    getImage();
  }, [dataBanner]);

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
      <Group grow wrap="nowrap" mt="sm" gap={"lg"}>
        <TextInput
          label={"Link nhảy đến"}
          placeholder={"Nhập link"}
          type="text"
          {...form.getInputProps("linkBanner")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <FileInput
          label={"File ảnh"}
          placeholder={"Chọn ảnh"}
          clearable
          accept="image/png,image/jpeg"
          mb="md"
          {...form.getInputProps("bannerImgUrl")}
          onChange={handleChangeImage}
        />
        {form.values.bannerImgUrl ? (
          <ImageShow
            h={200}
            w={300}
            img={
              form.values.bannerImgUrl instanceof File
                ? URL.createObjectURL(form.values.bannerImgUrl)
                : form.values.bannerImgUrl
            }
          />
        ) : (
          <></>
        )}
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <Select
          label="Lựa chọn hiển thị người dùng"
          placeholder="Chọn hiển thị"
          data={["Theo session", "Trang chủ website"]}
          searchable
          {...form.getInputProps("visibaleType")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <Select
          label={"Trạng thái"}
          placeholder={"Hiển thị/Không hiển thị"}
          data={[
            { value: "A", label: "Hiển thị" },
            { value: "I", label: "Không hiển thị" },
          ]}
          {...form.getInputProps("status")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <Select
          label="Vị trí hiển thị"
          placeholder="Chọn vị trí"
          data={["Cả PC & Mobile", "Chỉ PC", "Chỉ Mobile"]}
          searchable
          {...form.getInputProps("visibaleType")}
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

export default ConfigBannerPopUp;

type ConfigBannerPopUpProps = {
  dataBanner: TblConfigWebBanner | null;
  handelChangeConfigWebBannerTabs: (data: TblConfigWebBanner) => void;
};
