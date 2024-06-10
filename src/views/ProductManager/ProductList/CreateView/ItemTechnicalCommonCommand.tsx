import { Pagination } from "@elastic/eui";
import { Box, Button, Group, Select, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import { getListTechnicalCommon } from "../../../../api/ApiProduct";
import Repository from "../../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblTechnicalCommon } from "../../../../model/TblTechnicalCommon";

interface dataOptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

const ItemTechnicalCommonCommand = ({
  onAddItemTechnical,
}: TblItemTechnicalCommonCommandProps) => {
  const [loading, setLoading] = useState(false);
  const [toltal, setTotal] = useState(0);
  const [dataItemSeo, setDataCategory] = useState<TblTechnicalCommon[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);

  const [selectedValues, setSelectedValues] = useState<any[]>([]); // Lưu giữ giá trị được chọn của các ô Select

  const [dataOption, setDataOption] = useState<dataOptionType[]>([]);

  const loadDataCategory = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setDataCategory([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getListTechnicalCommon(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
      } else {
        setDataCategory(callapi?.data ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.totalCount ?? 0,
        });
        setTotal(callapi?.totalCount ?? 0);
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDetailById = (valueSelect: string) => {
    return dataItemSeo?.find((item: any) => {
      return item?.id == valueSelect;
    });
  };

  const handleAddSelect = () => {
    setSelectedValues([...selectedValues, {}]);
  };

  const handleChangeProvince = (value: string, index: number) => {
    // Xử lý sự kiện khi giá trị của ô Select thay đổi
    const item = getDetailById(value);
    const data = [...selectedValues];
    data[index] = {
      itemTecCode: item?.techComCode,
      itemTecName: item?.techComName,
      description: item?.description,
      orgId: item?.orgId,
      technicalCommonId: item?.id,
    };
    setSelectedValues(data);
  };

  const handleRemoveSelect = (index: number) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues.splice(index, 1);
    setSelectedValues(newSelectedValues);
  };

  useEffect(() => {
    loadDataCategory(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const dataOption = dataItemSeo?.map((item: any) => {
      return {
        value: item.id.toString(),
        label: item.techComName,
      };
    });
    setDataOption(dataOption);
  }, [dataItemSeo]);

  useEffect(() => {
    setDataOption((prevDataOption) => {
      const updatedDataOptions = prevDataOption.map((option) => {
        const isOptionSelected = selectedValues.some(
          (item) => item.technicalCommonId?.toString() === option.value
        );
        return { ...option, disabled: isOptionSelected };
      });

      return updatedDataOptions;
    });
  }, [selectedValues, dataItemSeo]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      style={{ position: "relative" }}
    >
      <Text mt={12} fw={600}>
        Bảng thông số kỹ thuật
      </Text>
      <Text fw={400}>
        Sản phẩm chưa có nhóm thông số kỹ thuật nào. Hãy Chọn nhóm cho sản phẩm
        này
      </Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddSelect}>
        Thêm nhóm thông số KT
      </Button>

      {selectedValues?.map((_, index) => (
        <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Select
            mt={"lg"}
            label={`Chọn danh mục ${index + 1}`}
            placeholder="Danh mục"
            data={dataOption}
            searchable
            withAsterisk
            onChange={(value) => handleChangeProvince(value!, index)}
            value={selectedValues[index]?.technicalCommonId?.toString()}
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
        style={{ position: "sticky", bottom: 49, backgroundColor: "white" }}
      >
        <Button
          type="button"
          color="#3598dc"
          onClick={() => {
            onAddItemTechnical(selectedValues);
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

type TblItemTechnicalCommonCommandProps = {
  onAddItemTechnical: (data: any) => void;
};

export default ItemTechnicalCommonCommand;
