import { Button, Group, LoadingOverlay, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../../_base/extension/StringExtension";
import {
  getDataDetailProduct,
  modifyItemProduct,
} from "../../../../api/ApiProduct";
import {
  TblItemCategoryAttrModel,
  TblItemCategoryCommand,
  TblItemCommand,
  TblItemImageCommand,
  TblItemSeoCommand,
  TblItemTechnicalCommonCommand,
  TblItemYoutubeCommand,
  tblTagItemModels,
} from "../../../../model/ProductList";
import RelatedProducts from "../CreateView/RelatedProducts";
import ItemCategoryAttrModels from "./ItemCategoryAttrModels";
import ItemCategoryCommand from "./ItemCategoryCommand";
import ItemCommand from "./ItemCommand";
import ItemImageCommand from "./ItemImageCommand";
import ItemSeoCommand from "./ItemSeoCommand";
import ItemTechnicalCommonCommand from "./ItemTechnicalCommonCommand";
import ItemYoutobeComman from "./ItemYoutobeComman";
import TagItemIds from "./TagItemIds";
import ItemCategoryCommandNew from "./ItemCategoryCommandNew";
import ItemSeoCommandNew from "./ItemSeoCommandNew";

const EditView = ({
  onSearch,
  id,
  handleGoToEditAttribute,
}: CreateViewProps) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [data, setData] = useState<any>();
  const [dataItemCommand, setDataItemCommand] = useState<TblItemCommand | null>(
    null
  );
  const [dataItemCategory, setDataItemCategory] =
    useState<TblItemCategoryCommand[]>();
  const [dataItemSeo, setDataItemSeo] = useState<TblItemSeoCommand[]>();
  const [dataItemTechnical, setDataItemTechnical] =
    useState<TblItemTechnicalCommonCommand[]>();
  const [dataItemCategoryAttrModel, setDataItemCategoryAttrModel] =
    useState<TblItemCategoryAttrModel[]>();
  const [dataItemYoutobe, setDataItemYoutobe] =
    useState<TblItemYoutubeCommand[]>();
  const [dataItemImage, setDataItemImage] = useState<TblItemImageCommand[]>();
  const [dataItemTagIds, setDataItemTagIds] = useState<tblTagItemModels[]>([]);
  const [isImageChange, setIsImageChange] = useState<boolean[]>([]);
  const [isItemImageChange, setIsItemImageChange] = useState(false);

  const handleAddItemBase = (dataItemBase: TblItemCommand) => {
    NotificationExtension.Success("Thêm dữ liệu cơ bản thành công");
    setDataItemCommand(dataItemBase);
  };

  const handleAddItemCategory = (
    dataItemCategory: TblItemCategoryCommand[]
  ) => {
    NotificationExtension.Success("Thêm dữ liệu danh mục thành công");
    setDataItemCategory(dataItemCategory);
  };

  const handleAddItemSeo = (dataItemSeo: TblItemSeoCommand[]) => {
    NotificationExtension.Success("Thêm dữ liệu danh mục SEO thành công");
    setDataItemSeo(dataItemSeo);
  };

  const handleAddItemTechnical = (
    dataItemTechnical: TblItemTechnicalCommonCommand[]
  ) => {
    NotificationExtension.Success("Thêm dữ thông số kỹ thuật thành công");
    setDataItemTechnical(dataItemTechnical);
  };

  const handleAddItemCategoryAttrModels = (
    dataItemCategoryAttrModel: TblItemCategoryAttrModel[]
  ) => {
    NotificationExtension.Success("Thêm dữ liệu thuộc tính thành công");
    setDataItemCategoryAttrModel(dataItemCategoryAttrModel);
  };

  const handleAddItemYoutobe = (dataItemYoutobe: TblItemYoutubeCommand[]) => {
    NotificationExtension.Success("Thêm dữ liệu Youtube thành công");
    setDataItemYoutobe(dataItemYoutobe);
  };

  const handleAddItemImage = (
    dataItemImage: TblItemImageCommand[],
    isImageChange: boolean[]
  ) => {
    NotificationExtension.Success("Thêm dữ liệu ảnh thành công");
    setIsImageChange(isImageChange);
    setIsItemImageChange(true);
    setDataItemImage(dataItemImage);
  };

  const handleAddItemTags = (dataItemTag: tblTagItemModels[]) => {
    NotificationExtension.Success("Thêm dữ liệu tag thành công");
    setDataItemTagIds(dataItemTag);
  };

  const handleCreateProduct = async () => {
    open();
    let dataImage: any = {};
    if (isItemImageChange) {
      dataImage = dataItemImage?.map((item, index) => {
        const { image, ...restGroup } = item;
        return isImageChange[index] ? item : restGroup;
      });
    } else {
      dataImage = dataItemImage?.map((item) => {
        const { image, ...restGroup } = item;
        return restGroup;
      });
    }

    await modifyItemProduct({
      ...dataItemCommand,
      tblItemCategoryCommands: dataItemCategory,
      tblItemSeoCommands: dataItemSeo,
      tblItemCategoryAttrCommands: dataItemCategoryAttrModel,
      tblItemTechnicalCommonCommands: dataItemTechnical,
      tblItemYoutubeCommands: dataItemYoutobe,
      tblItemImageCommands: dataImage,
      tagItemIds: dataItemTagIds,
    });
    close();
    onSearch();
    modals.closeAll();
  };

  const removeSpecificKeys = (obj: any, keysToRemove: string[]) => {
    const result: any = {};
    for (const key in obj) {
      if (!keysToRemove.includes(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  };

  // Các key cần loại bỏ
  const keysToRemove = [
    "tblItemSeoModels",
    "tblItemCategoryModels",
    "tblItemImageModels",
    "tblItemCategoryAttrModels",
    "tblItemYoutubeModels",
    "tblItemTechnicalCommonModels",
    "tblTagItemModels",
  ];

  const callApiGetData = async () => {
    open();
    const callApi = await getDataDetailProduct(`?id=${id}`);
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setData(dataApi);
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
        modals.closeAll();
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  useEffect(() => {
    callApiGetData();
  }, [id]);

  useEffect(() => {
    open();
    if (data) {
      // lọc lấy giá trị chỉ riêng cho tab cơ bản
      const dataItemCommand = removeSpecificKeys(data, keysToRemove);
      setDataItemCommand(dataItemCommand);
      //set giá trị cho tab danh muc
      setDataItemSeo(data?.tblItemSeoModels);
      setDataItemCategory(data?.tblItemCategoryModels);
      setDataItemCategoryAttrModel(data?.tblItemCategoryAttrModels);
      setDataItemTechnical(data?.tblItemTechnicalCommonModels);
      setDataItemYoutobe(data?.tblItemYoutubeModels);
      setDataItemImage(data?.tblItemImageModels);
      setDataItemTagIds(data?.tblTagItemModels);
    }
    close();
  }, [data]);

  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Tabs defaultValue="info1" style={{ position: "relative" }}>
        <Tabs.List
          style={{
            position: "sticky",
            top: 52,
            zIndex: 1,
            backgroundColor: "white",
          }}
        >
          <Tabs.Tab value="info1">Cơ bản</Tabs.Tab>
          <Tabs.Tab value="info2">Danh mục</Tabs.Tab>
          {/* <Tabs.Tab value="info3">Danh mục cho SEO</Tabs.Tab> */}
          <Tabs.Tab value="info4">Nhóm thông số kỹ thuật</Tabs.Tab>
          <Tabs.Tab value="info5">Bộ lọc thuộc tính</Tabs.Tab>
          <Tabs.Tab value="info6">Youtube</Tabs.Tab>
          <Tabs.Tab value="info7">Ảnh sản phẩm</Tabs.Tab>
          <Tabs.Tab value="info8">Tags</Tabs.Tab>
          <Tabs.Tab value="info9">Sản phẩm liên quan</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="info1">
          <ItemCommand
            onAddItemBase={handleAddItemBase}
            dataItemCommand={dataItemCommand || null}
            setDataItemCommand={setDataItemCommand}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info2">
          {/* <ItemCategoryCommand
            onAddItemCategory={handleAddItemCategory}
            dataItemCategory={dataItemCategory || null}
          /> */}
          <ItemCategoryCommandNew
            onAddItemCategory={handleAddItemCategory}
            dataItemCategory={dataItemCategory || null}
          />
        </Tabs.Panel>
        {/* <Tabs.Panel value="info3">
          <ItemSeoCommand
            onAddItemSeo={handleAddItemSeo}
            dataItemSeoCommand={dataItemSeo || null}
          />
          <ItemSeoCommandNew
            onAddItemSeo={handleAddItemSeo}
            dataItemSeoCommand={dataItemSeo || null}
          />
        </Tabs.Panel> */}
        <Tabs.Panel value="info4">
          <ItemTechnicalCommonCommand
            dataItemTechnical={dataItemTechnical || null}
            onAddItemTechnical={handleAddItemTechnical}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info5">
          <ItemCategoryAttrModels
            dataItemCategory={dataItemCategory || null}
            dataItemCategoryAttrModel={dataItemCategoryAttrModel || null}
            onAddItemCategoryAttrModels={handleAddItemCategoryAttrModels}
            handleGoToEditAttribute={handleGoToEditAttribute}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info6">
          <ItemYoutobeComman
            onAddYoutobe={handleAddItemYoutobe}
            dataYoutube={dataItemYoutobe || null}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info7">
          <ItemImageCommand
            dataItemImage={dataItemImage || null}
            onAddItemImage={handleAddItemImage}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info8">
          <TagItemIds
            dataItemTagIds={dataItemTagIds || null}
            onAddItemTagIds={handleAddItemTags}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info9">
          <RelatedProducts />
        </Tabs.Panel>
      </Tabs>
      <Group
        justify="center"
        mt="lg"
        p="10px 0"
        style={{ position: "sticky", bottom: 0, backgroundColor: "white" }}
      >
        <Button
          type="button"
          color="#3598dc"
          loading={visible}
          onClick={handleCreateProduct}
          leftSection={<IconEdit size={18} />}
        >
          Sửa sản phẩm
        </Button>
        <></>
      </Group>
    </div>
  );
};

type CreateViewProps = {
  onSearch: Function;
  id: number;
  handleGoToEditAttribute: (idAttr: number) => void;
};

export default EditView;
