import {
  Anchor,
  Box,
  Button,
  Checkbox,
  ComboboxItem,
  Flex,
  Group,
  LoadingOverlay,
  NumberInput,
  Radio,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TblCategoryModel } from "../../../model/TblCategoryModel";
import {
  TblTradeInHeader,
  TblTradeInLine,
  TradeInProductCat,
} from "../../../model/TblTradeIn";
import { MessageResponse } from "../../../model/MessageResponse";
import Repository from "../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../const/apiRoute";
import {
  getListTradeInHeader,
  modifyTradeInHeader,
} from "../../../api/ApiTradeIn";
import { EuiBasicTable, EuiBasicTableColumn } from "@elastic/eui";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import {
  modifyMegaMenuGet,
  modifyMegaMenuPost,
} from "../../../api/ApiMegaMenu";

type EditViewProps = {
  onSearch: Function;
  dataParent: TradeInProductCat[];
  id: number;
};

const EditView = ({ onSearch, dataParent, id }: EditViewProps) => {
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "2%",
    },
    {
      field: "productCondition",
      name: "	Tình trạng sản phẩm",
      sortable: true,
      truncateText: true,
      width: "18%",
      render: (productCondition: string, header: TblTradeInHeader) => (
        <TextInput
          value={productCondition}
          onChange={(e) =>
            handleChangeProductCondition(e.currentTarget.value, header.id)
          }
          w={"100%"}
        />
      ),
    },
    {
      field: "method",
      name: "Tình trạng sản phẩm",
      sortable: true,
      truncateText: true,
      width: "30%",
      render: (method: number, header: TblTradeInHeader) => {
        return (
          <Radio.Group
            onChange={(value) => handleChangeMethod(value, header.id)}
            defaultValue={method.toString()}
          >
            <Group mt="xs">
              <Radio
                value="1"
                label={
                  <Text>
                    Cài giá thu mua/chuyển đổi riêng từng sản phẩm (cài trong
                    danh sách của nhóm)
                  </Text>
                }
              />
              <Radio
                value="2"
                label={
                  <Flex align={"center"} gap={5}>
                    <Text>Dùng công thức: Trừ đi</Text>
                    <TextInput
                      value={
                        (header?.measure === "P"
                          ? header?.percentSupport
                          : header?.amountSupport) || ""
                      }
                      onChange={(e) =>
                        handleChangeValueSupport(
                          e.currentTarget.value,
                          header?.id
                        )
                      }
                      type="number"
                      w={120}
                    />
                    <Select
                      data={[
                        { value: "P", label: "%" },
                        { value: "V", label: "VND" },
                      ]}
                      value={header?.measure || "P"}
                      onChange={(e) => handleChangeMeasure(e, header?.id)}
                      w={80}
                    />
                    <Text>so với giá bán của sản phẩm</Text>
                  </Flex>
                }
              />
            </Group>
          </Radio.Group>
        );
      },
    },

    {
      field: "tblTradeInLines",
      name: "Công thức tính Phụ kiện và bảo hành",
      sortable: true,
      truncateText: true,
      width: "23%",
      render: (tblTradeInLines: TblTradeInLine[], header: TblTradeInHeader) => {
        return (
          <Flex direction={"column"}>
            {tblTradeInLines?.map((line, index) => (
              <Box
                key={index}
                style={{ borderBottom: "1px solid #000000" }}
                p={"5px 0"}
              >
                <Flex gap={10}>
                  <Text>Nội dung</Text>
                  <Textarea
                    value={line.description || ""}
                    onChange={(e) =>
                      handleChangeContentLine(
                        e.currentTarget.value,
                        header?.id,
                        index
                      )
                    }
                    w={"100%"}
                  />
                </Flex>
                <Flex align={"center"} gap={10} mt={10}>
                  <Text>Trợ giá</Text>
                  <TextInput
                    value={
                      (line?.measure === "P" ? line?.percent : line?.amount) ||
                      ""
                    }
                    onChange={(e) =>
                      handleChangeValueSupportLine(
                        e.currentTarget.value,
                        header?.id,
                        index
                      )
                    }
                    type="number"
                    w={120}
                  />
                  <Select
                    data={[
                      { value: "P", label: "%" },
                      { value: "V", label: "VND" },
                    ]}
                    value={line?.measure || "P"}
                    onChange={(e) =>
                      handleChangeMeasureLine(e, header?.id, index)
                    }
                    w={80}
                  />
                  <Text>(* nhập số âm nếu muốn trừ giá)</Text>
                </Flex>

                <Flex align={"center"} gap={10} mt={10}>
                  <Text>Thứ tự: </Text>
                  <NumberInput
                    value={line?.orderNumber || 0}
                    onChange={(value) =>
                      handleChangeOrderNumberLine(value, header?.id, index)
                    }
                    w={120}
                  />
                </Flex>

                <Flex mt={15} align={"center"}>
                  <Text>Lựa chọn: </Text>
                  <Anchor
                    p={"0 5px"}
                    // style={{ borderRight: "1px solid #000000" }}
                    onClick={() => handleDeleteLine(header?.id, index)}
                    c={"red"}
                  >
                    Xóa
                  </Anchor>
                  {/* <Anchor
                    p={"0 5px"}
                    style={{ borderRight: "1px solid #000000" }}
                  >
                    Cho lên trên
                  </Anchor>
                  <Anchor p={"0 5px"}>Cho xuống dưới</Anchor> */}
                </Flex>
              </Box>
            ))}
            <Flex justify={"center"} align={"center"} mt={10}>
              <Button
                variant="outline"
                onClick={() => handleAddLine(header?.id)}
                leftSection={<IconPlus size={16} />}
              >
                Thêm mới điều kiện
              </Button>
            </Flex>
          </Flex>
        );
      },
    },
    {
      field: "",
      name: "Thao tác",
      sortable: true,
      truncateText: true,
      width: "3%",
      align: "center",
      render: (header: TblTradeInHeader) => {
        return (
          <Anchor
            ml={10}
            onClick={() => handleDeleteHeader(header?.id)}
            c={"red"}
          >
            Xóa
          </Anchor>
        );
      },
    },
  ];

  const entity: TblCategoryModel = {
    id: 0,
    categoryCode: null,
    categoryName: "",
    isBuildPc: "N",
    isMegaMenu: "N",
    idParent: null,
    description: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdateLogin: null,
    orgId: null,
    categoryType: null,
    content: null,
    tags: null,
    imageIcon: null,
    imageOwner: null,
    priceRange: null,
    visibleType: null,
    fixedContent: null,
    orderedNumber: null,
    urlRedirect: null,
    templateFile: null,
    visibleItemQty: null,
    urlCanonicalForSeo: null,
    linkForSeo: null,
    idexForSeo: null,
    enableChangeLink: null,
    metaTitle: null,
    metaKeyword: null,
    metaDescription: null,
    itemCount: 0,
    tblCategoryModels: [],
    categoryTreeModels: [],
    tblCategoryAttributeModel: null,
    tblCategoryImageModels: null,
    listTblCategoryImage: null,
    listTblCategoryAttribute: [],
    status: null,
    priorityStatus: null,
    brandIds: [],
    isTradeIn: "Y",
  };
  const form = useForm<TblCategoryModel>({
    initialValues: {
      ...entity,
    },

    validate: {
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
    },
  });

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [parentOption, setParentOption] = useState<ComboboxItem[]>([]);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [dataTradeInHeader, setDataTradeInHeader] = useState<
    TblTradeInHeader[]
  >([]);

  const handleCreateCategory = async (dataSubmit: TblCategoryModel) => {
    open();
    const {
      tblCategoryImageModels,
      listTblCategoryImage,
      tblCategoryModels,
      ...restGroup
    } = dataSubmit;
    await modifyMegaMenuPost(restGroup);

    const dataHeader = { itemCatId: id, tblTradeInHeader: dataTradeInHeader };

    await modifyTradeInHeader(dataHeader);
    onSearch();
    close();
    modals.closeAll();
  };

  const handleAddHeader = () => {
    const newHeader: TblTradeInHeader = {
      id: -dataTradeInHeader.length,
      productCondition: "",
      method: 2,
      amountSupport: 0,
      percentSupport: 0,
      measure: "P",
      catId: id,
      option: "",
    };
    setDataTradeInHeader([...dataTradeInHeader, newHeader]);
  };

  const handleDeleteHeader = (id: number) => {
    setDataTradeInHeader(dataTradeInHeader.filter((item) => item.id !== id));
  };

  const handleChangeProductCondition = (value: string, id: number) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            productCondition: value,
          };
        }
        return item;
      });
    });
  };

  const handleChangeMethod = (value: string, id: number) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            method: Number(value),
          };
        }
        return item;
      });
    });
  };

  const handleChangeValueSupport = (value: string, id: number) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [item?.measure === "P" ? "percentSupport" : "amountSupport"]: value,
          };
        }
        return item;
      });
    });
  };

  const handleChangeMeasure = (value: string | null, id: number) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            measure: value,
          };
        }
        return item;
      });
    });
  };

  const handleChangeContentLine = (
    value: string | null,
    id: number,
    index: number
  ) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id && item.tblTradeInLines) {
          const updatedTblTradeInLines = [...item.tblTradeInLines];
          updatedTblTradeInLines[index] = {
            ...updatedTblTradeInLines[index],
            description: value,
          };
          return {
            ...item,
            tblTradeInLines: updatedTblTradeInLines,
          };
        }
        return item;
      });
    });
  };

  const handleChangeValueSupportLine = (
    value: string,
    id: number,
    index: number
  ) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id && item.tblTradeInLines) {
          const updatedTblTradeInLines = [...item.tblTradeInLines];
          updatedTblTradeInLines[index] = {
            ...updatedTblTradeInLines[index],
            [item?.measure === "P" ? "percent" : "amount"]: value,
          };
          return {
            ...item,
            tblTradeInLines: updatedTblTradeInLines,
          };
        }
        return item;
      });
    });
  };

  const handleChangeMeasureLine = (
    value: string | null,
    id: number,
    index: number
  ) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id && item.tblTradeInLines) {
          const updatedTblTradeInLines = [...item.tblTradeInLines];
          updatedTblTradeInLines[index] = {
            ...updatedTblTradeInLines[index],
            measure: value,
          };
          return {
            ...item,
            tblTradeInLines: updatedTblTradeInLines,
          };
        }
        return item;
      });
    });
  };

  const handleChangeOrderNumberLine = (
    value: string | number,
    id: number,
    index: number
  ) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id && item.tblTradeInLines) {
          const updatedTblTradeInLines = [...item.tblTradeInLines];
          updatedTblTradeInLines[index] = {
            ...updatedTblTradeInLines[index],
            orderNumber: Number(value),
          };
          return {
            ...item,
            tblTradeInLines: updatedTblTradeInLines,
          };
        }
        return item;
      });
    });
  };

  const handleDeleteLine = (id: number, index: number) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === id) {
          const updatedTblTradeInLines = item.tblTradeInLines
            ? item.tblTradeInLines.filter((_, i) => i !== index)
            : [];

          return {
            ...item,
            tblTradeInLines: updatedTblTradeInLines,
          };
        }
        return item;
      });
    });
  };

  const handleAddLine = (headerId: number) => {
    setDataTradeInHeader((prevData) => {
      return prevData.map((item) => {
        if (item.id === headerId) {
          // Kiểm tra xem tblTradeInLines đã được khởi tạo chưa
          const tblTradeInLines = item.tblTradeInLines
            ? [...item.tblTradeInLines]
            : [];

          // Thêm một phần tử mới vào tblTradeInLines
          tblTradeInLines.push({
            id: 0,
            tradeInHeaderId: headerId,
            description: "",
            orderNumber: 0,
            measure: "P",
            amount: 0,
            percent: 0,
          });

          return {
            ...item,
            tblTradeInLines: tblTradeInLines,
          };
        }
        return item;
      });
    });
  };

  useEffect(() => {
    function flattenData(data: TradeInProductCat[], level = 1) {
      return data.flatMap((cat) => {
        const label =
          "-".repeat(level) + " " + `[${cat.categoryCode}] ` + cat.categoryName;
        const result: ComboboxItem[] = [{ value: cat.id.toString(), label }];
        if (
          cat.tradeInProductCatChilds &&
          cat.tradeInProductCatChilds.length > 0
        ) {
          result.push(...flattenData(cat.tradeInProductCatChilds, level + 1));
        }
        return result;
      });
    }

    if (dataParent && dataParent.length > 0) {
      const dataOption = flattenData(dataParent);
      setParentOption(dataOption);
    }
  }, [dataParent]);

  useEffect(() => {
    const getListHeader = async () => {
      const dataApi = await getListTradeInHeader(`?CatId=${id}`);
      if (dataApi && dataApi.data.length > 0) {
        setDataTradeInHeader((prevData) => {
          const newData = dataApi.data.map((item: TblTradeInHeader) => {
            const { tblTradeInLineModels, ...restData } = item;
            return {
              ...restData,
              tblTradeInLines: tblTradeInLineModels,
            };
          });

          return newData;
        });
      }
    };

    const callApiGetDataCategory = async () => {
      let urlCreate = `?id=${id}`;
      let callapi = await modifyMegaMenuGet(urlCreate);
      if (!isNullOrUndefined(callapi) && !isNullOrUndefined(callapi?.data)) {
        const dataApi = callapi?.data;
        if (dataApi != null && !isNullOrUndefined(dataApi)) {
          form.setValues(dataApi);
        }
      }
    };

    if (id) {
      getListHeader();
      callApiGetDataCategory();
    }
  }, [id]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        mx="auto"
        onSubmit={form.onSubmit((e: TblCategoryModel) => {
          handleCreateCategory(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label="Tên danh mục: "
            placeholder="Tên danh mục..."
            withAsterisk
            {...form.getInputProps("categoryName")}
          />
          <TextInput
            label="Mã danh mục: "
            placeholder="Mã danh mục..."
            withAsterisk
            {...form.getInputProps("categoryCode")}
          />
        </Group>

        <Group grow wrap="nowrap" gap={"lg"}>
          <Select
            mt={"lg"}
            label="Là danh mục con của: "
            placeholder="Chọn danh mục cha..."
            data={parentOption}
            searchable
            clearable
            nothingFoundMessage="Không có dữ liệu"
            {...form.getInputProps("idParent")}
            value={form.values.idParent?.toString()}
            mb={"lg"}
          />
          {/* <Select
            label={"Trạng thái"}
            placeholder={"Nhập trạng thái"}
            withAsterisk
            mt="md"
            data={[
              { value: "I", label: "Ẩn" },
              { value: "A", label: "Hiện" },
            ]}
            {...form.getInputProps("status")}
          /> */}
        </Group>

        <Text fw={700} mb={"lg"}>
          Cài đặt chung cho các sản phẩm thu mua/chuyển đổi trong nhóm này
        </Text>
        <Flex justify={"flex-end"} mb={5}>
          <Button
            variant="outline"
            onClick={handleAddHeader}
            leftSection={<IconPlus size={16} />}
          >
            Thêm mới nhóm
          </Button>
        </Flex>

        <EuiBasicTable
          tableCaption="Demo of EuiDataGrid with selection"
          items={dataTradeInHeader}
          itemId="id"
          noItemsMessage={"Không có dữ liệu"}
          columns={columns}
          isSelectable={true}
          hasActions={true}
          responsive={true}
          compressed={true}
          style={{ width: 1600 }}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default EditView;
