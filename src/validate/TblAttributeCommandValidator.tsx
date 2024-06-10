import { FormValidateInput } from "@mantine/form/lib/types";
import { hasLength } from "@mantine/form";
import { TblAttributeCommand } from "../model/TblAttributeCommand";

export const _validate: FormValidateInput<TblAttributeCommand> = {
  attributeName: (value: string | null) => {
    if (
      value === null ||
      !/^[a-zA-Z0-9À-ÖØ-öø-ÿ ,ĂăÂâẹếÀàÃãỰựsàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ\p{M}]+$/u.test(
        value
      )
    ) {
      return "Mã không được chứa kí tự đặc biệt!";
    }
    return hasLength(
      { min: 2, max: 50 },
      "Tên phải từ 2-50 kí tự!"
    )(value as string);
  },
  attributeCode: (value: string | null) => {
    if (
      value === null ||
      !/^[a-zA-Z0-9À-ÖØ-öø-ÿ ,ĂăÂâẹếÀàÃãỰựsàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ\p{M}]+$/u.test(
        value
      )
    ) {
      return "Mã không được chứa kí tự đặc biệt!";
    }
    return hasLength(
      { min: 2, max: 50 },
      "Tên phải từ 2-100 kí tự!"
    )(value as string);
  },
};
