import { EuiButton, EuiEmptyPrompt, Pagination } from "@elastic/eui";
import { Box, Button, ComboboxItem, Group, Select, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode, useEffect, useState } from "react";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../../_base/model/_base/BaseTable";
import { API_ROUTE } from "../../../../const/apiRoute";
import {
  getDataMegaMenu,
  modifyMegaMenuGet,
} from "../../../../api/ApiMegaMenu";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblCategoryModel } from "../../../../model/TblCategoryModel";

interface dataOptionType {
  value: string;
  label: string;
  disabled?: boolean;
}

const ItemSeoCommand = ({ onAddItemSeo }: ItemCategoryCommandProps) => {
  const [toltal, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataItemSeo, setDataItemSeo] = useState<TblCategoryModel[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [message, setMessage] = useState<ReactNode>(
    <EuiEmptyPrompt
      title={<h3>Dữ liệu rỗng !</h3>}
      titleSize="xs"
      body="Tải lại dữ liệu nếu trường hợp bạn không thấy có dữ liệu hiển thị !"
      actions={
        <EuiButton
          size="s"
          key="loadUsers"
          onClick={async () => {
            await loadDataCategory(pagination.pageIndex, pagination.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );

  const [dataOption, setDataOption] = useState<dataOptionType[]>([]);

  const loadDataCategory = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setDataItemSeo([]);
    setError(undefined);
    try {
      let urlSearch = "?CategoryType=seo&Skip=0&Take=2000";
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getDataMegaMenu(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
      } else {
        setDataItemSeo(callapi?.data ?? []);
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

  const [selectedValues, setSelectedValues] = useState<any[]>([]); // Lưu giữ giá trị được chọn của các ô Select

  const getDetailByCategoryId = (valueSelectCategory: string) => {
    return dataItemSeo?.find((item: any) => {
      return item?.id == valueSelectCategory;
    });
  };

  const handleAddSelect = () => {
    setSelectedValues([...selectedValues, {}]);
  };

  const handleChangeProvince = (value: string, index: number) => {
    const category = getDetailByCategoryId(value);
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
    if (dataItemSeo[0]) {
      const getDataDataCategoryOption = async () => {
        let urlCreate = `?id=${dataItemSeo[0].id}`;
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
                  const isCategory = dataItemSeo.some(
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
  }, [dataItemSeo]);

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
      <Text fw={600}>Hãy chọn danh mục SEO cho sản phẩm</Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddSelect}>
        Thêm danh mục SEO
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
            onAddItemSeo(selectedValues);
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
  onAddItemSeo: (data: any) => void;
};

export default ItemSeoCommand;
