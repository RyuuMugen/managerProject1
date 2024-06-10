import { FormValidateInput } from "@mantine/form/lib/types";
import { hasLength, isInRange } from "@mantine/form";
import { TblAttributeValueCommand } from "../model/TblAttributeValueCommand";

export const _validateValue: FormValidateInput<TblAttributeValueCommand> = {
    value: hasLength(
        { min: 2, max: 50 },
        "Giá phải chứa từ 2-50 kí tự !"
    ),
    orderNumber: isInRange({ min: 0, max: 3200 }, "STT phải nằm trong khoảng từ 0-32000")
}