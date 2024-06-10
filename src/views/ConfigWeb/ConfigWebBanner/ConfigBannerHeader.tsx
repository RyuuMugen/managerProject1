import {
  Anchor,
  Box,
  Button,
  FileInput,
  Flex,
  Group,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import { urlToImageFile } from "../../../_base/helper/FunctionHelper";
import { TblConfigWebBanner } from "../../../model/TblConfigWeb";

interface IsImageChangeType {
  logoUrl: boolean;
  headerImgUrl: boolean;
  faviconUrl: boolean;
  sitemapUrl: boolean;
  robotUrl: boolean;
}

const ConfigBannerHeader = ({
  dataBanner,
  handelChangeConfigWebBannerTabs,
}: ConfigBannerHeaderProps) => {
  const [isImageChange, setIsImageChange] = useState<IsImageChangeType>({
    logoUrl: false,
    headerImgUrl: false,
    faviconUrl: false,
    sitemapUrl: false,
    robotUrl: false,
  });
  const [robotsUrl, setRobotsUrl] = useState<File | string>();

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
      headerWidth: isNotEmpty("Chưa nhập chiều rộng header"),
      headerHeight: isNotEmpty("Chưa nhập chiều cao header"),
      logoUrl: (value) => {
        if (value instanceof File) {
          const allowedExtensions = [".jpg", ".png"];
          const fileName = value.name.toLowerCase();

          if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            return "Logo phải có dạng .jpg hoặc .png";
          }
        }
      },
      faviconUrl: (value) => {
        if (value instanceof File) {
          const allowedExtensions = [".ico"];
          const fileName = value.name.toLowerCase();

          if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            return "Logo phải có dạng .ico";
          }
        }
      },
      sitemapUrl: (value) => {
        if (value instanceof File) {
          const allowedExtensions = [".xml"];
          const fileName = value.name.toLowerCase();

          if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            return "Logo phải có dạng .xml";
          }
        }
      },
      robotUrl: (value) => {
        if (value instanceof File) {
          const allowedExtensions = [".txt"];
          const fileName = value.name.toLowerCase();

          if (!allowedExtensions.some((ext) => fileName.endsWith(ext))) {
            return "Logo phải có dạng .txt";
          }
        }
      },
      headerImgUrl: (value) => {
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

  const handleChangeImage = (file: File | null, key: string) => {
    form.getInputProps(`${key}`).onChange(file);
    setIsImageChange((prevData) => ({ ...prevData, [key]: true }));
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
    data = { ...restGroup };

    const fileFields = [
      "headerImgUrl",
      "logoUrl",
      "faviconUrl",
      "sitemapUrl",
      "robotUrl",
    ];
    fileFields.forEach((field) => {
      if ((isImageChange as any)[field]) {
        data[field] = (dataSubmit as any)[field];
      }
    });

    handelChangeConfigWebBannerTabs(data);
  };

  useEffect(() => {
    const getImage = async () => {
      if (dataBanner) {
        var data = dataBanner;
        if (
          data.logoUrl !== null &&
          data.logoUrl !== undefined &&
          typeof data.logoUrl == "string"
        ) {
          data.logoUrl = await urlToImageFile(data.logoUrl);
        }
        if (
          data.headerImgUrl !== null &&
          data.headerImgUrl !== undefined &&
          typeof data.headerImgUrl == "string"
        ) {
          data.headerImgUrl = await urlToImageFile(data.headerImgUrl);
        }
        if (
          data.robotUrl !== null &&
          data.robotUrl !== undefined &&
          typeof data.robotUrl == "string"
        ) {
          setRobotsUrl((await urlToImageFile(data.robotUrl)) || "");
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
      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <FileInput
          label={"Thay Logo"}
          placeholder={"Chọn Logo"}
          clearable
          accept="image/png,image/jpeg"
          mb="md"
          {...form.getInputProps("logoUrl")}
          onChange={(file) => handleChangeImage(file, "logoUrl")}
        />
        {form.values.logoUrl ? (
          <ImageShow
            h={200}
            w={300}
            img={
              form.values.logoUrl instanceof File
                ? URL.createObjectURL(form.values.logoUrl)
                : form.values.logoUrl
            }
          />
        ) : (
          <Box></Box>
        )}
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <FileInput
          label={"Thay Favicon (favicon.ico)"}
          placeholder={"Chọn Favicon"}
          accept=".ico"
          clearable
          mb="md"
          {...form.getInputProps("faviconUrl")}
          onChange={(file) => handleChangeImage(file, "faviconUrl")}
        />
        {form.values.faviconUrl ? (
          <Anchor
            href={
              typeof form.values.faviconUrl === "string"
                ? form.values.faviconUrl
                : undefined
            }
            lineClamp={1}
          >
            {form.values.faviconUrl instanceof File
              ? null
              : form.values.faviconUrl}
          </Anchor>
        ) : (
          <Box></Box>
        )}
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <FileInput
          label={"Thay Sitemap (sitemap.xml)"}
          placeholder={"Chọn Sitemap"}
          accept=".xml"
          clearable
          mb="md"
          {...form.getInputProps("sitemapUrl")}
          onChange={(file) => handleChangeImage(file, "sitemapUrl")}
        />
        {form.values.sitemapUrl ? (
          <Anchor
            href={
              typeof form.values.sitemapUrl === "string"
                ? form.values.sitemapUrl
                : undefined
            }
            lineClamp={1}
          >
            {form.values.sitemapUrl instanceof File
              ? null
              : form.values.sitemapUrl}
          </Anchor>
        ) : (
          <Box></Box>
        )}
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <FileInput
          label={`Thay Robots.txt (robots.txt)`}
          placeholder={"Chọn Robots"}
          accept=".txt"
          clearable
          mb="md"
          {...form.getInputProps("robotUrl")}
          onChange={(file) => handleChangeImage(file, "robotUrl")}
        />
        {form.values.robotUrl ? (
          <Anchor
            href={
              typeof form.values.robotUrl === "string"
                ? form.values.robotUrl
                : undefined
            }
            lineClamp={1}
          >
            {form.values.robotUrl instanceof File ? null : form.values.robotUrl}
          </Anchor>
        ) : (
          <Box></Box>
        )}
      </Group>

      <Text size="sm" mt="md" fw={500}>
        Thay ảnh header
      </Text>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"} style={{ width: 300 }}>
        <Text size="sm" style={{ maxWidth: 80 }}>
          Width (rộng) :
        </Text>

        <Flex style={{ minWidth: 200 }} gap={"xs"} align={"center"}>
          <TextInput
            placeholder={""}
            type="text"
            width={200}
            withAsterisk
            {...form.getInputProps("headerWidth")}
          />
          <Text size="sm">px</Text>
        </Flex>
      </Group>

      <Group grow wrap="nowrap" mt="sm" gap={"lg"} style={{ width: 300 }}>
        <Text size="sm" style={{ maxWidth: 80 }}>
          Height (cao):
        </Text>

        <Flex style={{ minWidth: 200 }} gap={"xs"} align={"center"}>
          <TextInput
            placeholder={""}
            type="text"
            width={200}
            {...form.getInputProps("headerHeight")}
            withAsterisk
          />
          <Text size="sm">px</Text>
        </Flex>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <FileInput
          placeholder={"Chọn ảnh"}
          clearable
          accept="image/png,image/jpeg"
          mb="md"
          {...form.getInputProps("headerImgUrl")}
          onChange={(file) => handleChangeImage(file, "headerImgUrl")}
        />
        {form.values.headerImgUrl ? (
          <ImageShow
            h={200}
            w={300}
            img={
              form.values.headerImgUrl instanceof File
                ? URL.createObjectURL(form.values.headerImgUrl)
                : form.values.headerImgUrl
            }
          />
        ) : (
          <Box></Box>
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

export default ConfigBannerHeader;

type ConfigBannerHeaderProps = {
  dataBanner: TblConfigWebBanner | null;
  handelChangeConfigWebBannerTabs: (data: TblConfigWebBanner) => void;
};
