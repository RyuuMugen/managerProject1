import {
  FileInput,
  LoadingOverlay,
  TextInput,
  Textarea,
  rem,
  Anchor,
  Box,
  Button,
  Checkbox,
  Loader,
  Flex,
  Group,
  Select,
  Text,
  ScrollArea,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv } from "@tabler/icons-react";
import { tblBanner, tblBannerLocation } from "../../../model/TblBanner";
import {
  createBanner,
  getDataBannerLocation,
} from "../../../api/ApiBannerManager";
import { DateTimePicker } from "@mantine/dates";
import moment from "moment";
import Repository from "../../../_base/helper/HttpHelper";
import { CategoryTree } from "../../../model/TblCategoryCommand";
import { TblItemCategoryCommand } from "../../../model/ProductList";
import React, { useEffect, useState } from "react";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import ImageShow from "../../../_base/component/_image";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const CreateView = ({ onSearch }: any) => {
  const [dataCategory, setDataCategory] = useState<CategoryTree[]>([]);
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [dataBannerLocation, setDataBannerLocation] = useState<
    tblBannerLocation[]
  >([]);
  const [dataOptionBannerLocation, setDataOptionBannerLocation] = useState<
    any[]
  >([]);
  const entity = {
    id: 0,
    code: null,
    name: null,
    bannerUrlPrimary: null,
    linkPage: null,
    bannerLocationId: null,
    title: null,
    bannerWidth: null,
    bannerHeight: null,
    fileBanner: null,
    bannerUrl: null,
    bannerUrlTarget: null,
    orderNumber: null,
    description: null,
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
    status: null,
    type: null,
    mobileStatus: null,
    templatePage: null,
    locationIndex: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdateLogin: null,
    listCategoryId: null,
  };

  const handleCreateBanner = async (dataSubmit: tblBanner) => {
    open();
    await createBanner(dataSubmit);
    close();
    modals.closeAll();
    onSearch();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<tblBanner>({
    initialValues: {
      ...entity,
    },
    validate: {
      bannerLocationId: isNotEmpty("Chưa chọn vị trí Banner"),
      name: isNotEmpty("Tên banner chưa nhập"),
      code: isNotEmpty("Mã banner chưa nhập"),
      bannerWidth: isNotEmpty("Chiều rộng banner chưa nhập"),
      bannerHeight: isNotEmpty("Chiều dài banner chưa nhập"),
      fileBanner: isNotEmpty("Chưa chọn File Banner"),
      bannerUrlTarget: isNotEmpty("Link URL đích chưa nhập"),
      status: isNotEmpty("Loại hiển thị chưa chọn"),
    },
  });

  const loadDataBannerLocation = async () => {
    setDataBannerLocation([]);
    const data = await getDataBannerLocation("Active=true&Skip=0&Take=1000");
    setDataBannerLocation(data?.data);
  };

  const handleClickCategoryName = (id: number) => {
    var element = document.getElementById(id.toString());
    if (element) {
      element.style.display =
        element.style.display === "block" ? "none" : "block";
    }
  };

  const handleChangeCheckBox = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedValues([...selectedValues, categoryId]);
    } else {
      setSelectedValues(selectedValues.filter((value) => value !== categoryId));
    }
  };

  const flattenCategoryTree = (
    categories: CategoryTree[],
    level = 0,
    idParent = 0
  ) => {
    return (
      <div
        id={idParent.toString()}
        style={{ display: level ? "none" : "block" }}
      >
        {categories?.flatMap((category) => {
          return (
            <React.Fragment key={category?.id}>
              <Flex pl={level * 30} mt={5}>
                <Text mr={5} mt={-3}>
                  +
                </Text>
                <Checkbox
                  label={
                    category?.categoryChildModels.length > 0 ? (
                      <Anchor
                        underline="always"
                        href="javascript:void(0)"
                        onClick={() => handleClickCategoryName(category?.id)}
                      >
                        {category?.categoryName}
                      </Anchor>
                    ) : (
                      <Text>{category?.categoryName}</Text>
                    )
                  }
                  checked={selectedValues.includes(category?.id)}
                  onChange={(e) =>
                    handleChangeCheckBox(category?.id, e.currentTarget.checked)
                  }
                />
              </Flex>

              {category?.categoryChildModels.length > 0 &&
                flattenCategoryTree(
                  category.categoryChildModels,
                  level + 1,
                  category.id
                )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    loadDataBannerLocation();
  }, []);

  useEffect(() => {
    const callDataCategoryTree = async () => {
      // setLoading(true);
      // setError(undefined);
      try {
        const repository = new Repository(
          process.env.REACT_APP_Demo_APP_API_URL
        );
        let urlSearch =
          API_ROUTE.GET_CATEGORY_TREE +
          `?CategoryType=category&IsTradeIn=N&Skip=0&Take=2000`;
        let callapi = await repository.get<MessageResponse<CategoryTree[]>>(
          urlSearch
        );
        if (
          isNullOrUndefined(callapi) ||
          isNullOrUndefinedArry(callapi?.data)
        ) {
          setDataCategory([]);
        } else {
          setDataCategory(callapi?.data ?? []);
        }
        return callapi?.data;
      } catch (error: any) {
        setError("Có lỗi xảy ra khi tải dữ liệu !");
        return null;
      } finally {
        // setLoading(false);
      }
    };
    callDataCategoryTree();
  }, []);

  useEffect(() => {
    setDataOptionBannerLocation(
      dataBannerLocation.map((option) => {
        if (option.status === "A")
          return { value: option.id.toString(), label: option.bannerLocName };
        else
          return {
            value: option.id.toString(),
            label: option.bannerLocName,
          };
      })
    );
  }, [dataBannerLocation]);

  useEffect(() => {
    const dataToString = selectedValues.join(", "); // Chuỗi sau khi biến đổi: "xx, yy"
    form.setFieldValue("listCategoryId", `"${dataToString}"`);
  }, [selectedValues]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1000}
        maw={1000}
        mx="auto"
        onSubmit={form.onSubmit((e: tblBanner) => {
          handleCreateBanner(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Vị trí Banner"}
            placeholder={""}
            withAsterisk
            clearable
            data={dataOptionBannerLocation}
            nothingFoundMessage="Không có dữ liệu"
            value={form.values.bannerLocationId?.toString()}
            onChange={(e) => (form.values.bannerLocationId = Number(e))}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Box>
            <Text mt={"xs"} fw={600}>
              Hãy chọn danh mục cho banner
            </Text>
            {dataCategory.length > 0 ? (
              <ScrollArea h={250}>
                <Box>{flattenCategoryTree(dataCategory || [])}</Box>
              </ScrollArea>
            ) : (
              <Loader color="indigo" type="bars" />
            )}
          </Box>
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên banner"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("name")}
          />
          <TextInput
            label={"Mã banner"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("code")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Ghi chú / Mô tả"}
            placeholder={"Nhập ghi chú"}
            mt="md"
            {...form.getInputProps("description")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Chiều dài (width)"}
            placeholder={"Nhập chiều dài"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("bannerWidth")}
          />
          <TextInput
            label={"Chiều cao (height"}
            placeholder={"Nhập chiều cao"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("bannerHeight")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <FileInput
            leftSection={icon}
            label={"Ảnh đại diện"}
            placeholder={"Chọn ảnh"}
            accept="image/png,image/jpeg"
            withAsterisk
            clearable
            mt="md"
            mb="md"
            {...form.getInputProps("fileBanner")}
          />
          {form.values.fileBanner ? (
            <ImageShow
              h={200}
              w={300}
              img={
                form.values.fileBanner instanceof File
                  ? URL.createObjectURL(form.values.fileBanner)
                  : form.values.fileBanner
              }
            />
          ) : (
            <Box></Box>
          )}
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Hoặc điền địa chỉ đầy đủ trên mạng"}
            placeholder={""}
            mt="md"
            type="text"
            {...form.getInputProps("bannerUrl")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Địa chỉ URL đích"}
            placeholder={"Nhập URL đích"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("bannerUrlTarget")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Thứ tự hiển thị"}
            placeholder={"Nhập thứ tự"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("orderNumber")}
          />
          <Select
            label={"Loại hiển thị"}
            placeholder={""}
            withAsterisk
            mt="md"
            data={[
              {
                value: "ALWAYS",
                label: "Luôn hiển thị, chỉ ẩn khi hạ bằng tay",
              },
              {
                value: "LIMIT",
                label: "Thời gian hiển thị",
              },
            ]}
            {...form.getInputProps("type")}
          />
        </Group>

        <Group grow wrap="wrap" gap={"lg"}>
          <DateTimePicker
            disabled={form.values.type === "ALWAYS" || null ? true : false}
            value={
              form.getInputProps("fromDate").value
                ? new Date(form.getInputProps("fromDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("fromDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày bắt đầu"
            placeholder="Ngày bắt đầu"
          />
          <DateTimePicker
            disabled={form.values.type === "ALWAYS" || null ? true : false}
            value={
              form.getInputProps("toDate").value
                ? new Date(form.getInputProps("toDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("toDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày kết thúc"
            placeholder="Ngày kết thúc"
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Hiển thị"}
            placeholder={""}
            data={[
              {
                value: "A",
                label: "Hiển thị",
              },
              {
                value: "I",
                label: "Không hiển thị",
              },
            ]}
            {...form.getInputProps("status")}
          />
          <Select
            label={"Khác"}
            placeholder={""}
            data={[
              {
                value: "A",
                label: "Hiển thị tại mobile",
              },
              {
                value: "I",
                label: "Không hiển thị tại mobile",
              },
            ]}
            {...form.getInputProps("mobileStatus")}
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
