import { FormValidateInput } from "@mantine/form/lib/types";
import { TblCategoryModel } from "../model/TblCategoryModel";
import { hasLength, isNotEmpty } from "@mantine/form";

export const _validate: FormValidateInput<TblCategoryModel> = {
  categoryName: (value: string | null) => {
    if (!value) {
      return "Vui Lòng Nhập Tên Danh Mục!";
    }
    return hasLength(
      { min: 2, max: 50 },
      "Tên phải từ 2-50 kí tự!"
    )(value as string);
  },
  categoryCode: (value: string | null) => {
    if (!value) {
      return "Vui Lòng Nhập Mã Danh Mục!";
    }
    return hasLength(
      { min: 2, max: 50 },
      "Tên phải từ 2-50 kí tự!"
    )(value as string);
  },
  visibleType: hasLength(
    { min: 1, max: 50 },
    "Chưa chọn loại nội dung hiển thị !"
  ),
  priorityStatus: isNotEmpty("Chưa chọn trạng thái nổi bật !"),
  status: isNotEmpty("Chưa chọn trạng thái !"),
  categoryType: hasLength({ min: 1, max: 50 }, "Chưa chọn loại danh mục !"),
  urlCanonicalForSeo: hasLength(
    { min: 3, max: 255 },
    "Độ dài từ 3 đến 255 ký tự"
  ),
  metaKeyword: hasLength({ min: 3, max: 1000 }, "Độ dài từ 3 đến 1000 ký tự"),
  metaTitle: hasLength({ min: 3, max: 1000 }, "Độ dài từ 3 đến 1000 ký tự"),
  metaDescription: hasLength(
    { min: 3, max: 1000 },
    "Độ dài từ 3 đến 1000 ký tự!"
  ),
};
