import { Pagination } from "@elastic/eui";
import { Box, Button, Group, Select, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { tblTagItemModels } from "../../../../model/ProductList";
import { TblTag } from "../../../../model/TblTag";

interface dataOptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

const TagItemIds = ({ onAddItemTagIds, dataItemTagIds }: TagItemIdsProps) => {
  const [loading, setLoading] = useState(false);
  const [dataTags, setDataTags] = useState<TblTag[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedValues, setSelectedValues] = useState<any[]>([]); // Lưu giữ giá trị được chọn của các ô Select
  const [dataOption, setDataOption] = useState<dataOptionType[]>([]);

  const handleAddSelect = () => {
    setSelectedValues([...selectedValues, ""]);
  };

  const handleChangeProvince = (valueSelectCategory: string, index: number) => {
    const data = [...selectedValues];
    data[index] = valueSelectCategory;
    setSelectedValues(data);
  };

  const handleRemoveSelect = (index: number) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues.splice(index, 1);
    setSelectedValues(newSelectedValues);
  };

  useEffect(() => {
    const loadDataTag = async () => {
      setLoading(true);
      setDataTags([]);
      setError(undefined);
      const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
      try {
        let urlSearch = API_ROUTE.GET_LIST_TAG + `?Skip=0&Take=1000`;
        let callapi = await repository.get<MessageResponse<TblTag[]>>(
          urlSearch
        );
        if (
          isNullOrUndefined(callapi) ||
          isNullOrUndefinedArry(callapi?.data)
        ) {
        } else {
          setDataTags(callapi?.data ?? []);
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
    loadDataTag();
  }, []);

  useEffect(() => {
    if (dataTags.length > 0) {
      const dataOption = dataTags.map((item: TblTag) => {
        return {
          value: item.id.toString(),
          label: item.tagName as string,
        };
      });
      setDataOption(dataOption);
    }
  }, [dataTags]);

  useEffect(() => {
    if (dataItemTagIds) {
      setSelectedValues(dataItemTagIds.map((item) => item?.tagId?.toString()));
    }
  }, [dataItemTagIds]);

  useEffect(() => {
    setDataOption((prevDataOption) => {
      const updatedDataOptions = prevDataOption.map((option) => {
        const isOptionSelected = selectedValues.some(
          (item) => item === option.value
        );
        return { ...option, disabled: isOptionSelected };
      });

      return updatedDataOptions;
    });
  }, [selectedValues, dataTags]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      style={{ position: "relative" }}
    >
      <Text fw={600}>Hãy chọn Tag cho sản phẩm</Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddSelect}>
        Thêm Tag
      </Button>

      {selectedValues?.map((item, index) => (
        <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Select
            mt={"lg"}
            label={`Chọn Tag ${index + 1}`}
            placeholder="Tag"
            data={dataOption}
            searchable
            withAsterisk
            onChange={(value) => handleChangeProvince(value!, index)}
            value={selectedValues[index]}
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
            onAddItemTagIds(selectedValues);
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

type TagItemIdsProps = {
  onAddItemTagIds: (data: any) => void;
  dataItemTagIds: tblTagItemModels[] | null;
};

export default TagItemIds;
