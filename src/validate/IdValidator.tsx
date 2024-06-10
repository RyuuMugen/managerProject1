import { FormValidateInput } from "@mantine/form/lib/types";
import { isInRange } from "@mantine/form";
import { BaseId } from "../model/_baseId";



export const _validate: FormValidateInput<BaseId> = {
    id: isInRange({ min: 0, max: 10000 }, 'STT chỉ được nằm trong khoảng 0 - 1000 !'),

}