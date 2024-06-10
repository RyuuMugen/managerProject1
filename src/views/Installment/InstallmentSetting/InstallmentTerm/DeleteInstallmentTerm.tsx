import { Button, Group, Text, Box } from "@mantine/core";
import "@mantine/dates/styles.css";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblInstallment } from "../../../../model/TblInstallment";
import { modifyInstallment } from "../../../../api/ApiInstallment";

const DeleteView = ({ idItem, prepayid, onSearch }: DeleteProduct) => {
  const [visible, { toggle, close, open }] = useDisclosure(true);
  const [isDataReady, setIsDataReady] = useState(false);

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

    validate: {},
  });

  const handleDeleteTerm = async (dataSubmit: TblInstallment) => {
    const index = form.values.tblInstallmentDurationCommands.findIndex(
      (item) => item.id === prepayid
    );

    if (index !== -1) {
      form.values.tblInstallmentDurationCommands.splice(index, 1);
    }

    modifyInstallment(dataSubmit);
    onSearch();
    modals.closeAll();
  };

  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    open();
    const urlDetail = `${API_ROUTE.DETAIL_INSTALLMENT}?id=` + idItem;
    let callApi = await repository.get<MessageResponse<TblInstallment>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setIsDataReady(true);
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
  }, [idItem]);

  return (
    <div>
      <Box
        className="flex-none"
        component="form"
        miw={600}
        maw={600}
        mx="auto"
        onSubmit={form.onSubmit((e: TblInstallment) => {
          handleDeleteTerm(e);
        })}
      >
        <Text size="24px">Bạn có chắc chắn muốn xóa kỳ hạn trước này</Text>
        <Group justify="center" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            leftSection={<IconCheck size={18} />}
          >
            Xóa
          </Button>
          <Button
            type="button"
            color="#3598dc"
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Hủy
          </Button>
        </Group>
      </Box>
    </div>
  );
};

type DeleteProduct = {
  idItem: number;
  prepayid: number;
  onSearch: () => void;
};

export default DeleteView;
