import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiEmptyPrompt,
  EuiLink,
  EuiSpacer,
  Pagination,
} from "@elastic/eui";
import {
  Box,
  Button,
  Flex,
  Image,
  NumberFormatter,
  Select,
  Text,
} from "@mantine/core";
import React, { ReactNode, useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../_base/extension/StringExtension";
import Repository from "../../_base/helper/HttpHelper";
import { paginationBase } from "../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../_base/model/_base/ParamSearchBase";
import { getListAttributeFilter } from "../../api/ApiAttribute";
import {
  createBuildPcItem,
  deleteBuildPcItem,
  getListBuildPcItem,
} from "../../api/ApiBuildPC";
import AppSearch from "../../common/AppSearch";
import { API_ROUTE } from "../../const/apiRoute";
import { MessageResponse } from "../../model/MessageResponse";
import {
  AttributeOptionType,
  TblAttributeFilter,
  TblAttributeFilterOption,
} from "../../model/TblAttributeValueModel";
import { TblBuildPcListItemBuild } from "../../model/TblBuildPc";

const noItemsFoundMsg = "Không có kết quả tìm kiếm phù hợp...";

const ChooseItemRelView = ({ dataCategory }: FormChooseItemProps) => {
  const [total1, setTotal1] = useState(0);
  const [total2, setTotal2] = useState(0);
  const [listItem1, setListItem1] = useState<TblBuildPcListItemBuild[]>([]);
  const [listItem2, setListItem2] = useState<TblBuildPcListItemBuild[]>([]);
  const [listItemRel, setListItemRel] = useState<TblBuildPcListItemBuild[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<TblBuildPcListItemBuild | null>(null);

  const columns1: Array<EuiBasicTableColumn<TblBuildPcListItemBuild>> = [
    {
      field: "image",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (image: string) => (
        <Image src={image} alt="itemImage" w={120} h={"auto"} />
      ),
    },
    {
      field: "itemName",
      name: `Tên sản phẩm (Tổng số: ${total1})`,
      footer: <em>Page totals: {total1}</em>,
      sortable: true,
      truncateText: true,
      width: "32%",

      render: (itemName: string, online: TblBuildPcListItemBuild) => (
        <Flex
          direction={"column"}
          style={{
            backgroundColor: `${
              online.id === selectedItem?.id ? "yellow" : "white"
            }`,
          }}
        >
          <EuiLink
            target="_blank"
            style={{
              fontSize: 14,
              whiteSpace: "pre-wrap",
            }}
            onClick={() => handleChooseItem(online)}
          >
            {itemName}
          </EuiLink>
          {/* <Text
            dangerouslySetInnerHTML={{ __html: online.description || "" }}
          ></Text> */}
          <Text>Mã kho: {online.skuCode}</Text>
          <Text display={"flex"} style={{ gap: 5 }}>
            <Text span fw={700}>
              Giá:{" "}
            </Text>{" "}
            <NumberFormatter
              value={online.unitPrice || 0}
              thousandSeparator
              suffix="Đ"
            />{" "}
            -{" "}
            <Text span fw={700}>
              SL:{" "}
            </Text>{" "}
            {online.quantity || 0} -{" "}
            <Text span fw={700}>
              Trạng thái:{" "}
            </Text>{" "}
            {online.status === "Y" ? "Đang hiển thị" : "Không hiển thị"}
          </Text>
        </Flex>
      ),
    },
    {
      name:
        selectedItem &&
        selectedItem?.categoryId !== listItem1[0]?.categoryId ? (
          <EuiLink target="_blank" onClick={() => handleChooseAll()}>
            Chọn tất cả
          </EuiLink>
        ) : (
          "Chọn"
        ),
      // name: `Chọn`,
      width: "8%",
      render: (item: TblBuildPcListItemBuild) => {
        return !selectedItem ? null : item.categoryId ===
          selectedItem?.categoryId ? (
          item.id === selectedItem.id ? (
            <Button
              color="red"
              onClick={() => handleChooseDeleteAllItemRel(item)}
            >
              Xoá tất cả liên quan
            </Button>
          ) : null
        ) : item.isRel ? (
          <Button color="red" onClick={() => handleChooseDeleteItemRel(item)}>
            Bỏ liên quan
          </Button>
        ) : (
          <Button onClick={() => handleChooseCreateItemRel(item)}>
            Chọn liên quan
          </Button>
        );
      },
    },
  ];

  const columns2: Array<EuiBasicTableColumn<TblBuildPcListItemBuild>> = [
    {
      field: "image",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (image: string) => (
        <Image src={image} alt="itemImage" w={120} h={"auto"} />
      ),
    },
    {
      field: "itemName",
      name: `Tên sản phẩm (Tổng số: ${total2})`,
      footer: <em>Page totals: {total2}</em>,
      sortable: true,
      truncateText: true,
      width: "32%",

      render: (itemName: string, online: TblBuildPcListItemBuild) => (
        <Flex
          direction={"column"}
          style={{
            backgroundColor: `${
              online.id === selectedItem?.id ? "yellow" : "white"
            }`,
          }}
        >
          <EuiLink
            target="_blank"
            style={{
              fontSize: 14,
              whiteSpace: "pre-wrap",
            }}
            onClick={() => handleChooseItem(online)}
          >
            {itemName}
          </EuiLink>
          {/* <Text
            dangerouslySetInnerHTML={{ __html: online.description || "" }}
          ></Text> */}
          <Text>Mã kho: {online.skuCode}</Text>
          <Text display={"flex"} style={{ gap: 5 }}>
            <Text span fw={700}>
              Giá:{" "}
            </Text>{" "}
            <NumberFormatter
              value={online.unitPrice || 0}
              thousandSeparator
              suffix="Đ"
            />{" "}
            -{" "}
            <Text span fw={700}>
              SL:{" "}
            </Text>{" "}
            {online.quantity || 0} -{" "}
            <Text span fw={700}>
              Trạng thái:{" "}
            </Text>{" "}
            {online.status === "Y" ? "Đang hiển thị" : "Không hiển thị"}
          </Text>
        </Flex>
      ),
    },
    {
      name:
        selectedItem &&
        selectedItem?.categoryId !== listItem2[0]?.categoryId ? (
          <EuiLink target="_blank" onClick={() => handleChooseAll()}>
            Chọn tất cả
          </EuiLink>
        ) : (
          "Chọn"
        ),
      // name: `Chọn`,
      width: "8%",
      render: (item: TblBuildPcListItemBuild) => {
        return !selectedItem ? null : item.categoryId ===
          selectedItem?.categoryId ? (
          item.id === selectedItem.id ? (
            <Button
              color="red"
              onClick={() => handleChooseDeleteAllItemRel(item)}
            >
              Xoá tất cả liên quan
            </Button>
          ) : null
        ) : item.isRel ? (
          <Button color="red" onClick={() => handleChooseDeleteItemRel(item)}>
            Bỏ liên quan
          </Button>
        ) : (
          <Button onClick={() => handleChooseCreateItemRel(item)}>
            Chọn liên quan
          </Button>
        );
      },
    },
  ];

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [isDataChange, setIsDataChange] = useState<boolean>(false);
  const [dataAttributeFilter1, setDataAttributeFilter1] = useState<
    TblAttributeFilter[]
  >([]);
  const [dataAttributeFilterOption1, setDataAttributeFilterOption1] = useState<
    TblAttributeFilterOption[]
  >([]);
  const [selectedAttributeFilter1, setSelectedAttributeFilter1] = useState<
    (AttributeOptionType | null)[]
  >([]);
  const [dataAttributeFilter2, setDataAttributeFilter2] = useState<
    TblAttributeFilter[]
  >([]);
  const [dataAttributeFilterOption2, setDataAttributeFilterOption2] = useState<
    TblAttributeFilterOption[]
  >([]);
  const [selectedAttributeFilter2, setSelectedAttributeFilter2] = useState<
    (AttributeOptionType | null)[]
  >([]);
  const [message1, setMessage1] = useState<ReactNode>(
    <EuiEmptyPrompt
      title={<h3>Dữ liệu rỗng !</h3>}
      titleSize="xs"
      body="Tải lại dữ liệu nếu trường hợp bạn không thấy có dữ liệu hiển thị !"
      actions={
        <EuiButton
          size="s"
          key="loadUsers"
          onClick={async () => {
            await fetchDataItem1(pagination1.pageIndex, pagination1.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );
  const [message2, setMessage2] = useState<ReactNode>(
    <EuiEmptyPrompt
      title={<h3>Dữ liệu rỗng !</h3>}
      titleSize="xs"
      body="Tải lại dữ liệu nếu trường hợp bạn không thấy có dữ liệu hiển thị !"
      actions={
        <EuiButton
          size="s"
          key="loadUsers"
          onClick={async () => {
            await fetchDataItem2(pagination2.pageIndex, pagination2.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );
  const [error1, setError1] = useState<string | undefined>();
  const [error2, setError2] = useState<string | undefined>();
  const [pagination1, setPagination1] = useState<Pagination>(paginationBase);
  const [pagination2, setPagination2] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch1, setParamSearch1] = useState<ParamSearchBase>();
  const [paramSearch2, setParamSearch2] = useState<ParamSearchBase>();

  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);

  const fetchDataItem1 = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage1("Đang lấy dữ liệu...");
    setLoading1(true);
    setListItem1([]);
    setError1(undefined);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_ITEM_BUILD}?Skip=${
        index * (size ?? 0)
      }&Take=${size}&CategoryId=${dataCategory.categoryId}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      if (selectedAttributeFilter1 && selectedAttributeFilter1.length > 0) {
        const filteredAttributes = selectedAttributeFilter1.filter(
          (attribute) => attribute !== null && attribute !== undefined
        );

        urlSearch += filteredAttributes
          .map((attribute) => {
            return `&AttributeValues=${attribute?.value}`;
          })
          .join("");
      }
      let callapi = await repository.get<
        MessageResponse<TblBuildPcListItemBuild[]>
      >(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage1(noItemsFoundMsg);
        setTotal1(0);
      } else {
        setListItem1(callapi?.data ?? []);
        setPagination1({
          ...pagination1,
          totalItemCount: callapi?.totalCount ?? 0,
        });
        setTotal1(callapi?.totalCount ?? 0);
        setIsDataChange(true);
      }
      return callapi?.data;
    } catch (error: any) {
      setError1("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading1(false);
    }
  };

  const fetchDataItem2 = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage2("Đang lấy dữ liệu...");
    setLoading2(true);
    setListItem2([]);
    setError2(undefined);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_ITEM_BUILD}?Skip=${
        index * (size ?? 0)
      }&Take=${size}&CategoryId=${dataCategory.relCategoryId}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      if (selectedAttributeFilter2 && selectedAttributeFilter2.length > 0) {
        const filteredAttributes = selectedAttributeFilter2.filter(
          (attribute) => attribute !== null && attribute !== undefined
        );

        urlSearch += filteredAttributes
          .map((attribute) => {
            return `&AttributeValues=${attribute?.value}`;
          })
          .join("");
      }
      let callapi = await repository.get<
        MessageResponse<TblBuildPcListItemBuild[]>
      >(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage2(noItemsFoundMsg);
        setTotal2(0);
      } else {
        setListItem2(callapi?.data ?? []);
        setPagination2({
          ...pagination2,
          totalItemCount: callapi?.totalCount ?? 0,
        });
        setTotal2(callapi?.totalCount ?? 0);
        setIsDataChange(true);
      }
      return callapi?.data;
    } catch (error: any) {
      setError2("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading2(false);
    }
  };

  const callApiGetListItemRel = async (
    item: TblBuildPcListItemBuild | null
  ) => {
    if (item)
      try {
        setSelectedItem(item);
        setListItemRel([]);
        // setIsDataChange(true);
        let urlSearch =
          API_ROUTE.GET_LIST_ITEM_BUILD +
          `?Skip=0&Take=1000&ItemId=${item.id}&CategoryId=${
            item.categoryId === dataCategory.categoryId
              ? dataCategory.relCategoryId
              : dataCategory.categoryId
          }`;
        let callapi = await repository.get<
          MessageResponse<TblBuildPcListItemBuild[]>
        >(urlSearch);
        if (isNullOrUndefined(callapi) || isNullOrUndefined(callapi?.data)) {
        } else {
          setListItemRel(callapi?.data || []);
          setIsDataChange(true);
        }
      } catch (error: any) {
        NotificationExtension.Fails("Có lỗi xảy ra");
      }
  };

  const onTableChange1 = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblBuildPcListItemBuild>) => {
    setPagination1({ ...pagination1, pageIndex: index, pageSize: size });
  };
  const onSearch1 = async () => {
    await fetchDataItem1(
      pagination1.pageIndex,
      pagination1.pageSize,
      paramSearch1?.keyWord,
      paramSearch1?.inActive
    );
  };

  const onTableChange2 = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblBuildPcListItemBuild>) => {
    setPagination2({ ...pagination1, pageIndex: index, pageSize: size });
  };
  const onSearch2 = async () => {
    await fetchDataItem2(
      pagination1.pageIndex,
      pagination1.pageSize,
      paramSearch2?.keyWord,
      paramSearch2?.inActive
    );
  };

  const handleChooseItem = (item: TblBuildPcListItemBuild) => {
    callApiGetListItemRel(item);
  };

  const handleChooseCreateItemRel = async (item: TblBuildPcListItemBuild) => {
    const dataCreateItemRel = [
      {
        itemId: selectedItem?.id,
        relItemId: item?.id,
      },
    ];
    await createBuildPcItem(dataCreateItemRel);
    // item.categoryId === listItem1[0].categoryId ? onSearch1() : onSearch2();
    callApiGetListItemRel(selectedItem);
  };

  const handleChooseDeleteItemRel = async (item: TblBuildPcListItemBuild) => {
    const dataCreateItemRel = {
      itemId: selectedItem?.id,
      itemRelIds: [item?.id],
    };
    await deleteBuildPcItem(dataCreateItemRel);
    // item.categoryId === listItem1[0].categoryId ? onSearch1() : onSearch2();
    callApiGetListItemRel(selectedItem);
  };

  const handleChooseDeleteAllItemRel = async (
    item: TblBuildPcListItemBuild
  ) => {
    const dataCreateItemRel = {
      itemId: item?.id,
      itemRelIds: listItemRel.map((item) => item.id),
    };
    await deleteBuildPcItem(dataCreateItemRel);
    // item.categoryId !== listItem1[0].categoryId ? onSearch1() : onSearch2();
    callApiGetListItemRel(selectedItem);
  };

  const handleChooseAll = async () => {
    if (selectedItem) {
      if (
        selectedItem?.categoryId === listItem1[0]?.categoryId &&
        listItem2.length > 0
      ) {
        setLoading2(true);
        let urlSearch = `Skip=0&Take=${total2}&CategoryId=${listItem2[0]?.categoryId}`;
        if (!isNullOrEmpty(paramSearch2?.keyWord))
          urlSearch = urlSearch + `&KeySearch=` + paramSearch2?.keyWord;
        if (selectedAttributeFilter2 && selectedAttributeFilter2.length > 0) {
          const filteredAttributes = selectedAttributeFilter2.filter(
            (attribute) => attribute !== null && attribute !== undefined
          );

          urlSearch += filteredAttributes
            .map((attribute) => {
              return `&AttributeValues=${attribute?.value}`;
            })
            .join("");
        }
        const dataApi = await getListBuildPcItem(urlSearch);

        if (!isNullOrUndefined(dataApi) && !isNullOrUndefined(dataApi.data)) {
          const list = dataApi.data.map((item: TblBuildPcListItemBuild) => ({
            itemId: selectedItem?.id,
            relItemId: item.id,
          }));
          await createBuildPcItem(list);
          callApiGetListItemRel(selectedItem);
        } else
          NotificationExtension.Fails("Không có sản phẩm để chọn liên quan");
        setLoading2(false);
      } else if (
        selectedItem?.categoryId === listItem2[0]?.categoryId &&
        listItem1.length > 0
      ) {
        setLoading1(true);
        let urlSearch = `Skip=0&Take=${total1}&CategoryId=${listItem1[0]?.categoryId}`;
        if (!isNullOrEmpty(paramSearch1?.keyWord))
          urlSearch = urlSearch + `&KeySearch=` + paramSearch2?.keyWord;
        if (selectedAttributeFilter1 && selectedAttributeFilter1.length > 0) {
          const filteredAttributes = selectedAttributeFilter1.filter(
            (attribute) => attribute !== null && attribute !== undefined
          );

          urlSearch += filteredAttributes
            .map((attribute) => {
              return `&AttributeValues=${attribute?.value}`;
            })
            .join("");
        }
        const dataApi = await getListBuildPcItem(urlSearch);

        if (!isNullOrUndefined(dataApi) && !isNullOrUndefined(dataApi.data)) {
          const list = dataApi.data.map((item: TblBuildPcListItemBuild) => ({
            itemId: selectedItem?.id,
            relItemId: item.id,
          }));
          await createBuildPcItem(list);
          callApiGetListItemRel(selectedItem);
        } else
          NotificationExtension.Fails("Không có sản phẩm để chọn liên quan");
        setLoading1(false);
      } else NotificationExtension.Fails("Không có sản phẩm để chọn liên quan");
    } else NotificationExtension.Fails("Chưa chọn sản phẩm");
  };

  const onChangeSelect1 = (value: string | null, indexGroup: number) => {
    const selectOption = dataAttributeFilterOption1[indexGroup].options.find(
      (item) => item.value === value
    );
    const newSelectedAttribute = [...selectedAttributeFilter1];
    newSelectedAttribute[indexGroup] = selectOption || null;
    setSelectedAttributeFilter1(newSelectedAttribute);
  };

  const onChangeSelect2 = (value: string | null, indexGroup: number) => {
    const selectOption = dataAttributeFilterOption2[indexGroup].options.find(
      (item) => item.value === value
    );
    const newSelectedAttribute = [...selectedAttributeFilter2];
    newSelectedAttribute[indexGroup] = selectOption || null;
    setSelectedAttributeFilter2(newSelectedAttribute);
  };

  const onChange1 = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch1({ ...paramSearch1, inActive: value });
    } else setParamSearch1({ ...paramSearch1, inActive: undefined });
  };

  const onChange2 = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch2({ ...paramSearch2, inActive: value });
    } else setParamSearch2({ ...paramSearch2, inActive: undefined });
  };

  const onChangeText1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch1({ ...paramSearch1, keyWord: key });
  };

  const onChangeText2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch2({ ...paramSearch2, keyWord: key });
  };

  useEffect(() => {
    const callApiGetSelectOption = async () => {
      if (dataCategory.categoryId) {
        const callapi = await getListAttributeFilter(
          `?categoryId=${dataCategory.categoryId}`
        );
        if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
          const dataApi = callapi?.data;
          if (dataApi != null && !isNullOrUndefined(dataApi)) {
            setDataAttributeFilter1(dataApi);
          }
        } else {
          console.log("Dữ liệu không tồn tại");
        }
      }
      if (dataCategory.relCategoryId) {
        const callapi = await getListAttributeFilter(
          `?categoryId=${dataCategory.categoryId}`
        );
        if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
          const dataApi = callapi?.data;
          if (dataApi != null && !isNullOrUndefined(dataApi)) {
            setDataAttributeFilter2(dataApi);
          }
        } else {
          console.log("Dữ liệu không tồn tại");
        }
      }
    };
    if (dataCategory) callApiGetSelectOption();
  }, [dataCategory]);

  useEffect(() => {
    const dataOption = dataAttributeFilter1.map((item) => ({
      id: item.id,
      attributeName: item.attributeName,
      options: item.attributeValues.map((attribute) => ({
        value: attribute.id.toString(),
        label: attribute.value,
      })),
    }));
    setDataAttributeFilterOption1(dataOption);
  }, [dataAttributeFilter1]);

  useEffect(() => {
    const dataOption = dataAttributeFilter2.map((item) => ({
      id: item.id,
      attributeName: item.attributeName,
      options: item.attributeValues.map((attribute) => ({
        value: attribute.id.toString(),
        label: attribute.value,
      })),
    }));
    setDataAttributeFilterOption2(dataOption);
  }, [dataAttributeFilter2]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataItem1(
        pagination1.pageIndex,
        pagination1.pageSize,
        paramSearch1?.keyWord,
        paramSearch1?.inActive
      );
    };
    fetchData();
  }, [pagination1.pageIndex, pagination1.pageSize]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataItem2(
        pagination2.pageIndex,
        pagination2.pageSize,
        paramSearch2?.keyWord,
        paramSearch2?.inActive
      );
    };
    fetchData();
  }, [pagination2.pageIndex, pagination2.pageSize]);

  useEffect(() => {
    if (isDataChange) {
      if (selectedItem && listItemRel) {
        if (listItem1[0]?.categoryId !== selectedItem.categoryId) {
          setListItem1((prevData) =>
            prevData.map((item) => ({
              ...item,
              isRel: listItemRel.some((itemRel) => itemRel.id === item.id),
            }))
          );
        } else {
          setListItem2((prevData) =>
            prevData.map((item) => ({
              ...item,
              isRel: listItemRel.some((itemRel) => itemRel.id === item.id),
            }))
          );
        }
      }
      setIsDataChange(false);
    }
  }, [selectedItem, listItemRel, isDataChange]);

  return (
    <>
      <Flex gap={10}>
        <Box>
          <Text size="xl" fw={700} my={5}>
            {dataCategory.categoryName} (#{dataCategory.categoryId})
          </Text>
          <AppSearch
            loading={loading1}
            onChange={onChange1}
            onChangeText={onChangeText1}
            onSearch={onSearch1}
          />
          <Flex gap={5} mt={10}>
            <Text fw={700} miw={"max-content"} mt={3}>
              Bộ lọc:{" "}
            </Text>{" "}
            <Flex wrap="wrap" gap={5}>
              {dataAttributeFilterOption1?.map((item, indexGroup) => (
                <Select
                  key={indexGroup}
                  data={[
                    { group: item.attributeName || "", items: item.options },
                  ]}
                  placeholder={item.attributeName || ""}
                  clearable
                  searchable
                  value={selectedAttributeFilter1[indexGroup]?.value || null}
                  onChange={(value) => onChangeSelect1(value, indexGroup)}
                />
              ))}
              <Button onClick={onSearch1}>Lọc sản phẩm</Button>
            </Flex>
          </Flex>
          <EuiSpacer size="l" />
          <EuiBasicTable
            tableCaption="Demo of EuiDataGrid with selection"
            items={listItem1 ? listItem1 : []}
            itemId="id"
            error={error1}
            loading={loading1}
            noItemsMessage={isNullOrUndefinedArry(listItem1) ? message1 : ""}
            columns={columns1}
            pagination={pagination1}
            hasActions={true}
            responsive={true}
            onChange={onTableChange1}
            compressed={true}
            css={{ overflow: "scroll", maxHeight: "600px" }}
          />
        </Box>

        <Box>
          <Text size="xl" fw={700} my={5}>
            {dataCategory.relCategoryName} (#{dataCategory.relCategoryId})
          </Text>
          <AppSearch
            loading={loading2}
            onChange={onChange2}
            onChangeText={onChangeText2}
            onSearch={onSearch2}
          />
          <Flex gap={5} mt={10}>
            <Text fw={700} miw={"max-content"} mt={3}>
              Bộ lọc:{" "}
            </Text>{" "}
            <Flex wrap="wrap" gap={5}>
              {dataAttributeFilterOption2?.map((item, indexGroup) => (
                <Select
                  key={indexGroup}
                  data={[
                    { group: item.attributeName || "", items: item.options },
                  ]}
                  placeholder={item.attributeName || ""}
                  clearable
                  searchable
                  value={selectedAttributeFilter2[indexGroup]?.value || null}
                  onChange={(value) => onChangeSelect2(value, indexGroup)}
                />
              ))}
              <Button onClick={onSearch2}>Lọc sản phẩm</Button>
            </Flex>
          </Flex>
          <EuiSpacer size="l" />
          <EuiBasicTable
            tableCaption="Demo of EuiDataGrid with selection"
            items={listItem2 ? listItem2 : []}
            itemId="id"
            error={error2}
            loading={loading2}
            noItemsMessage={isNullOrUndefinedArry(listItem2) ? message2 : ""}
            columns={columns2}
            pagination={pagination2}
            hasActions={true}
            responsive={true}
            onChange={onTableChange2}
            compressed={true}
            css={{ overflow: "scroll", maxHeight: "600px" }}
          />
        </Box>
      </Flex>
    </>
  );
};

type FormChooseItemProps = {
  dataCategory: {
    categoryId: number | null;
    categoryName: string | null;
    relCategoryId: number | null;
    relCategoryName: string | null;
  };
};

export default ChooseItemRelView;
