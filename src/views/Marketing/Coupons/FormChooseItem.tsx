import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButton,
  EuiEmptyPrompt,
  EuiImage,
  EuiLink,
  EuiSpacer,
  Pagination,
} from "@elastic/eui";
import { Box, Button, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import React, { ReactNode, useEffect, useState } from "react";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import { getDataListProduct } from "../../../api/ApiProduct";
import Repository from "../../../_base/helper/HttpHelper";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import { getDataBrand } from "../../../api/ApiSell";
import AppSearch from "../../../common/AppSearch";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import { Brand, TblItemCommand } from "../../../model/ProductList";

const noItemsFoundMsg = "Không có kết quả tìm kiếm phù hợp...";

const FormChooseItem = ({
  onChooseItem,
  textButton = "Chọn sản phẩm",
}: FormChooseItemProps) => {
  const [toltal, setTotal] = useState(0);
  const [dataBrand, setDataBrand] = useState<Brand[]>();

  const columns: Array<EuiBasicTableColumn<TblItemCommand>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "3%",
    },
    {
      field: "itemName",
      name: "Tên sản phẩm",
      footer: <em>Page totals: {toltal}</em>,
      sortable: true,
      truncateText: true,
      width: "18%",

      render: (itemName: string) => (
        <EuiLink target="_blank">{itemName}</EuiLink>
      ),
    },
    {
      field: "primaryImage",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "7%",
      render: (primaryImage: any) => {
        return (
          <EuiImage
            size=""
            width={60}
            height={80}
            src={primaryImage}
            alt="alt"
          />
        );
      },
    },
    {
      field: "brandId",
      name: "Thương hiệu",
      sortable: true,
      truncateText: true,
      width: "8%",
      render: (brandId: number) => {
        return (
          <EuiLink target="_blank">
            {dataBrand?.filter((item: any) => item?.id === brandId)[0]?.name}
          </EuiLink>
        );
      },
    },
    {
      field: "unitSellingPrice",
      name: "Giá bán",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (price: number) => {
        return (
          <>
            <Text fw={600} style={{ color: "red", marginRight: 4 }}>
              {convertToVnd(price)}
            </Text>
            <Text>vnd</Text>
          </>
        );
      },
    },
    {
      field: "discountValue",
      name: "Giảm giá",
      sortable: true,
      truncateText: true,
      render: (discountValue: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Giảm giá</Text>
              <Text fw={600} style={{ color: "red", marginLeft: 4 }}>
                {discountValue ? `${discountValue}%` : "0%"}
              </Text>
            </Box>
            <Text>so với giá gốc</Text>
          </Box>
        );
      },
    },
    {
      field: "onhandQuantyty",
      name: "Số lượng tồn kho",
      sortable: true,
      truncateText: true,
      render: (onhandQuantyty: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Số lượng tổng:</Text>
              <Text fw={600} style={{ color: "red", marginLeft: 4 }}>
                {onhandQuantyty}
              </Text>
            </Box>
            <EuiLink>
              {onhandQuantyty == 0 ? (
                <Text style={{ color: "red" }}>hết hàng</Text>
              ) : (
                <Text style={{ color: "blue" }}>còn hàng</Text>
              )}
            </EuiLink>
          </Box>
        );
      },
    },
    {
      field: "warrantyDescrition",
      name: "Thông tin bảo hành",
      sortable: true,
      truncateText: true,
      render: (warrantyDescrition: number) => {
        return (
          <Box display={"flex"} style={{ flexDirection: "column" }}>
            <Box display={"flex"}>
              <Text>Thời hạn:</Text>
              <EuiLink style={{ marginLeft: 4 }}>{warrantyDescrition}</EuiLink>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "color",
      name: "Màu sắc",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (color: string) => (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: color,
                marginRight: "8px",
              }}
            ></div>
            {color}
          </div>
        </>
      ),
    },
    {
      name: "Chọn",
      width: "8%",
      render: (item: TblItemCommand) => {
        return (
          <Button onClick={() => handleChooseItem(item)}>{textButton}</Button>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<TblItemCommand[]>([]);
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
            await fetchDataItem(pagination.pageIndex, pagination.pageSize);
          }}
        >
          Tải dữ liệu !
        </EuiButton>
      }
    />
  );
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();

  const fetchDataItem = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setMessage("Đang lấy dữ liệu...");
    setLoading(true);
    setUsers([]);
    setError(undefined);

    try {
      let urlSearch = `?Skip=${index * (size ?? 0)}&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Active=` + inActive;
      let callapi = await getDataListProduct(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setMessage(noItemsFoundMsg);
        setTotal(0);
      } else {
        setUsers(callapi?.data ?? []);
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
  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<TblItemCommand>) => {
    setPagination({ ...pagination, pageIndex: index, pageSize: size });
  };
  const onSearch = async () => {
    await fetchDataItem(
      pagination.pageIndex,
      pagination.pageSize,
      paramSearch?.keyWord,
      paramSearch?.inActive
    );
  };

  const handleChooseItem = (item: any) => {
    onChooseItem(item?.id);
    modals.close("item");
  };

  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };

  function convertToVnd(amount: number): string {
    const amountStr: string = amount?.toString();
    const chunks: string[] = [];

    for (let i = amountStr?.length - 1; i >= 0; i -= 3) {
      const chunk = amountStr?.slice(Math.max(i - 2, 0), i + 1);
      chunks.push(chunk);
    }

    const result: string = chunks.reverse().join(".");
    return result;
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataItem(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const fetDatabrand = async () => {
      const data = await getDataBrand();
      setDataBrand(data?.data.lists);
    };
    fetDatabrand();
  }, []);
  return (
    <>
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={onSearch}
      />
      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={users ? users : []}
        itemId="id"
        error={error}
        loading={loading}
        noItemsMessage={isNullOrUndefinedArry(users) ? message : ""}
        columns={columns}
        pagination={pagination}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        onChange={onTableChange}
        compressed={true}
      />
    </>
  );
};

type FormChooseItemProps = {
  onChooseItem: (idItem: number) => void;
  indexItem?: number;
  indexGroup?: number;
  textButton?: string;
};

export default FormChooseItem;
