import { Box, Button, FileInput, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import { urlToImageFile } from "../../../_base/helper/FunctionHelper";
import { TblConfigWebBanner } from "../../../model/TblConfigWeb";

const ConfigBannerBgWebsite = ({
  dataBanner,
  handelChangeConfigWebBannerTabs,
}: ConfigBannerBgWebsiteProps) => {
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
      wallpaperImgUrl: (value) => {
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
    form.getInputProps("wallpaperImgUrl").onChange(file);
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
      data = { ...restGroup, wallpaperImgUrl: wallpaperImgUrl };
    } else data = restGroup;

    handelChangeConfigWebBannerTabs(data);
  };

  useEffect(() => {
    const getImage = async () => {
      if (dataBanner) {
        var data = dataBanner;
        if (
          data.wallpaperImgUrl !== null &&
          data.wallpaperImgUrl !== undefined &&
          typeof data.wallpaperImgUrl == "string"
        ) {
          data.wallpaperImgUrl = await urlToImageFile(data.wallpaperImgUrl);
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
          label={"Dùng màu nền:"}
          placeholder={"Nhập màu"}
          type="text"
          {...form.getInputProps("wallpaperColorCode")}
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
          {...form.getInputProps("wallpaperImgUrl")}
          onChange={handleChangeImage}
        />
        {form.values.wallpaperImgUrl ? (
          <ImageShow
            h={200}
            w={300}
            img={
              form.values.wallpaperImgUrl instanceof File
                ? URL.createObjectURL(form.values.wallpaperImgUrl)
                : form.values.wallpaperImgUrl
            }
          />
        ) : (
          <></>
        )}
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

export default ConfigBannerBgWebsite;

type ConfigBannerBgWebsiteProps = {
  dataBanner: TblConfigWebBanner | null;
  handelChangeConfigWebBannerTabs: (data: TblConfigWebBanner) => void;
};
