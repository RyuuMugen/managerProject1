import { Box, Button, Group, TextInput, Title } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import {
  TblConfigGroupAttribute,
  TblConfigGroupAttributeValue,
} from "../../../../model/TblConfigGroup";
import {
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
} from "@elastic/eui";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import {
  createConfigGroupAttribute,
  createConfigGroupAttributeValue,
  deleteConfigGroupAttribute,
  deleteConfigGroupAttributeValue,
  editConfigGroupAttribute,
  editConfigGroupAttributeValue,
} from "../../../../api/ApiConfigGroup";
import { modals } from "@mantine/modals";
import DeleteView from "./DeleteView";

const ConfigGroupAttribute = ({
  idGroup,
  dataConfigGroupAttribute,
  callApiGetData,
}: ConfigGroupAttributeProps) => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "4%",
    },
    {
      field: "name",
      name: "Danh sách thuộc tính",
      sortable: true,
      truncateText: true,
      width: "25%",
      render: (itemName: string, online: TblConfigGroupAttribute) => (
        <Box>
          {selectedAttribute === online ? (
            <Box>
              <TextInput
                label={"Tên thuộc tính"}
                placeholder={"Nhập tên thuộc tính"}
                withAsterisk
                value={selectedEditAttribute?.name || ""}
                onChange={(e) =>
                  handleChangeEditAttribute(e.currentTarget.value, "name")
                }
                mt="md"
                type="text"
              />
              <TextInput
                label={"STT"}
                placeholder={"Nhập STT"}
                withAsterisk
                value={selectedEditAttribute?.orderNumber || 0}
                onChange={(e) =>
                  handleChangeEditAttribute(
                    e.currentTarget.value,
                    "orderNumber"
                  )
                }
                mt="md"
                type="number"
              />
              <Button
                mt={10}
                maw={160}
                loading={visible}
                onClick={handleEditConfigGroupAttribute}
                leftSection={<IconCheck size={18} />}
              >
                Cập nhật
              </Button>
            </Box>
          ) : (
            <EuiLink
              target="_blank"
              onClick={(e: any) => {
                const item = dataConfigGroupAttribute.find(
                  (x) => x.name === itemName
                );
                if (item !== undefined && item?.id > 0) {
                  setSelectedAttribute(item);
                  setSelectedEditAttribute(item);
                }
              }}
            >
              {itemName} - STT: {online.orderNumber || 0}
            </EuiLink>
          )}
        </Box>
      ),
    },
    {
      field: "tblConfigGroupAttributeValueModels",
      name: "Mô tả tóm tắt",
      sortable: true,
      truncateText: true,
      render: (
        AttributeValueModels: TblConfigGroupAttributeValue[],
        online: TblConfigGroupAttribute
      ) => (
        <Box>
          {selectedCreateAttributeValue === online ? (
            <Box mb={10}>
              <Group grow wrap="nowrap" gap={"lg"}>
                <TextInput
                  label={"Thêm giá trị thuộc tính mới"}
                  placeholder={"Nhập tên giá trị thuộc tính"}
                  withAsterisk
                  mt="md"
                  type="text"
                  value={dataSelectedAttributeValue?.name || ""}
                  onChange={(e) =>
                    handleChangeAttributeValue(e.currentTarget.value, "name")
                  }
                />

                <TextInput
                  label={"STT"}
                  placeholder={"Nhập STT"}
                  withAsterisk
                  mt="md"
                  type="number"
                  value={dataSelectedAttributeValue?.ordering || ""}
                  onChange={(e) =>
                    handleChangeAttributeValue(
                      e.currentTarget.value,
                      "ordering"
                    )
                  }
                />
              </Group>
              <Group grow wrap="nowrap" gap={"lg"} align="end">
                <TextInput
                  label={"Mô tả"}
                  placeholder={"Nhập mô tả"}
                  mt="md"
                  type="text"
                  value={dataSelectedAttributeValue?.description || ""}
                  onChange={(e) =>
                    handleChangeAttributeValue(
                      e.currentTarget.value,
                      "description"
                    )
                  }
                />
                <Button
                  maw={160}
                  loading={visible}
                  leftSection={<IconPlus size={18} />}
                  onClick={handleCreateAttributeValue}
                >
                  Thêm mới
                </Button>
              </Group>
            </Box>
          ) : (
            <Button
              m={"10px 0"}
              maw={160}
              loading={visible}
              leftSection={<IconPlus size={18} />}
              onClick={() => handleClickAddAttributeValue(online)}
            >
              Thêm giá trị
            </Button>
          )}

          <EuiBasicTable
            tableCaption="Demo of EuiDataGrid with selection"
            items={AttributeValueModels ? AttributeValueModels : []}
            itemId="id"
            noItemsMessage={"Không có dữ liệu"}
            columns={columnsValue}
            isSelectable={true}
            hasActions={true}
            responsive={true}
            compressed={true}
          />
        </Box>
      ),
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: any) => {
        return (
          <>
            <EuiFlexGroup
              responsive={true}
              wrap={false}
              gutterSize="s"
              alignItems="center"
            >
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="documentEdit"
                  aria-label="Dashboard"
                  color="success"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      setSelectedAttribute(online);
                      setSelectedEditAttribute(online);
                    }
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteSelectedAttribute([online.id]);
                    }
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        );
      },
    },
  ];

  const columnsValue: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "5%",
    },
    {
      field: "name",
      name: "Danh sách giá trị thuộc tính",
      sortable: true,
      truncateText: true,
      render: (itemName: string, online: TblConfigGroupAttributeValue) => (
        <Box>
          {selectedAttributeValue === online ? (
            <Box>
              <Group>
                <TextInput
                  label={"Tên thuộc tính"}
                  placeholder={"Nhập tên thuộc tính"}
                  withAsterisk
                  value={dataSelectedAttributeValue?.name || ""}
                  onChange={(e) =>
                    handleChangeAttributeValue(e.currentTarget.value, "name")
                  }
                  mt="md"
                  type="text"
                />
                <TextInput
                  label={"STT"}
                  placeholder={"Nhập STT"}
                  withAsterisk
                  value={dataSelectedAttributeValue?.ordering || 0}
                  onChange={(e) =>
                    handleChangeAttributeValue(
                      e.currentTarget.value,
                      "ordering"
                    )
                  }
                  mt="md"
                  type="number"
                />
              </Group>

              <TextInput
                label={"Mô tả"}
                placeholder={"Nhập mô tả"}
                value={dataSelectedAttributeValue?.description || ""}
                onChange={(e) =>
                  handleChangeAttributeValue(
                    e.currentTarget.value,
                    "description"
                  )
                }
                mt="md"
                type="text"
              />
              <Button
                mt={10}
                maw={160}
                loading={visible}
                onClick={handleEditConfigGroupAttributeValue}
                leftSection={<IconCheck size={18} />}
              >
                Cập nhật
              </Button>
            </Box>
          ) : (
            <EuiLink
              target="_blank"
              onClick={(e: any) => {
                setSelectedAttributeValue(online);
                setDataSelectedAttributeValue(online);
              }}
            >
              {itemName} - STT: {online.ordering || 0}
            </EuiLink>
          )}
        </Box>
      ),
    },
    {
      name: "Actions",
      width: "7%",
      render: (online: any) => {
        return (
          <>
            <EuiFlexGroup
              responsive={true}
              wrap={false}
              gutterSize="s"
              alignItems="center"
            >
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="documentEdit"
                  aria-label="Dashboard"
                  color="success"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      setSelectedAttributeValue(online);
                      setDataSelectedAttributeValue(online);
                    }
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteSelectedAttributeValue([online.id]);
                    }
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        );
      },
    },
  ];

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const entityAttributeValue = {
    id: 0,
    name: "",
    description: "",
    attrId: 0,
    ordering: 0,
    image: "",
    colorCode: "",
  };
  const [selectedAttribute, setSelectedAttribute] =
    useState<TblConfigGroupAttribute>();
  const [selectedEditAttribute, setSelectedEditAttribute] =
    useState<TblConfigGroupAttribute | null>(null);

  const [selectedCreateAttributeValue, setSelectedCreateAttributeValue] =
    useState<TblConfigGroupAttribute>();

  const [dataSelectedAttributeValue, setDataSelectedAttributeValue] =
    useState<TblConfigGroupAttributeValue>(entityAttributeValue);

  const [selectedAttributeValue, setSelectedAttributeValue] =
    useState<TblConfigGroupAttributeValue>();

  const entityConfigGroup = {
    id: 0,
    name: null,
    groupId: null,
    orderNumber: 0,
  };

  const form = useForm<TblConfigGroupAttribute>({
    initialValues: {
      ...entityConfigGroup,
    },
    validate: {
      name: isNotEmpty("Tên nhóm chưa chưa nhập"),
    },
  });

  const handleCreateConfigGroupAttribute = async (
    dataSubmit: TblConfigGroupAttribute
  ) => {
    open();
    const { tblConfigGroupAttributeValueModels, ...restGroup } = dataSubmit;
    await createConfigGroupAttribute({ ...restGroup, groupId: idGroup });
    form.setValues(entityConfigGroup);
    callApiGetData();
    close();
  };

  const handleEditConfigGroupAttribute = async () => {
    open();
    await editConfigGroupAttribute(selectedEditAttribute);
    callApiGetData();
    close();
  };

  const handleChangeEditAttribute = async (value: string, key: string) => {
    setSelectedEditAttribute((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        [key as keyof TblConfigGroupAttribute]: value,
      };
    });
  };

  const handleDeleteConfigGroupAttribute = async (idsItem: number[]) => {
    open();
    await deleteConfigGroupAttribute(idsItem);
    callApiGetData();
    close();
  };

  const deleteSelectedAttribute = (idsItem: number[]) => {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa thuộc tính</Title>
        </>
      ),
      children: (
        <DeleteView
          idItem={idsItem}
          type="thuộc tính"
          handleDelete={handleDeleteConfigGroupAttribute}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  const handleClickAddAttributeValue = (attribute: TblConfigGroupAttribute) => {
    setSelectedCreateAttributeValue(attribute);
    setDataSelectedAttributeValue((prevData) => ({
      ...prevData,
      attrId: attribute.id,
    }));
  };

  const handleChangeAttributeValue = async (value: string, key: string) => {
    setDataSelectedAttributeValue((prevData) => {
      return {
        ...prevData,
        [key as keyof TblConfigGroupAttributeValue]: value,
      };
    });
  };

  const handleCreateAttributeValue = async () => {
    open();
    await createConfigGroupAttributeValue(dataSelectedAttributeValue);
    setDataSelectedAttributeValue(entityAttributeValue);
    callApiGetData();
    close();
  };

  const handleEditConfigGroupAttributeValue = async () => {
    open();
    await editConfigGroupAttributeValue(dataSelectedAttributeValue);
    setDataSelectedAttributeValue(entityAttributeValue);
    callApiGetData();
    close();
  };

  const handleDeleteConfigGroupAttributeValue = async (idsItem: number[]) => {
    open();
    await deleteConfigGroupAttributeValue(idsItem);
    callApiGetData();
    close();
  };

  const deleteSelectedAttributeValue = async (idsItem: number[]) => {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa giá trị thuộc tính</Title>
        </>
      ),
      children: (
        <DeleteView
          idItem={idsItem}
          type="giá trị thuộc tính"
          handleDelete={handleDeleteConfigGroupAttributeValue}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };

  return (
    <div>
      <Box
        miw={1000}
        maw={1000}
        component="form"
        onSubmit={form.onSubmit((e: TblConfigGroupAttribute) => {
          handleCreateConfigGroupAttribute(e);
        })}
        mb={10}
      >
        <Group grow wrap="nowrap" gap={"lg"} align="end">
          <TextInput
            label={"Thêm thuộc tính mới"}
            placeholder={"Nhập tên thuộc tính"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("name")}
          />
          <TextInput
            label={"STT"}
            placeholder={"Nhập STT"}
            withAsterisk
            mt="md"
            type="number"
            {...form.getInputProps("orderNumber")}
          />
          <Button
            maw={160}
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Box>

      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={dataConfigGroupAttribute ? dataConfigGroupAttribute : []}
        itemId="id"
        noItemsMessage={"Không có dữ liệu"}
        columns={columns}
        // pagination={pagination}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        // onChange={onTableChange}
        compressed={true}
      />
    </div>
  );
};

export default ConfigGroupAttribute;

type ConfigGroupAttributeProps = {
  idGroup: number;
  dataConfigGroupAttribute: TblConfigGroupAttribute[] | [];
  callApiGetData: () => Promise<void>;
};
