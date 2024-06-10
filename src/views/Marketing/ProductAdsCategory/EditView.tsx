import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv } from "@tabler/icons-react";
import { useEffect } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../model/MessageResponse";
import { tblProductAdsCategory } from "../../../model/TblProductAds";
import { modifyProductAdsCategory } from "../../../api/ApiProductAds";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const EditView = ({ id, onSearch }: any) => {
  const entity = {
    id: 0,
    categoryName: null,
    facebookFeed: null,
    googleFeed: null,
    description: null,
    creationDate: "",
    createdBy: "",
    lastUpdateDate: "",
    lastUpdateBy: "",
  };

  const handleEditProductAdsCategory = async (
    dataSubmit: tblProductAdsCategory
  ) => {
    open();
    await modifyProductAdsCategory(dataSubmit);
    close();
    modals.closeAll();
    onSearch();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<tblProductAdsCategory>({
    initialValues: {
      ...entity,
    },
    validate: {
      categoryName: isNotEmpty("Mã chưa chưa nhập"),
    },
  });

  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    const urlDetail = `tblProductAdsCategory/get-detail?Id=` + id;
    let callApi = await repository.get<MessageResponse<tblProductAdsCategory>>(
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
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: tblProductAdsCategory) => {
          handleEditProductAdsCategory(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên danh sách Ads"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("categoryName")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Facebook feed"}
            placeholder={"Nhập feed"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("facebookFeed")}
          />
          <TextInput
            label={"Google feed"}
            placeholder={"Nhập feed"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("googleFeed")}
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
