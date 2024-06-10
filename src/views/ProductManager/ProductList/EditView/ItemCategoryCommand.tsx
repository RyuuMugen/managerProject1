import { Pagination } from "@elastic/eui";
import { Box, Button, ComboboxItem, Group, Select, Text } from "@mantine/core";
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
import { TblItemCategoryCommand } from "../../../../model/ProductList";
import { TblCategoryModel } from "../../../../model/TblCategoryModel";
import {
  getDataMegaMenu,
  modifyMegaMenuGet,
} from "../../../../api/ApiMegaMenu";
interface dataOptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

const ItemCategoryCommand = ({
  onAddItemCategory,
  dataItemCategory,
}: ItemCategoryCommandProps) => {
  const [loading, setLoading] = useState(false);
  const [dataCategory, setDataCategory] = useState<TblCategoryModel[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedValues, setSelectedValues] = useState<any[]>([]); // Lưu giữ giá trị được chọn của các ô Select
  const [dataOption, setDataOption] = useState<ComboboxItem[]>([]);

  const loadDataCategory = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setDataCategory([]);
    setError(undefined);
    try {
      let urlSearch = `?CategoryType=category&Skip=0&Take=2000`;
      let callapi = await getDataMegaMenu(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
      } else {
        setDataCategory(callapi?.data ?? []);
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
    return dataCategory?.find((item: any) => {
      return item?.id == valueSelectCategory;
    });
  };

  // hàm này sẽ có 2 trường hợp là thêm mới (k có id) và sửa (có id)
  const handleChangeProvince = (valueSelectCategory: string, index: number) => {
    const category = getDetailByCategoryId(valueSelectCategory);

    const data = [...selectedValues];
    data[index] = {
      categoryCode: category?.categoryCode,
      categoryName: category?.categoryName,
      idParent: category?.idParent,
      description: category?.description,
      categoryId: category?.id,
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
    if (dataCategory[0]) {
      const getDataDataCategoryOption = async () => {
        let urlCreate = `?id=${dataCategory[0].id}`;
        let callapi = await modifyMegaMenuGet(urlCreate);
        if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
          const dataApi = callapi?.data;
          if (dataApi != null && !isNullOrUndefined(dataApi)) {
            const dataApiAll = dataApi.tblCategoryModels;
            let dataarry: ComboboxItem[] = [];
            if (dataApiAll !== undefined)
              for (let index = 0; index < dataApiAll.length; index++) {
                const element = dataApiAll[index];
                if (element.value !== undefined) {
                  const isCategory = dataCategory.some(
                    (item) => item.id.toString() === element.value
                  );
                  if (isCategory) {
                    const elementp: ComboboxItem = {
                      label: element.text,
                      value: element.value,
                    };
                    dataarry.push(elementp);
                  }
                }
              }
            setDataOption(dataarry);
          }
        }
      };
      getDataDataCategoryOption();
    }
  }, [dataCategory]);

  useEffect(() => {
    if (dataItemCategory) {
      setSelectedValues(dataItemCategory);
    }
  }, [dataItemCategory]);

  useEffect(() => {
    setDataOption((prevDataOption) => {
      const updatedDataOptions = prevDataOption.map((option) => {
        const isOptionSelected = selectedValues.some(
          (item) => item.categoryId?.toString() === option.value
        );
        return { ...option, disabled: isOptionSelected };
      });

      return updatedDataOptions;
    });
  }, [selectedValues, dataCategory]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      style={{ position: "relative" }}
    >
      <Text fw={600}>Hãy chọn danh mục cho sản phẩm</Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddSelect}>
        Thêm danh mục
      </Button>

      {selectedValues?.map((item, index) => (
        <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
          <Select
            mt={"lg"}
            label={`Chọn danh mục ${index + 1}`}
            placeholder="Danh mục"
            data={dataOption}
            searchable
            withAsterisk
            nothingFoundMessage="Không có dữ liệu"
            onChange={(value) => handleChangeProvince(value!, index)}
            value={selectedValues[index]?.categoryId?.toString()}
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
            onAddItemCategory(selectedValues);
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

type ItemCategoryCommandProps = {
  onAddItemCategory: (data: any) => void;
  dataItemCategory: TblItemCategoryCommand[] | null;
};

export default ItemCategoryCommand;
