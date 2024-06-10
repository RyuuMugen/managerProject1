import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import "@mantine/dates/styles.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { modifyInstallment } from "../../../../api/ApiInstallment";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblInstallment } from "../../../../model/TblInstallment";

const CreateView = ({
  id,
  onClose,
  load,
  onSearch,
}: {
  id: number;
  onClose: any;
  load: number;
  onSearch: () => void;
}) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [isContinue, setIsContinue] = useState(true);
  const [inputInstallmentName, setInstallmentName] = useState("");
  const [inputPrepayment, setPrepayment] = useState(0);
  const [inputDisplayOrder, setDisplayOrder] = useState(0);

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
      tblInstallmentPayCommands: {
        installmentName: isNotEmpty("Số tháng chưa nhập"),
        prepayment: isNotEmpty("Lãi suất chưa nhập"),
      },
    },
  });

  const handleCreatePayment = async (dataSubmit: TblInstallment) => {
    open();
    const dataPrepay = {
      id: 0,
      installmentName: inputInstallmentName,
      prepayment: inputPrepayment,
      displayOrder: inputDisplayOrder,
      installmentId: dataSubmit.tblInstallmentModel.id,
    };
    form.values.tblInstallmentPayCommands.push(dataPrepay);
    modifyInstallment(dataSubmit);
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
        form.setValues(dataApi);
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
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <TextInput
          label={"Tên gọi (* dùng để hiển thị trên web, ví dụ ghi 20 %)"}
          placeholder={"Nhập tên gọi"}
          withAsterisk
          mt="md"
          type="text"
          onChange={(e) => setInstallmentName(e.target.value)}
          // {...form.getInputProps("tblInstallmentPayCommands.installmentName")}
        />

        <TextInput
          label={"Số phần trăm (* ghi số, ví dụ: 20% thì ghi là 20)"}
          placeholder={"Nhập phần trăm"}
          withAsterisk
          mt="md"
          type="number"
          onChange={(e) => setPrepayment(parseInt(e.target.value))}
          // {...form.getInputProps("tblInstallmentPayCommands.prepayment")}
        />

        <TextInput
          label={"Thứ tự hiển thị  (* số lớn đứng đầu)"}
          placeholder={"Nhập thứ tự"}
          withAsterisk
          mt="md"
          type="number"
          defaultValue={0}
          onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
          // {...form.getInputProps("tblInstallmentPayCommands.displayOrder")}
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

export default CreateView;
