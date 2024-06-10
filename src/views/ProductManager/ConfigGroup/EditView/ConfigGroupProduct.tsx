import React, { useEffect, useState } from "react";
import {
  TblConfigGroupAttribute,
  TblConfigGroupProduct,
} from "../../../../model/TblConfigGroup";
import FormChooseItem from "./FormChooseItem";
import { Box, Button, Flex, Group, Select, Text, Title } from "@mantine/core";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import {
  createConfigGroupProduct,
  deleteConfigGroupProduct,
  editConfigGroupProduct,
} from "../../../../api/ApiConfigGroup";
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
import DeleteView from "./DeleteView";

interface attributeOptionType {
  attributeId: number;
  option:
    | {
        value: string;
        label: string;
      }[]
    | [];
}

interface productOptionType {
  productId: number | null;
  itemName: string | null;
  attributes: productOptionAttribute[];
}

interface productOptionAttribute {
  id: number;
  attributeId: number | null;
  attributeValueId: number | null;
  isChange: boolean;
}

const ConfigGroupProduct = ({
  idGroup,
  dataConfigGroupProduct,
  dataConfigGroupAttribute,
  callApiGetData,
}: ConfigGroupProductProps) => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "productId",
      name: "ID",
      sortable: true,
      truncateText: true,
      width: "4%",
    },
    {
      field: "itemName",
      name: "Danh sách giá trị thuộc tính",
      sortable: true,
      truncateText: true,
      width: "40%",
      render: (itemName: string) => (
        <EuiLink target="_blank">{itemName}</EuiLink>
      ),
    },
    {
      name: "Thuộc tính",
      render: (online: productOptionType) => {
        return (
          <Box>
            {dataConfigGroupAttribute.map((attribute, index) => (
              <Flex align={"center"} gap={15} mt={10}>
                <Text w={"25%"}>{attribute.name}:</Text>
                <Select
                  key={index}
                  w={400}
                  clearable
                  data={
                    dataConfigGroupAttributeOption.find(
                      (attr) => attr.attributeId === attribute.id
                    )?.option || []
                  }
                  value={online.attributes
                    .find((attr) => attr.attributeId === attribute.id)
                    ?.attributeValueId?.toString()}
                  onChange={(value) =>
                    handleEditAttributeValue(
                      value,
                      //   online.attributes.find(
                      //     (attr) => attr.attributeId === attribute.id
                      //   )!,
                      attribute.id,
                      online
                    )
                  }
                />
              </Flex>
            ))}
            <Button
              mt={10}
              onClick={() => handleEditConfigGroupProduct(online)}
              color="#3598dc"
              leftSection={<IconCheck size={18} />}
            >
              Cập nhật
            </Button>
          </Box>
        );
      },
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
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteSelectedProduct([online.productId]);
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

  const entity = {
    id: 0,
    productId: null,
    itemName: null,
    groupId: idGroup,
    attributeValueId: null,
    attributeId: null,
    attributeConfig: null,
  };

  const [dataConfigGroupProductOption, setDataConfigGroupProductOption] =
    useState<productOptionType[]>([]);

  const [dataConfigGroupAttributeOption, setDataConfigGroupAttributeOption] =
    useState<attributeOptionType[]>([]);

  const handleOpenFormChooseItem = () => {
    modals.openConfirmModal({
      modalId: "item",
      title: (
        <>
          <div color="white">
            <Title order={5}>Chọn sản phẩm vào nhóm</Title>
          </div>
        </>
      ),
      children: <FormChooseItem onChooseItem={handleChooseItem} />,

      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  };
  const handleChooseItem = async (idItem: number, itemName: string | null) => {
    const dataItem = { ...entity, productId: idItem, itemName: itemName };

    await createConfigGroupProduct(dataItem);
    callApiGetData();
  };

  const handleEditConfigGroupProduct = async (option: productOptionType) => {
    const dataEdit = dataConfigGroupProduct.filter(
      (item) =>
        item.productId === option.productId &&
        option.attributes.some(
          (attr) =>
            attr.attributeId === item.attributeId && attr.isChange === true
        )
    );

    const dataCreate = option.attributes.filter((attr) => {
      return !dataConfigGroupProduct.some(
        (item) =>
          item.productId === option.productId &&
          item.attributeId === attr.attributeId
      );
    });

    const dataDelete = option.attributes
      .filter((attr) => !attr.attributeId)
      .map((attr) => attr.id);

    dataEdit.map(async (product) => {
      const dataProduct = {
        ...product,
        attributeValueId: option.attributes.find(
          (attr) => product.attributeId === attr.attributeId
        )?.attributeValueId,
      };
      await editConfigGroupProduct(dataProduct);
    });

    dataCreate.map(async (attr) => {
      const dataProduct = {
        id: 0,
        productId: option.productId,
        itemName: option.itemName,
        groupId: idGroup,
        attributeId: attr.attributeId,
        attributeValueId: attr.attributeValueId,
        attributeConfig: null,
      };
      createConfigGroupProduct(dataProduct);
    });

    // dataDelete.map(async (attr) => deleteConfigGroupProduct(attr.id));
    if (dataDelete && dataDelete.length > 0)
      await deleteConfigGroupProduct(dataDelete);

    callApiGetData();
  };

  const handleEditAttributeValue = (
    value: string | null,
    // attribute: productOptionAttribute,
    attributeId: number,
    option: productOptionType
  ) => {
    const newData = dataConfigGroupProductOption.map((productOption) => {
      // Nếu sản phẩm hiện tại trùng với sản phẩm cần cập nhật
      if (productOption.productId === option.productId) {
        // Tìm và cập nhật thuộc tính mới
        const updatedAttributes = productOption.attributes.map((attr) =>
          // Nếu thuộc tính hiện tại trùng với thuộc tính cần cập nhật
          attr.attributeId === attributeId
            ? {
                // Sao chép tất cả các thuộc tính của thuộc tính
                ...attr,
                // Cập nhật giá trị thuộc tính mới
                attributeValueId: Number(value) || null,
                isChange: true,
              }
            : attr
        );

        // Kiểm tra xem attributeId đã tồn tại trong attributes chưa
        const existingAttributeIndex = updatedAttributes.findIndex(
          (attr) => attr.attributeId === attributeId
        );
        if (existingAttributeIndex === -1) {
          // Nếu không tồn tại, thêm mới vào mảng attributes
          updatedAttributes.push({
            id: 0,
            attributeId: attributeId,
            attributeValueId: Number(value) || null,
            isChange: true,
          });
        }

        return {
          ...productOption,
          // Gán mảng attributes đã được cập nhật lại
          attributes: updatedAttributes,
        };
      } else {
        // Nếu không, giữ nguyên sản phẩm
        return productOption;
      }
    });
    setDataConfigGroupProductOption(newData);
  };

  const handleDeleteConfigGroupProduct = async (idsDelete: number[]) => {
    await deleteConfigGroupProduct(idsDelete);
    callApiGetData();
  };

  const deleteSelectedProduct = async (idItem: number[]) => {
    const idsDelete = dataConfigGroupProductOption
      .find((item) => item.productId === idItem[0])
      ?.attributes.map((attr) => attr.id);

    if (idsDelete && idsDelete.length > 0) {
      modals.openConfirmModal({
        title: (
          <>
            <Title order={5}>Xóa giá trị thuộc tính</Title>
          </>
        ),
        children: (
          <DeleteView
            idItem={idsDelete || []}
            type="sản phẩm"
            handleDelete={handleDeleteConfigGroupProduct}
          />
        ),
        confirmProps: { display: "none" },
        cancelProps: { display: "none" },
      });
    } else NotificationExtension.Fails("Vui lòng chọn sản phẩm");
  };

  useEffect(() => {
    const dataOption = dataConfigGroupAttribute.map((attribute) => ({
      attributeId: attribute.id,
      option: attribute.tblConfigGroupAttributeValueModels?.length
        ? attribute.tblConfigGroupAttributeValueModels.map(
            (attributeValue) => ({
              value: attributeValue.id.toString(),
              label: attributeValue.name || "",
            })
          )
        : [], // Return an empty array if tblConfigGroupAttributeValueModels is null, undefined, or empty
    }));
    setDataConfigGroupAttributeOption(dataOption);
  }, [dataConfigGroupAttribute]);

  useEffect(() => {
    const groupedOptions: productOptionType[] = (
      dataConfigGroupProduct as TblConfigGroupProduct[]
    ).reduce((acc: productOptionType[], product: TblConfigGroupProduct) => {
      // Tìm chỉ số của sản phẩm hiện có trong mảng tích lũy
      const existingProductIndex = acc.findIndex(
        // Kiểm tra xem productId của mục có khớp với productId của sản phẩm hiện tại không
        (item) => item.productId === product.productId
      );
      // Nếu sản phẩm đã tồn tại trong mảng tích lũy
      if (existingProductIndex !== -1) {
        // Thêm thuộc tính vào sản phẩm đã tồn tại
        acc[existingProductIndex].attributes.push({
          id: product.id!,
          attributeId: product.attributeId,
          attributeValueId: product.attributeValueId,
          isChange: false,
        });
      } else {
        // Nếu sản phẩm không tồn tại trong mảng tích lũy, thêm nó vào
        acc.push({
          productId: product.productId!,
          itemName: product.itemName,
          attributes: [
            {
              id: product.id!,
              attributeId: product.attributeId,
              attributeValueId: product.attributeValueId,
              isChange: false,
            },
          ],
        });
      }
      // Trả về mảng tích lũy đã cập nhật
      return acc;
    }, []);
    setDataConfigGroupProductOption(groupedOptions);
  }, [dataConfigGroupProduct]);

  return (
    <div>
      <Button
        m={"10px 0"}
        onClick={handleOpenFormChooseItem}
        color="#3598dc"
        leftSection={<IconPlus size={18} />}
      >
        Chọn sản phẩm vào nhóm
      </Button>
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={dataConfigGroupProductOption ? dataConfigGroupProductOption : []}
        itemId="id"
        noItemsMessage={"Không có dữ liệu"}
        columns={columns}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        compressed={true}
      />
    </div>
  );
};

export default ConfigGroupProduct;

type ConfigGroupProductProps = {
  idGroup: number;
  dataConfigGroupProduct: TblConfigGroupProduct[] | [];
  dataConfigGroupAttribute: TblConfigGroupAttribute[] | [];
  callApiGetData: () => Promise<void>;
};
