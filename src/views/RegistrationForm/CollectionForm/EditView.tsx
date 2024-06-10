import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { modifyTradeInOrder } from "../../../api/ApiTradeIn";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblCollectionForm } from "../../../model/TblCollectionForm";
import { EuiLink } from "@elastic/eui";

const CreateView = ({ id, onSearch }: CreateViewProps) => {
  const [data, setData] = useState<TblCollectionForm>();
  // const entity = {
  //   id: 0,
  //   fullname: null,
  //   mobile: null,
  //   email: null,
  //   productName: null,
  //   productId: null,
  //   keyword: null,
  // };

  const handleCreateProductDeal = async (dataSubmit: TblCollectionForm) => {
    open();
    await modifyTradeInOrder(dataSubmit);
    onSearch();
    close();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  // const form = useForm<TblCollectionForm>({
  //   initialValues: {
  //     ...entity,
  //   },
  //   validate: {},
  // });

  const callApiGetData = async () => {
    open();
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL2);
    let urlCreate = API_ROUTE.DETAIL_COLLECTION_FORM + `?id=${id}`;
    let callapi = await repository.get<MessageResponse<TblCollectionForm>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        // form.setValues(dataApi);
        setData(dataApi);
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
        // component="form"
        miw={950}
        maw={950}
        mx="auto"
        // onSubmit={form.onSubmit((e: TblCollectionForm) => {
        //   handleCreateProductDeal(e);
        // })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Table horizontalSpacing="sm" withColumnBorders mt={"lg"}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Họ tên:</Table.Td>
              <Table.Td>{data?.fullname}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Email:</Table.Td>
              <Table.Td>{data?.email}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Điện thoại:</Table.Td>
              <Table.Td>{data?.mobile}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Sản phẩm:</Table.Td>
              <Table.Td>
                <EuiLink target="_blank">{data?.productName}</EuiLink>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Thời gian:</Table.Td>
              <Table.Td>{data?.creationDate}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>

        <Group justify="flex-end" mt="lg">
          {/* <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button> */}
          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
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

export default CreateView;

type CreateViewProps = {
  id: number;
  onSearch: Function;
};
