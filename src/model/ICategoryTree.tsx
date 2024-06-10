export interface ICategoryTree {
    code: string;
    name: string;
    address: string;
    parentId: string;
    path: string;
    description: string;
    inactive: boolean;
    children: ICategoryTree[];
    active: boolean;
    data: any;
    expanded: boolean;
    extraClasses: string;
    focus: boolean;
    folder: boolean;
    hideCheckbox: boolean;
    icon: string;
    key: string;
    lazy: boolean;
    refKey: string;
    selected: boolean;
    title: string;
    tooltip: string;
    id: string;
    unselectable: boolean;
    level: number;
}
