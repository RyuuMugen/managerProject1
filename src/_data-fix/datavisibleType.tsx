import { ComboboxItem } from "@mantine/core";

export const datavisibleType: ComboboxItem[] = [{
    label: "Chỉ hiện thị danh mục con",
    value: "child_only"
  }, {
    label: "Chỉ hiển thị sản phẩm",
    value: "product"
  }, {
    label: "Hiển thị sản phẩm + Danh mục con",
    value: "child_product"
  }];