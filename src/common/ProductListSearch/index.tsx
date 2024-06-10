import {
  EuiButton,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import React, { ReactNode, useEffect, useState } from "react";
import { selectedSearchOptionType } from "../../views/ProductManager/ProductList/MainView";
import { getDataBrand } from "../../api/ApiSell";
import { TblBrand } from "../../model/TblBrand";

const visColorsBehindText = euiPaletteColorBlindBehindText();

const searchOption = {
  features: [
    {
      value: "NewStatus",
      label: "Mới",
      color: visColorsBehindText[0],
    },
    {
      value: "HotStatus",
      label: "Hot (hỏi nhiều)",
      color: visColorsBehindText[1],
    },
    {
      value: "BestSaleStatus",
      label: "Bán chạy",
      color: visColorsBehindText[2],
    },
    {
      value: "SaleOffStatus",
      label: "Xả hàng (sale-off)",
      color: visColorsBehindText[3],
    },
    {
      value: "OnlineStatus",
      label: "Chỉ bán online",
      color: visColorsBehindText[4],
    },
  ],
  searchType: [
    {
      value: 1,
      label: "Giá bán = 0",
      color: visColorsBehindText[0],
    },
    {
      value: 2,
      label: "        Còn hàng",
      color: visColorsBehindText[1],
    },
    {
      value: 3,
      label: "Hết hàng",
      color: visColorsBehindText[2],
    },
    {
      value: 4,
      label: "Có giá thị trường",
      color: visColorsBehindText[3],
    },
    {
      value: 5,
      label: "Có khuyến mại",
      color: visColorsBehindText[4],
    },
    {
      value: 6,
      label: "Chưa có mã kho",
      color: visColorsBehindText[5],
    },
    {
      value: 7,
      label: "Chưa có ảnh",
      color: visColorsBehindText[6],
    },
    {
      value: 8,
      label: "Chưa hiển thị",
      color: visColorsBehindText[7],
    },
    {
      value: 9,
      label: "Đang hiển thị",
      color: visColorsBehindText[8],
    },
    {
      value: 10,
      label: "Chưa có danh mục",
      color: visColorsBehindText[9],
    },
    {
      value: 11,
      label: "Chưa có mô tả",
      color: visColorsBehindText[10],
    },
    {
      value: 12,
      label: "Chưa có thông tin thông số chưa nhập text",
      color: visColorsBehindText[11],
    },
  ],
};

const ProductListSearch = ({
  onChangeText,
  loading,
  onSearch,
  onChangeSelectedSearch,
  selectedSearchOption,
  dataBrandOption,
}: AppSearchProps) => {
  // const [dataBrand, setDataBrand] = useState<TblBrand[]>([]);
  // const [dataBrandOption, setDataBrandOption] = useState<
  //   { value: number; label: string }[]
  // >([]);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      onChangeText(e);
    }, 400);
  };

  // useEffect(() => {
  //   const fetchDataBrand = async () => {
  //     const dataApi = await getDataBrand();
  //     setDataBrand(dataApi);
  //   };

  //   fetchDataBrand();
  // }, []);

  // useEffect(() => {
  //   if (dataBrand && dataBrand.length > 0)
  //     setDataBrandOption(
  //       dataBrand?.map((brand) => ({
  //         value: brand.id,
  //         label: brand.name,
  //       }))
  //     );
  // }, []);

  return (
    <div>
      <EuiFlexGroup>
        <EuiFlexItem grow={2}>
          <EuiFormRow label="Tìm kiếm :" fullWidth>
            <EuiFlexGroup alignItems="flexEnd">
              <EuiFlexItem grow={false}>
                <EuiFieldSearch
                  placeholder="Tìm kiếm..."
                  fullWidth
                  aria-label="An example of search with fullWidth"
                  onChange={(e) => handleChangeText(e)}
                  onKeyDown={(e: any) => {
                    if (e.code === "Enter") {
                      onSearch();
                    }
                  }}
                  disabled={loading}
                />
              </EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiButton
                  isLoading={loading}
                  iconType="lensApp"
                  isDisabled={loading}
                  onClick={onSearch}
                >
                  Tìm kiếm
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFormRow>
        </EuiFlexItem>

        <EuiFlexItem grow={3}>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiFormRow label="Đặc điểm sản phẩm: " fullWidth>
                <EuiComboBox
                  aria-label="Accessible screen reader label"
                  placeholder="Chọn đặc điểm"
                  selectedOptions={selectedSearchOption?.features}
                  options={searchOption.features || []}
                  onChange={(options) =>
                    onChangeSelectedSearch(options, "features")
                  }
                  fullWidth={true}
                  isDisabled={loading}
                  isCaseSensitive
                />
              </EuiFormRow>
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiFormRow label="Xem theo điều kiện" fullWidth>
                <EuiComboBox
                  aria-label="Accessible screen reader label"
                  placeholder="Chọn điều kiện"
                  selectedOptions={selectedSearchOption?.searchType}
                  options={searchOption.searchType || []}
                  onChange={(options) =>
                    onChangeSelectedSearch(options, "searchType")
                  }
                  fullWidth={true}
                  isDisabled={loading}
                  isCaseSensitive
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiFlexGroup style={{ marginTop: 20 }}>
        <EuiFlexItem grow={3}>
          <EuiFormRow label="Xem theo danh mục" fullWidth>
            <EuiComboBox
              aria-label="Accessible screen reader label"
              placeholder="Chọn danh mục"
              // selectedOptions={searchType}
              options={searchOption.searchType || []}
              // onChange={onChangeSearchType}
              fullWidth={true}
              isDisabled={true}
              isCaseSensitive
            />
          </EuiFormRow>
        </EuiFlexItem>

        <EuiFlexItem grow={3}>
          <EuiFormRow label="Xem theo thương hiệu" fullWidth>
            <EuiComboBox
              aria-label="Accessible screen reader label"
              placeholder="Chọn thương hiệu"
              selectedOptions={selectedSearchOption?.brandId}
              options={dataBrandOption || []}
              onChange={(options) => onChangeSelectedSearch(options, "brandId")}
              fullWidth={true}
              isDisabled={loading}
              isCaseSensitive
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={5}></EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};

export default ProductListSearch;

type AppSearchProps = {
  onChangeText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  selectedSearchOption: selectedSearchOptionType | undefined;
  onChangeSelectedSearch: (
    value:
      | EuiComboBoxOptionOption<string>[]
      | EuiComboBoxOptionOption<number>[],
    key: string
  ) => void;
  onSearch: () => void;
  dataBrandOption: {
    value: number;
    label: string;
  }[];
};
