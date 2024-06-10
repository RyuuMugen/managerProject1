import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Tabs,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import { API_ROUTE } from "../../../../const/apiRoute";
import Repository from "../../../../_base/helper/HttpHelper";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblConfigGroup } from "../../../../model/TblConfigGroup";
import { isNotEmpty, useForm } from "@mantine/form";
import { editConfigGroup } from "../../../../api/ApiConfigGroup";
import ConfigGroupAttribute from "./ConfigGroupAttribute";
import { useLocation, useNavigate } from "react-router-dom";
import ConfigGroupProduct from "./ConfigGroupProduct";

const EditViewConfigGroup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state && location.state.id;
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [data, setData] = useState<TblConfigGroup>();
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);

  const entity = {
    id: 0,
    name: "",
    description: "",
    searchFulltext: "",
    configGroupType: "",
  };

  const form = useForm<TblConfigGroup>({
    initialValues: {
      ...entity,
    },
    validate: {
      name: isNotEmpty("Tên nhóm chưa chưa nhập"),
    },
  });

  const handleEditConfigGroup = async (dataSubmit: TblConfigGroup) => {
    open();
    const {
      tblConfigGroupAttributeModels,
      tblConfigGroupProductModels,
      ...restGroup
    } = dataSubmit;
    await editConfigGroup(restGroup);
    close();
  };

  const callApiGetData = async () => {
    open();
    let urlCreate = API_ROUTE.DETAIL_CONFIG_GROUP + id;
    let callapi = await repository.get<MessageResponse<TblConfigGroup>>(
      urlCreate
    );
    if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
      const dataApi = callapi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setData(dataApi);
        form.setValues(dataApi);
      }
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
    close();
  };

  useEffect(() => {
    callApiGetData();
  }, [id]);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Tabs defaultValue="info1" style={{ position: "relative" }}>
        <Tabs.List
          style={{
            position: "sticky",
            top: 52,
            zIndex: 1,
            backgroundColor: "white",
          }}
        >
          <Tabs.Tab value="info1">Thông tin</Tabs.Tab>
          <Tabs.Tab value="info2">Thuộc tính</Tabs.Tab>
          <Tabs.Tab value="info3">Sản phẩm</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="info1">
          <Box
            miw={950}
            maw={950}
            component="form"
            onSubmit={form.onSubmit((e: TblConfigGroup) => {
              handleEditConfigGroup(e);
            })}
          >
            <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
              <TextInput
                label={"Tên nhóm"}
                placeholder={"Nhập tên nhóm"}
                withAsterisk
                mt="md"
                type="text"
                {...form.getInputProps("name")}
              />
            </Group>

            <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
              <Textarea
                label={"Mô tả tóm tắt"}
                placeholder={"Nhập mô tả"}
                mt="md"
                {...form.getInputProps("description")}
              />
            </Group>

            <Group justify="flex-end" mt="lg">
              <Button
                type="submit"
                color="#3598dc"
                loading={visible}
                leftSection={<IconCheck size={18} />}
              >
                Cập nhật
              </Button>
            </Group>
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="info2">
          <ConfigGroupAttribute
            idGroup={id}
            dataConfigGroupAttribute={data?.tblConfigGroupAttributeModels || []}
            callApiGetData={callApiGetData}
          />
        </Tabs.Panel>

        <Tabs.Panel value="info3">
          <ConfigGroupProduct
            idGroup={id}
            dataConfigGroupProduct={data?.tblConfigGroupProductModels || []}
            dataConfigGroupAttribute={data?.tblConfigGroupAttributeModels || []}
            callApiGetData={callApiGetData}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default EditViewConfigGroup;
