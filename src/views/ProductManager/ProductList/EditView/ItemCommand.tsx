import {
  Box,
  Button,
  ComboboxData,
  Group,
  LoadingOverlay,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getDataBrand } from "../../../../api/ApiSell";
import QuillEditor from "../../../../common/QuillEditor";
import { handleShowErrorValidate, validateData } from "../helper";
import { TblItemCommand } from "../../../../model/ProductList";
import { EuiLink } from "@elastic/eui";

const ItemCommand = ({
  onAddItemBase,
  dataItemCommand,
  setDataItemCommand,
}: ItemCommandProps) => {
  const [dataOptionBrand, setDataOptionBrand] = useState<ComboboxData>();
  const [isOpenUpdateTechnical, setIsOpenUpdateTechnical] = useState(false);

  const [modal, setModel] = useState("");

  const [dataListErrorValidate, setDataListErrorValidate] =
    useState<string[]>();

  const handleChangeValue = (e: any, label: string) => {
    setDataItemCommand({
      ...dataItemCommand,
      [label]: e,
    });
  };

  const handleSubmitForm = () => {
    if (
      validateData(
        dataItemCommand,
        [
          "urlCanonical",
          "itemCode",
          "itemName",
          "erpInventoryItemId",
          "marketPrice",
          "itemCost",
          "unitSellingPrice",
          "warrantyDescrition",
          "onhandQuantyty",
          "color",
          "brandId",
          "sex",
        ],
        setDataListErrorValidate
      )
    ) {
      onAddItemBase(dataItemCommand);
    }
  };

  const fetDatabrand = async () => {
    const data = await getDataBrand();
    const dataOptionBrand = data?.data?.lists?.map(
      (item: any, index: number) => {
        return { value: item?.id?.toString(), label: item?.name };
      }
    );
    setDataOptionBrand(dataOptionBrand);
  };

  useEffect(() => {
    fetDatabrand();
  }, []);

  return (
    <>
      <Box
        className="flex-none"
        miw={1200}
        maw={1200}
        mx="auto"
        style={{ position: "relative" }}
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên sản phẩm"}
            placeholder={"Tên sản phẩm"}
            required
            error={handleShowErrorValidate(
              "itemName",
              "Vui lòng nhập tên sản phẩm",
              dataListErrorValidate
            )}
            withAsterisk
            mt="md"
            type="text"
            value={dataItemCommand?.itemName || ""}
            onChange={(e) => handleChangeValue(e.target.value, "itemName")}
          />
          <TextInput
            label={"Mã sản phẩm"}
            placeholder={"Mã sản phẩm"}
            error={handleShowErrorValidate(
              "itemCode",
              "Vui lòng nhập mã sản phẩm",
              dataListErrorValidate
            )}
            withAsterisk
            mt="md"
            type="text"
            value={dataItemCommand?.itemCode || ""}
            onChange={(e) => handleChangeValue(e.target.value, "itemCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên mô tả ngắn sản phẩm"}
            placeholder={"Tên ngắn sản phẩm"}
            mt="md"
            type="text"
            value={dataItemCommand?.shortName || ""}
            onChange={(e) => handleChangeValue(e.target.value, "shortName")}
          />
          <TextInput
            label={"Tên mô tả dầy đủ sản phẩm"}
            placeholder={"Tên đầy đủ sản phẩm"}
            mt="md"
            type="text"
            value={dataItemCommand?.longName || ""}
            onChange={(e) => handleChangeValue(e.target.value, "longName")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"Giá bán"}
            placeholder={"Giá bán"}
            withAsterisk
            error={handleShowErrorValidate(
              "unitSellingPrice",
              "Vui lòng nhập giá bán",
              dataListErrorValidate
            )}
            hideControls
            mt="md"
            value={dataItemCommand?.unitSellingPrice || ""}
            onChange={(e) => handleChangeValue(e, "unitSellingPrice")}
          />
          <NumberInput
            label={"Giá thị trường"}
            error={handleShowErrorValidate(
              "marketPrice",
              "Vui lòng nhập giá trị trường",
              dataListErrorValidate
            )}
            withAsterisk
            placeholder={"Giá thị trường"}
            hideControls
            mt="md"
            value={dataItemCommand?.marketPrice || ""}
            onChange={(e) => handleChangeValue(e, "marketPrice")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"Giá vốn"}
            placeholder={"Giá vốn"}
            withAsterisk
            error={handleShowErrorValidate(
              "itemCost",
              "Vui lòng nhập giá vốn",
              dataListErrorValidate
            )}
            hideControls
            mt="md"
            value={dataItemCommand?.itemCost || ""}
            onChange={(e) => handleChangeValue(e, "itemCost")}
          />
          <Select
            label={"Đang sử dụng"}
            placeholder={"Yes/No"}
            mt="md"
            data={[
              { value: "Y", label: "Yes" },
              { value: "N", label: "No" },
            ]}
            value={dataItemCommand?.inUse || ""}
            onChange={(e) => handleChangeValue(e, "inUse")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Barcode Used"}
            placeholder={"Yes/No"}
            mt="md"
            data={[
              { value: "Y", label: "Yes" },
              { value: "N", label: "No" },
            ]}
            value={dataItemCommand?.barcodeUsed || ""}
            onChange={(e) => handleChangeValue(e, "barcodeUsed")}
          />
          <TextInput
            label={"Barcode"}
            placeholder={"Barcode"}
            mt="md"
            type="text"
            disabled={dataItemCommand?.barcodeUsed === "Y" ? false : true}
            value={dataItemCommand?.barcode || ""}
            onChange={(e) => handleChangeValue(e.target.value, "barcode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            error={handleShowErrorValidate(
              "onhandQuantyty",
              "Vui lòng nhập số sản phẩm tồn kho",
              dataListErrorValidate
            )}
            withAsterisk
            label={"Số lượng tồn kho"}
            placeholder={"Số lượng tồn kho"}
            hideControls
            mt="md"
            value={dataItemCommand?.onhandQuantyty!}
            onChange={(e) => handleChangeValue(e, "onhandQuantyty")}
          />
          <NumberInput
            withAsterisk
            error={handleShowErrorValidate(
              "erpInventoryItemId",
              "Vui lòng nhập mã ERP",
              dataListErrorValidate
            )}
            label={"Mã Item từ ERP"}
            placeholder={"Mã Item từ ERP"}
            hideControls
            mt="md"
            value={dataItemCommand?.erpInventoryItemId || ""}
            onChange={(e) => handleChangeValue(e, "erpInventoryItemId")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Thông tin bảo hành bởi đối tác"}
            placeholder={"True/False"}
            mt="md"
            data={[
              { value: "T", label: "True" },
              { value: "F", label: "False" },
            ]}
            value={dataItemCommand?.warrantyByPartner || ""}
            onChange={(e) => handleChangeValue(e, "warrantyByPartner")}
          />
          <Select
            label={"Thông tin bảo hành bởi khách"}
            placeholder={"True/False"}
            mt="md"
            data={[
              { value: "T", label: "True" },
              { value: "F", label: "False" },
            ]}
            value={dataItemCommand?.warrantyByCus || ""}
            onChange={(e) => handleChangeValue(e, "warrantyByCus")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            error={handleShowErrorValidate(
              "warrantyDescrition",
              "Vui lòng nhập thông tin bảo hành",
              dataListErrorValidate
            )}
            label={"Thông tin bảo hành"}
            placeholder={"Thông tin bảo hành"}
            withAsterisk
            mt="md"
            type="text"
            value={dataItemCommand?.warrantyDescrition || ""}
            onChange={(e) =>
              handleChangeValue(e.target.value, "warrantyDescrition")
            }
          />
          <Select
            error={handleShowErrorValidate(
              "brandId",
              "Vui lòng chọn thương hiệu",
              dataListErrorValidate
            )}
            mt={"md"}
            label="Chọn thương hiệu"
            placeholder="Thương hiệu"
            data={dataOptionBrand ? dataOptionBrand : []}
            value={dataItemCommand?.brandId?.toString() || ""}
            searchable
            withAsterisk
            onChange={(e: any) => handleChangeValue(Number(e), "brandId")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            error={handleShowErrorValidate(
              "color",
              "Vui lòng chọn màu sắc",
              dataListErrorValidate
            )}
            mt={"md"}
            label="Màu sắc"
            placeholder="Chọn màu"
            data={[
              "Red",
              "Blue",
              "Yellow",
              "Green",
              "black",
              "Purple",
              "Orange",
              "Pink",
            ]}
            value={dataItemCommand?.color || ""}
            searchable
            withAsterisk
            onChange={(e: any) => handleChangeValue(e, "color")}
          />
          <Select
            error={handleShowErrorValidate(
              "sex",
              "Vui lòng chọn giới tính",
              dataListErrorValidate
            )}
            mt={"md"}
            label="Giới tính"
            placeholder="Nam/Nữ"
            data={["Nam", "Nu"]}
            value={dataItemCommand?.sex || ""}
            searchable
            withAsterisk
            onChange={(e: any) => handleChangeValue(e, "sex")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"Giảm giá (%)"}
            placeholder={"Giảm giá (%)"}
            mt="md"
            hideControls
            value={dataItemCommand?.discountValue || ""}
            onChange={(e) => handleChangeValue(e, "discountValue")}
          />
          <TextInput
            label={"Phong cách"}
            placeholder={"Style"}
            mt="md"
            value={dataItemCommand?.style || ""}
            onChange={(e) => handleChangeValue(e.target.value, "style")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Hàng trưng bày, quảng cáo"}
            placeholder={"Yes/No"}
            mt="md"
            data={[
              { value: "Y", label: "Yes" },
              { value: "N", label: "No" },
            ]}
            value={dataItemCommand?.isPromotional || ""}
            onChange={(e) => handleChangeValue(e, "isPromotional")}
          />
          <Select
            label={"Phụ kiện đi kèm"}
            placeholder={"Yes/No"}
            mt="md"
            data={[
              { value: "Y", label: "Yes" },
              { value: "N", label: "No" },
            ]}
            value={dataItemCommand?.accessory || ""}
            onChange={(e) => handleChangeValue(e, "accessory")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"VAT"}
            placeholder={"VAT"}
            mt="md"
            hideControls
            value={dataItemCommand?.vat || ""}
            onChange={(e) => handleChangeValue(e, "vat")}
          />
          <NumberInput
            label={"Lợi nhuận"}
            placeholder={"Lợi nhuận"}
            hideControls
            mt="md"
            value={dataItemCommand?.profit || ""}
            onChange={(e) => handleChangeValue(e, "profit")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"Trọng lượng"}
            placeholder={"Trọng lượng"}
            hideControls
            mt="md"
            value={dataItemCommand?.unitWeight || ""}
            onChange={(e) => handleChangeValue(e, "unitWeight")}
          />
          <TextInput
            label={"Đơn vị trọng lượng"}
            placeholder={"Đơn vị trọng lương"}
            mt="md"
            type="text"
            value={dataItemCommand?.weightUomCode || ""}
            onChange={(e) => handleChangeValue(e.target.value, "weightUomCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"Thể tích"}
            placeholder={"Thể tích"}
            hideControls
            mt="md"
            value={dataItemCommand?.unitVolume || ""}
            onChange={(e) => handleChangeValue(e, "unitVolume")}
          />
          <TextInput
            label={"Đơn vị thể tích"}
            placeholder={"Đơn vị thể tích"}
            mt="md"
            value={dataItemCommand?.volumeUomCode || ""}
            onChange={(e) => handleChangeValue(e.target.value, "volumeUomCode")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Đơn vị tính"}
            placeholder={"Đơn vị tính"}
            mt="md"
            value={dataItemCommand?.primaryUomCode || ""}
            onChange={(e) =>
              handleChangeValue(e.target.value, "primaryUomCode")
            }
          />
          <TextInput
            label={"Đơn vị tính chính"}
            placeholder={"Đơn vị tính chính"}
            mt="md"
            value={dataItemCommand?.primaryUnitOfMeasure || ""}
            onChange={(e) =>
              handleChangeValue(e.target.value, "primaryUnitOfMeasure")
            }
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Đơn vị tính các chiều kích thước"}
            placeholder={"Đơn vị tính các chiều kích thước"}
            mt="md"
            value={dataItemCommand?.dimensionUomCode || ""}
            onChange={(e) =>
              handleChangeValue(e.target.value, "dimensionUomCode")
            }
          />
          <NumberInput
            label={"Chiều dài"}
            placeholder={"Chiều dài"}
            hideControls
            mt="md"
            value={dataItemCommand?.unitLength || ""}
            onChange={(e) => handleChangeValue(e, "unitLength")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <NumberInput
            label={"Chiều rộng"}
            placeholder={"Chiều rộng"}
            hideControls
            mt="md"
            value={dataItemCommand?.unitWidth || ""}
            onChange={(e) => handleChangeValue(e, "unitWidth")}
          />
          <NumberInput
            label={"Chiều cao"}
            placeholder={"Chiều cao"}
            hideControls
            mt="md"
            value={dataItemCommand?.unitHeight || ""}
            onChange={(e) => handleChangeValue(e, "unitHeight")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Đơn vị tính thứ 2"}
            placeholder={"Đơn vị tính thứ 2"}
            mt="md"
            value={dataItemCommand?.secondaryUomCode || ""}
            onChange={(e) =>
              handleChangeValue(e.target.value, "secondaryUomCode")
            }
          />
          <TextInput
            label={"Mục đích"}
            placeholder={"Mục đích"}
            mt="md"
            value={dataItemCommand?.purpose || ""}
            onChange={(e) => handleChangeValue(e.target.value, "purpose")}
          />
        </Group>

        <QuillEditor
          description={dataItemCommand?.description || ""}
          label="Mô tả :"
          toolbarId="toolbar"
          setValue={setModel}
          onChangeValue={(html: string) =>
            handleChangeValue(html, "description")
          }
        />

        <Box>
          <EuiLink
            onClick={() => setIsOpenUpdateTechnical(!isOpenUpdateTechnical)}
          >
            Cập nhật thông số kỹ thuật không cần thuộc tính
          </EuiLink>
          <Box>
            {isOpenUpdateTechnical && (
              <>
                <QuillEditor
                  description={dataItemCommand?.itemSpec || ""}
                  toolbarId="t1"
                  setValue={setModel}
                  onChangeValue={(html: string) =>
                    handleChangeValue(html, "itemSpec")
                  }
                />
              </>
            )}
          </Box>
        </Box>

        <Text mt={"lg"} fw={700} size="lg">
          Dùng cho SEO
        </Text>

        <TextInput
          error={handleShowErrorValidate(
            "urlCanonical",
            "Vui lòng nhập Link ảnh sản phẩm",
            dataListErrorValidate
          )}
          label={"Link ảnh sản phẩm"}
          placeholder={"Url"}
          withAsterisk
          mt="sm"
          type="text"
          value={dataItemCommand?.urlCanonical || ""}
          onChange={(e) => handleChangeValue(e.target.value, "urlCanonical")}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Meta Title"}
            placeholder={"Meta Title"}
            mt="md"
            value={dataItemCommand?.metaTitle || ""}
            onChange={(e) => handleChangeValue(e.target.value, "metaTitle")}
          />
          <TextInput
            label={"Meta Keyword"}
            placeholder={"Meta Keyword"}
            mt="md"
            value={dataItemCommand?.metaKeyword || ""}
            onChange={(e) => handleChangeValue(e.target.value, "metaKeyword")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Textarea
            label={"Meta Decription"}
            placeholder={"Meta Decription"}
            mt="md"
            value={dataItemCommand?.metaDescription || ""}
            onChange={(e) =>
              handleChangeValue(e.target.value, "metaDecription")
            }
          />
        </Group>

        <Group
          justify="flex-end"
          mt="lg"
          p="10px 0"
          style={{ position: "sticky", bottom: 49, backgroundColor: "white" }}
        >
          <Button
            type="button"
            color="#3598dc"
            onClick={(e) => {
              handleSubmitForm();
            }}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
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

type ItemCommandProps = {
  onAddItemBase: (data: any) => void;
  dataItemCommand: TblItemCommand | null;
  setDataItemCommand: Function;
};

export default ItemCommand;
