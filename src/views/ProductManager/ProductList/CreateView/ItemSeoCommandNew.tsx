import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { useEffect, useState } from "react";
import {
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../../_base/extension/StringExtension";
import Repository from "../../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../../const/apiRoute";
import { MessageResponse } from "../../../../model/MessageResponse";
import { TblItemSeoCommand } from "../../../../model/ProductList";
import { CategoryTree } from "../../../../model/TblCategoryCommand";

const ItemSeoCommandNew = ({ onAddItemSeo }: ItemCategoryCommandProps) => {
  const [dataCategory, setDataCategory] = useState<CategoryTree[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [selectedValues, setSelectedValues] = useState<TblItemSeoCommand[]>([]);

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);

  const handleClickCategoryName = (id: number) => {
    var element = document.getElementById(id.toString());
    if (element) {
      element.style.display =
        element.style.display === "block" ? "none" : "block";
    }
  };

  const handleChangeCheckBox = (category: CategoryTree, checked: boolean) => {
    const categoryId = category?.id;

    const updatedValues = selectedValues.filter(
      (selected) => selected?.categoryId !== categoryId
    );

    if (!checked) {
      setSelectedValues(updatedValues);
    } else {
      const updatedValue = {
        categoryId: categoryId,
        categoryCode: category?.categoryCode,
        categoryName: category?.categoryName,
        idParent: category?.parentId,
        description: category?.description,
      };
      setSelectedValues((prevValues) => [...prevValues, updatedValue]);
    }
  };

  const flattenCategoryTree = (
    categories: CategoryTree[],
    level = 0,
    idParent = 0
  ) => {
    return (
      <div
        id={idParent.toString()}
        style={{ display: level ? "none" : "block" }}
      >
        {categories?.flatMap((category) => {
          return (
            <React.Fragment key={category?.id}>
              <Flex pl={level * 30} mt={5}>
                <Text mr={5} mt={-3}>
                  +
                </Text>
                <Checkbox
                  label={
                    category?.categoryChildModels.length > 0 ? (
                      <Anchor
                        underline="always"
                        href="javascript:void(0)"
                        onClick={() => handleClickCategoryName(category?.id)}
                      >
                        {category?.categoryName}
                      </Anchor>
                    ) : (
                      <Text>{category?.categoryName}</Text>
                    )
                  }
                  value={category?.id}
                  checked={
                    !!selectedValues.find(
                      (selected) => selected?.categoryId === category?.id
                    )
                  }
                  onChange={(e) =>
                    handleChangeCheckBox(category, e.currentTarget.checked)
                  }
                />
              </Flex>

              {category?.categoryChildModels.length > 0 &&
                flattenCategoryTree(
                  category.categoryChildModels,
                  level + 1,
                  category.id
                )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const callDataCategoryTree = async () => {
      // setLoading(true);
      // setError(undefined);
      try {
        let urlSearch =
          API_ROUTE.GET_CATEGORY_TREE +
          `?CategoryType=seo&IsTradeIn=N&Skip=0&Take=2000`;
        let callapi = await repository.get<MessageResponse<CategoryTree[]>>(
          urlSearch
        );
        if (
          isNullOrUndefined(callapi) ||
          isNullOrUndefinedArry(callapi?.data)
        ) {
          setDataCategory([]);
        } else {
          setDataCategory(callapi?.data ?? []);
        }
        return callapi?.data;
      } catch (error: any) {
        setError("Có lỗi xảy ra khi tải dữ liệu !");
        return null;
      } finally {
        // setLoading(false);
      }
    };
    callDataCategoryTree();
  }, []);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      style={{ position: "relative" }}
    >
      <Text mt={"xs"} fw={600}>
        Hãy chọn danh mục cho sản phẩm
      </Text>

      <Box>{flattenCategoryTree(dataCategory || [])}</Box>

      <Group
        justify="flex-end"
        mt="lg"
        p="10px 0"
        style={{ position: "sticky", bottom: 48, backgroundColor: "white" }}
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

export default ItemSeoCommandNew;
