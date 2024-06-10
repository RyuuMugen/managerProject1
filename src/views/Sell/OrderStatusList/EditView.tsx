import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import Repository from "../../../_base/helper/HttpHelper";
import { TblStatus } from "../../../model/TblSaleOrder";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { API_ROUTE } from "../../../const/apiRoute";
import { editOrderDetail } from "../../../api/ApiOrderStatus";
import { TblOrderStatus } from "../../../model/TblOrderStatus";

const EditView = ({ onSearch, id }: any) => {
  const entity: TblOrderStatus = {
    id: 0,
    status: null,
    createdBy: null,
    description: null,
  };

  const handleCreateArticleCategory = async (dataSubmit: TblOrderStatus) => {
    open();
    await editOrderDetail(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<TblOrderStatus>({
    initialValues: {
      ...entity,
    },
    validate: {
      status: isNotEmpty("Trạng thái chưa nhập"),
      description: isNotEmpty("Trạng thái hệ thống chưa nhập"),
    },
  });

  useEffect(() => {
    const callApiGetData = async () => {
      open();
      const urlDetail = API_ROUTE.DETAIL_ORDER_STATUS + id;
      let callApi = await repository.get<MessageResponse<TblStatus>>(urlDetail);
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
    if (id || id === 0) {
      callApiGetData();
    }
  }, [id]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1000}
        maw={1000}
        mx="auto"
        onSubmit={form.onSubmit((e: TblOrderStatus) => {
          handleCreateArticleCategory(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Nhập trạng thái đơn hàng bán"}
            placeholder={"Trạng thái đơn hàng bán"}
            mt="md"
            withAsterisk
            type="text"
            {...form.getInputProps("status")}
          />

          <TextInput
            label={"Mô tả trạng thái đơn hàng bán"}
            placeholder={"Trạng thái đơn hàng bán"}
            mt="md"
            type="text"
            withAsterisk
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
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default EditView;
