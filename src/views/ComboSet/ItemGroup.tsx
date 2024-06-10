import {
  Box,
  Button,
  Checkbox,
  NumberFormatter,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { tblComboSetGroupModels } from "../../model/Comboset";
import FormChooseItem from "./FormChooseItem";

interface GroupItem {
  id?: number | null;
  groupName: string;
  setId?: number | null;
  tblComboSetProdCommands?: any[];
}

interface Item {
  id?: number | null;
  groupId?: number | null;
  itemId?: number | null;
  discoutValue: string;
  discoutType: number | null;
  isFirstRow: string;
  isFree: string;
  isHot: string;
}

const ItemGroup = ({
  // onSetDataComboSet,
  dataGroupItem,
  setDataGroupItem,
}: ItemGroupProps) => {
  // const [dataGroupItem, setDataGroupItem] = useState<tblComboSetGroupModels[]>(
  //   []
  // );

  const checkDuplicateItemIds = (items: any) => {
    const itemIdSet = new Set();

    for (const item of items || []) {
      if (item.itemId && itemIdSet.has(item.itemId)) {
        return true; // Có itemId trùng lặp
      }
      itemIdSet.add(item.itemId);
    }

    return false; // Không có itemId trùng lặp
  };

  const handleChangeNameComboSet = (value: string, indexGroup: number) => {
    setDataGroupItem((prevData) => {
      return prevData.map((itemGroup: GroupItem, idxGroup: number) => {
        if (indexGroup === idxGroup) {
          return { ...itemGroup, groupName: value };
        } else {
          return itemGroup;
        }
      });
    });
  };

  const handleChooseItem = (
    idItem: number,
    nameItem: string,
    itemPrice: string,
    indexItem: number,
    indexGroup: number
  ) => {
    setDataGroupItem((prevData) => {
      return prevData.map((itemGroup: GroupItem, idxGroup: number) => {
        if (idxGroup === indexGroup) {
          const updatedCommands = itemGroup?.tblComboSetProdCommands?.map(
            (item: any, idxItem: number) => {
              return idxItem === indexItem
                ? {
                    ...item,
                    itemId: idItem,
                    itemName: nameItem,
                    itemPrice: itemPrice,
                  }
                : item;
            }
          );

          return { ...itemGroup, tblComboSetProdCommands: updatedCommands };
        } else {
          return itemGroup;
        }
      });
    });
  };

  const openModal = (indexItem: number, indexGroup: number) =>
    modals.openConfirmModal({
      modalId: "item",
      title: (
        <>
          <div color="white">
            <Title order={5}>Chọn sản phẩm thêm vào commbo set</Title>
          </div>
        </>
      ),
      children: (
        <FormChooseItem
          onChooseItem={handleChooseItem}
          indexItem={indexItem}
          indexGroup={indexGroup}
          listItem={dataGroupItem[indexGroup].tblComboSetProdCommands || null}
        />
      ),

      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  const handleAddGroupItem = () => {
    setDataGroupItem([
      ...dataGroupItem,
      { groupName: "", tblComboSetProdCommands: [] },
    ]);
  };

  const handleRemoveGroup = (indexGroup: number) => {
    const newData = [...dataGroupItem];
    newData.splice(indexGroup, 1);
    setDataGroupItem(newData);
  };

  const handleRemoveItem = (indexItem: number, indexGroup: number) => {
    const newData = [...dataGroupItem];
    dataGroupItem[indexGroup]?.tblComboSetProdCommands?.splice(indexItem, 1);
    setDataGroupItem(newData);
  };

  const handleAddItem = (index: number) => {
    const data = [...dataGroupItem];
    const newData = data?.map((item: GroupItem, idx: number) => {
      if (index === idx) {
        return {
          ...item,
          tblComboSetProdCommands: [
            ...item?.tblComboSetProdCommands!,
            {
              id: 0,
              itemId: null,
              discoutValue: "",
              discoutType: null,
              isFirstRow: "",
              isFree: "",
              isHot: "",
            },
          ],
        };
      } else {
        return item;
      }
    });
    setDataGroupItem(newData);
  };

  const handleChangeDataComboSetProd = (
    value: any,
    key: any,
    indexGroup: number,
    indexItem: number
  ) => {
    setDataGroupItem((prevData) => {
      return prevData.map((itemGroup: GroupItem, idxGroup: number) => {
        if (idxGroup === indexGroup) {
          const updatedCommands = itemGroup?.tblComboSetProdCommands?.map(
            (item: any, idxItem: number) => {
              return idxItem === indexItem ? { ...item, [key]: value } : item;
            }
          );

          return { ...itemGroup, tblComboSetProdCommands: updatedCommands };
        } else {
          return itemGroup;
        }
      });
    });
  };

  const ItemProduct = (indexItem: number, indexGroup: number) => {
    return (
      <Box
        display={"flex"}
        mt={12}
        style={{ columnGap: 24, alignItems: "center" }}
      >
        <Box>
          <Button onClick={() => openModal(indexItem, indexGroup)}>
            Chọn SP
          </Button>
        </Box>
        <Box>
          <TextInput
            type="text"
            maw={300}
            miw={300}
            placeholder="Tên sản phẩm"
            value={
              dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[
                indexItem
              ]?.itemName?.toString() || ""
            }
          />
        </Box>
        <Box>
          <Text>
            Giá đang bán:{" "}
            <NumberFormatter
              style={{ color: "red" }}
              value={
                dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[indexItem]
                  ?.itemPrice || 0
              }
              thousandSeparator
              suffix=" đ"
            />
          </Text>
        </Box>
        <Box display={"flex"} style={{ columnGap: 12, alignItems: "center" }}>
          <Text>Cài giảm</Text>
          <TextInput
            type="number"
            value={
              dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[indexItem]
                ?.discoutValue
            }
            onChange={(e) =>
              handleChangeDataComboSetProd(
                e.target.value,
                "discoutValue",
                indexGroup,
                indexItem
              )
            }
          />
          <Select
            value={
              dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[
                indexItem
              ]?.discoutType?.toString() || null
            }
            onChange={(e) =>
              handleChangeDataComboSetProd(
                e,
                "discoutType",
                indexGroup,
                indexItem
              )
            }
            placeholder={"Đơn vị"}
            data={[
              { value: "0", label: "%" },
              { value: "1", label: "Số tiền" },
            ]}
          />
        </Box>
        <Checkbox
          label="Hiển thị đầu tiên"
          checked={
            dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[indexItem]
              ?.isFirstRow === "Y"
              ? true
              : false
          }
          onChange={(e) =>
            handleChangeDataComboSetProd(
              e.target.checked ? "Y" : "N",
              "isFirstRow",
              indexGroup,
              indexItem
            )
          }
        />
        <Checkbox
          label="Là miễn phí"
          checked={
            dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[indexItem]
              ?.isFree === "Y"
              ? true
              : false
          }
          onChange={(e) =>
            handleChangeDataComboSetProd(
              e.target.checked ? "Y" : "N",
              "isFree",
              indexGroup,
              indexItem
            )
          }
        />
        <Checkbox
          label="Khuyên mua"
          checked={
            dataGroupItem[indexGroup]?.tblComboSetProdCommands?.[indexItem]
              ?.isHot === "Y"
              ? true
              : false
          }
          onChange={(e) =>
            handleChangeDataComboSetProd(
              e.target.checked ? "Y" : "N",
              "isHot",
              indexGroup,
              indexItem
            )
          }
        />
        <Button
          mt={"5px"}
          style={{ maxWidth: 80 }}
          type="button"
          color="red"
          onClick={() => handleRemoveItem(indexItem, indexGroup)}
        >
          Xóa
        </Button>
      </Box>
    );
  };

  return (
    <>
      {dataGroupItem?.map((item: any, indexGroup) => {
        return (
          <Box
            style={{
              border: "1px solid #008000",
              borderRadius: 8,
              padding: 12,
              marginTop: 32,
            }}
          >
            <Box>
              <TextInput
                type="text"
                placeholder="Nhập tên nhóm sản phẩm"
                value={dataGroupItem?.[indexGroup]?.groupName}
                onChange={(e) =>
                  handleChangeNameComboSet(e.target.value, indexGroup)
                }
              />
            </Box>
            {dataGroupItem[indexGroup]?.tblComboSetProdCommands?.map(
              (item: any, indexItem) => {
                return ItemProduct(indexItem, indexGroup);
              }
            )}
            <Button mt={12} mr={"sm"} onClick={() => handleAddItem(indexGroup)}>
              Thêm sản phẩm
            </Button>
            <Button
              mt={"24px"}
              style={{ maxWidth: 80 }}
              type="button"
              color="red"
              onClick={() => handleRemoveGroup(indexGroup)}
            >
              Xóa
            </Button>
          </Box>
        );
      })}
      <Box display={"flex"} style={{ columnGap: 8, marginTop: 12 }}>
        <Button onClick={handleAddGroupItem}>Thêm nhóm sản phẩm</Button>
      </Box>
    </>
  );
};

export default ItemGroup;

type ItemGroupProps = {
  // onSetDataComboSet: (value: any) => void;
  dataGroupItem: tblComboSetGroupModels[] | [];
  setDataGroupItem: React.Dispatch<
    React.SetStateAction<tblComboSetGroupModels[]>
  >;
};
