import { Pagination } from "@elastic/eui";
import { Box, Button, ComboboxItem, Group, Select, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { TblAttributeModel } from "../../../model/TblAttributeModel";
import { listTblCategoryAttribute } from "../../../model/TblCategoryModel";
import { getAllAttribute } from "../../../api/ApiAttribute";

const ListTblCategoryAttributeView = ({
  dataCategoryAttribute,
  onAddItemCategoryAttribute,
}: ListTblCategoryAttributeViewProps) => {
  const [loading, setLoading] = useState(false);
  const [dataAttribute, setDataAttribute] = useState<TblAttributeModel[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedValues, setSelectedValues] = useState<any[]>([]); // Lưu giữ giá trị được chọn của các ô Select
  const [dataOption, setDataOption] = useState<ComboboxItem[]>([]);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);

  const loadDataAttribute = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setDataAttribute([]);
    setError(undefined);
    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=1000`;
      let callapi = await getAllAttribute(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
      } else {
        setDataAttribute(callapi?.data ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.totalCount ?? 0,
        });
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAddSelect = () => {
    setSelectedValues([...selectedValues, {}]);
  };

  const getDetailByCategoryId = (valueSelectCategory: string) => {
    return dataAttribute?.find((item: any) => {
      return item?.id == valueSelectCategory;
    });
  };

  // hàm này sẽ có 2 trường hợp là thêm mới (k có id) và sửa (có id)
  const handleChangeProvince = (valueSelectCategory: string, index: number) => {
    const attribute = getDetailByCategoryId(valueSelectCategory);

    const data = [...selectedValues];
    data[index] = {
      attributeId: attribute?.id,
      orderNumber: attribute?.orderNumber,
      value: null,
      status: attribute?.status,
    };
    setSelectedValues(data);
  };

  const handleRemoveSelect = (index: number) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues.splice(index, 1);
    setSelectedValues(newSelectedValues);
  };

  useEffect(() => {
    loadDataAttribute(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const options = dataAttribute?.map((item) => {
      return {
        value: item.id.toString(),
        label: item.attributeName || "",
      };
    });
    setDataOption(options);
  }, [dataAttribute]);

  useEffect(() => {
    if (dataCategoryAttribute) {
      setSelectedValues(dataCategoryAttribute);
    }
  }, [dataCategoryAttribute]);

  useEffect(() => {
    setDataOption((prevDataOption) => {
      const updatedDataOptions = prevDataOption.map((option) => {
        const isOptionSelected = selectedValues.some(
          (item) => item.attributeId?.toString() === option.value
        );
        return { ...option, disabled: isOptionSelected };
      });

      return updatedDataOptions;
    });
  }, [selectedValues, dataAttribute]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      style={{ position: "relative" }}
    >
      <Text fw={600}>Hãy chọn thuộc tính cho sản phẩm</Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddSelect}>
        Thêm thuộc tính
      </Button>

      {selectedValues?.map((item, index) => (
        <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Select
            mt={"lg"}
            label={`Chọn thuộc tính ${index + 1}`}
            placeholder="Thuộc tính"
            data={dataOption}
            searchable
            withAsterisk
            onChange={(value) => handleChangeProvince(value!, index)}
            value={selectedValues[index]?.attributeId?.toString()}
            mb={"lg"}
          />
          <Button
            mt={"lg"}
            style={{ maxWidth: 80 }}
            type="button"
            color="red"
            onClick={() => handleRemoveSelect(index)}
          >
            Xóa
          </Button>
        </Group>
      ))}

      <Group
        justify="flex-end"
        mt="lg"
        p="10px 0"
        style={{ position: "sticky", bottom: 47, backgroundColor: "white" }}
      >
        <Button
          type="button"
          color="#3598dc"
          onClick={() => {
            onAddItemCategoryAttribute(selectedValues);
          }}
        >
          Lưu
        </Button>

        <Button
          variant="outline"
          color="black"
          type="button"
          onClick={() => modals.closeAll()}
        >
          Đóng
        </Button>
      </Group>
    </Box>
  );
};

export default ListTblCategoryAttributeView;

type ListTblCategoryAttributeViewProps = {
  dataCategoryAttribute: listTblCategoryAttribute[] | [];
  onAddItemCategoryAttribute: (
    dataCategoryAttribute: listTblCategoryAttribute[]
  ) => void;
};
