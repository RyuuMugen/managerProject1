import { EuiButton, EuiEmptyPrompt, Pagination } from "@elastic/eui";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  Text,
} from "@mantine/core";
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
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblItemCategoryAttrModel } from "../../../../model/ProductList";
import { TblAttributeModel } from "../../../../model/TblAttributeModel";
import { TblAttributeValueModel } from "../../../../model/TblAttributeValueModel";
import { getAllAttribute } from "../../../../api/ApiAttribute";

const ItemCategoryAttrModels = ({
  onAddItemCategoryAttrModels,
  handleGoToEditAttribute,
}: ItemItemCategoryAttrModelsProps) => {
  const [toltal, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [dataAttribute, setDataAttribute] = useState<TblAttributeModel[]>([]);
  const [dataOptionAttribute, setDataOptionAttribute] = useState<
    TblItemCategoryAttrModel[]
  >([]);
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
            await loadDataAttribute(pagination.pageIndex, pagination.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );

  const loadDataAttribute = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setDataAttribute([]);
    setError(undefined); //get-list?KeySearch=1&Active=true&Skip=1&Take=1

    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=1000`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getAllAttribute(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
      } else {
        setDataAttribute(callapi?.data ?? []);
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

  useEffect(() => {
    loadDataAttribute(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleCheckBoxChange = async (
    valueIds: string,
    item: TblAttributeValueModel
  ) => {
    const isValueInDataOptionAttribute = dataOptionAttribute.some(
      (item) => String(item.attributeValueId) === valueIds
    );

    // Nếu giá trị không có trong dataOptionAttribute, thêm nó vào
    if (!isValueInDataOptionAttribute) {
      setDataOptionAttribute((prevData) => [
        ...prevData,
        {
          attributeId: item.attributeId,
          attributeValueId: item.id,
          value: item.value,
          status: item.status,
          orderNumber: item.orderNumber,
        },
      ]);
    } else {
      // Nếu giá trị đã có trong dataOptionAttribute, xoá nó đi
      setDataOptionAttribute((prevData) =>
        prevData.filter((item) => String(item.attributeValueId) !== valueIds)
      );
    }
  };

  return (
    <>
      <Box
        className="flex-none"
        miw={1200}
        maw={1200}
        mx="auto"
        style={{ position: "relative" }}
      >
        <Text mt={12}>Cập nhật thuộc tính cho Sản phẩm</Text>

        <Box style={{ maxHeight: 600, overflowY: "scroll" }}>
          {dataAttribute.map((item, index) => (
            <Grid
              key={index}
              mt="xs"
              pb="sm"
              display={"flex"}
              ml={"md"}
              style={{ borderBottom: "1px solid lightgray" }}
            >
              <Grid.Col span={{ base: 12, xs: 2 }}>
                <Text fw={700} size="lg">
                  {item.attributeName}
                </Text>
                <Text fw={350}>{item.attributeCode}</Text>
                <Text fw={350} color="red">
                  Dùng là bộ lọc
                </Text>
                <Text fw={350} color="red">
                  Hiển thị ở tóm tắt
                </Text>
              </Grid.Col>

              <Grid.Col span={{ base: 12, xs: 5 }}>
                <Flex direction={"column"} justify={"space-between"} h={"100%"}>
                  <Group wrap="wrap" align="center">
                    {item.tblAttributeValueModels?.map((option, index) => (
                      <Checkbox
                        key={option.id}
                        // label={option.value}
                        label={
                          <Text
                            dangerouslySetInnerHTML={{
                              __html: option.value || "",
                            }}
                          />
                        }
                        style={{ flex: "0 0 28%", maxWidth: "28%" }}
                        value={String(option.id)}
                        onChange={(event) =>
                          handleCheckBoxChange(
                            event.currentTarget.value,
                            option
                          )
                        }
                        // {...form.getInputProps(`${option.id}`)}
                      />
                    ))}
                  </Group>
                  <Text mt={20} fw={700}>
                    Bổ sung giá trị:{" "}
                    <Anchor
                      onClick={() => handleGoToEditAttribute(item.id)}
                      underline="always"
                    >
                      Sửa thuộc tính
                    </Anchor>
                  </Text>
                </Flex>
              </Grid.Col>
            </Grid>
          ))}
        </Box>

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
              onAddItemCategoryAttrModels(dataOptionAttribute);
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
    </>
  );
};

type ItemItemCategoryAttrModelsProps = {
  onAddItemCategoryAttrModels: (data: any) => void;
  handleGoToEditAttribute: (idAttr: number) => void;
};

export default ItemCategoryAttrModels;
