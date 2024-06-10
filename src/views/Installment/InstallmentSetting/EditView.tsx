import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import "@mantine/dates/styles.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblInstallment } from "../../../model/TblInstallment";
import { modifyInstallment } from "../../../api/ApiInstallment";
const EditView = ({
  id,
  onClose,
  onSearch,
}: {
  id: number;
  onClose: any;
  onSearch: () => void;
}) => {
  const [visible, { toggle, close, open }] = useDisclosure(true);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [isContinue, setIsContinue] = useState(true);

  const entity: TblInstallment = {
    tblInstallmentCommand: {
      id: 0,
      companyCode: null,
      companyName: null,
      desciption: null,
      active: null,
      createdBy: null,
      creationDate: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
    },
    tblInstallmentPayCommands: [],
    tblInstallmentDurationCommands: [],
    tblInstallmentModel: {
      id: 0,
      companyCode: null,
      companyName: null,
      desciption: null,
      active: null,
      createdBy: null,
      creationDate: null,
      lastUpdateBy: null,
      lastUpdateDate: null,
    },
    tblInstallmentPayModels: [],
    tblInstallmentDurationModels: [],
  };

  const form = useForm<TblInstallment>({
    initialValues: {
      ...entity,
    },

    validate: {
      tblInstallmentCommand: {
        companyName: isNotEmpty("Tên công ty chưa nhập"),
        companyCode: isNotEmpty("Mã công ty chưa nhập"),
        active: isNotEmpty("Chưa chọn trạng thái"),
      },
    },
  });

  const handleCreatePayment = async (dataSubmit: TblInstallment) => {
    open();
    const {
      tblInstallmentModel,
      tblInstallmentPayModels,
      tblInstallmentDurationModels,
      ...rest
    } = dataSubmit;

    await modifyInstallment(rest);
    onSearch();
    modals.closeAll();
  };

  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    open();
    const urlDetail = `${API_ROUTE.DETAIL_INSTALLMENT}?id=` + id;
    let callApi = await repository.get<MessageResponse<TblInstallment>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        form.setFieldValue(
          "tblInstallmentCommand",
          dataApi.tblInstallmentModel
        );
        form.setFieldValue(
          "tblInstallmentPayCommands",
          dataApi.tblInstallmentPayModels
        );
        form.setFieldValue(
          "tblInstallmentDurationCommands",
          dataApi.tblInstallmentDurationModels
        );
        form.resetDirty(dataApi);
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
        miw={600}
        maw={600}
        mx="auto"
        onSubmit={form.onSubmit((e: TblInstallment) => {
          handleCreatePayment(e);
        })}
      >
        <LoadingOverlay
          // visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <TextInput
          label={"Tên công ty"}
          placeholder={"Nhập tên công ty"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("tblInstallmentCommand.companyName")}
        />

        <TextInput
          label={"Mã công ty"}
          placeholder={"Nhập mã công ty"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("tblInstallmentCommand.companyCode")}
        />

        <TextInput
          label={"Mô tả công ty"}
          placeholder={"Nhập mô tả công ty"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("tblInstallmentCommand.desciption")}
        />

        {/* <TextInput
          label={"Thứ tự hiển thị"}
          placeholder={"Nhập Thứ tự hiển thị"}
          withAsterisk
          mt="md"
          type="number"
          {...form.getInputProps("tagUrl")}
        /> */}

        <Select
          label={"Trạng thái"}
          placeholder={"Trạng thái"}
          // withAsterisk
          mt="md"
          data={[
            { value: "A", label: "Kích hoạt" },
            { value: "I", label: "Không kích hoạt" },
          ]}
          {...form.getInputProps("tblInstallmentCommand.active")}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            onClick={() => {
              setIsContinue(false);
            }}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>

          <Button
            variant="outline"
            color="black"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={!visible ? <IconX size={18} /> : undefined}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default EditView;
