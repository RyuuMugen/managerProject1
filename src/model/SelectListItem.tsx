export interface SelectListItem {
  Disabled: boolean;
  Group: SelectListGroup | null; // SelectListGroup là một giao diện hoặc lớp khác
  Selected: boolean;
  Text: string;
  Value: string;
}

export interface SelectListGroup {
  Disabled: boolean;
  Name: string;
}
