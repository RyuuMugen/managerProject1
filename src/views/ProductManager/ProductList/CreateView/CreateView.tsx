import { Button, Group, LoadingOverlay, Tabs } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import ItemCategoryCommand from "./ItemCategoryCommand";
import ItemCommand from "./ItemCommand";
import ItemSeoCommand from "./ItemSeoCommand";
import ItemTechnicalCommonCommand from "./ItemTechnicalCommonCommand";
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
import { createItemProduct } from "../../../../api/ApiProduct";
import { modals } from "@mantine/modals";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import ItemYoutubeCommand from "./ItemYoutubeCommand";
import ItemCategoryAttrModels from "./ItemCategoryAttrModels";
import ItemImageCommand from "./ItemImageCommand";
import TagItemIds from "./TagItemIds";
import { useDisclosure } from "@mantine/hooks";
import RelatedProducts from "./RelatedProducts";
import ItemCategoryCommandNew from "./ItemCategoryCommandNew";
import ItemSeoCommandNew from "./ItemSeoCommandNew";

const CreateView = ({ onSearch, handleGoToEditAttribute }: CreateViewProps) => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataItemBase, setDataItemBase] = useState<TblItemCommand>();
  const [dataIteCategory, setDataItemCategory] = useState<
    TblItemCategoryCommand[]
  >([]);
  const [dataItemSeo, setDataItemSeo] = useState<TblItemSeoCommand[]>([]);
  const [dataItemTechnical, setDataItemTechnical] = useState<
    TblItemTechnicalCommonCommand[]
  >([]);
  const [dataItemCategoryAttrModel, setDataItemCategoryAttrModel] = useState<
    TblItemCategoryAttrModel[]
  >([]);
  const [dataItemYoutube, setDataItemYoutube] = useState<
    TblItemYoutubeCommand[]
  >([]);
  const [dataItemImage, setDataItemImage] = useState<TblItemImageCommand[]>([]);
  const [dataItemTagIds, setDataItemTagIds] = useState<tblTagItemModels[]>([]);

  const handleAddItemBase = (dataItemBase: TblItemCommand) => {
    NotificationExtension.Success("Thêm dữ liệu cơ bản thành công");
    setDataItemBase(dataItemBase);
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

  const handleAddItemTechnical = (dataItemTechnical: TblItemSeoCommand[]) => {
    NotificationExtension.Success("Thêm dữ liệu thông số kỹ thuật thành công");
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
    setDataItemYoutube(dataItemYoutobe);
  };

  const handleAddItemImage = (dataItemImage: TblItemImageCommand[]) => {
    NotificationExtension.Success("Thêm dữ liệu ảnh thành công");
    setDataItemImage(dataItemImage);
  };

  const handleAddItemTags = (dataItemTag: tblTagItemModels[]) => {
    NotificationExtension.Success("Thêm dữ liệu tag thành công");
    setDataItemTagIds(dataItemTag);
  };

  const handleCreateProduct = async () => {
    open();
    await createItemProduct({
      ...dataItemBase,
      hotStatus: "N",
      newStatus: "N",
      bestSaleStatus: "N",
      saleOffStatus: "N",
      onlineStatus: "N",
      tblItemCategoryCommands: dataIteCategory,
      tblItemSeoCommands: dataItemSeo,
      tblItemTechnicalCommonCommands: dataItemTechnical,
      tblItemCategoryAttrCommands: dataItemCategoryAttrModel,
      tblItemYoutubeCommands: dataItemYoutube,
      tblItemImageCommands: dataItemImage,
      tagItemIds: dataItemTagIds,
    });
    close();
    onSearch();
    modals.closeAll();
  };

  return (
    <div>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        style={{ position: "relative" }}
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
          <ItemCommand onAddItemBase={handleAddItemBase} />
        </Tabs.Panel>
        <Tabs.Panel value="info2">
          {/* <ItemCategoryCommand onAddItemCategory={handleAddItemCategory} /> */}
          <ItemCategoryCommandNew onAddItemCategory={handleAddItemCategory} />
        </Tabs.Panel>
        {/* <Tabs.Panel value="info3">
          <ItemSeoCommand onAddItemSeo={handleAddItemSeo} />
        <Tabs.Panel value="info3">
          <ItemSeoCommandNew onAddItemSeo={handleAddItemSeo} />
        </Tabs.Panel> */}
        <Tabs.Panel value="info4">
          <ItemTechnicalCommonCommand
            onAddItemTechnical={handleAddItemTechnical}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info5">
          <ItemCategoryAttrModels
            onAddItemCategoryAttrModels={handleAddItemCategoryAttrModels}
            handleGoToEditAttribute={handleGoToEditAttribute}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info6">
          <ItemYoutubeCommand onAddYoutobe={handleAddItemYoutobe} />
        </Tabs.Panel>
        <Tabs.Panel value="info7">
          <ItemImageCommand onAddItemImage={handleAddItemImage} />
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
          leftSection={<IconPlus size={18} />}
        >
          Thêm sản phẩm
        </Button>
        <></>
      </Group>
    </div>
  );
};

type CreateViewProps = {
  onSearch: Function;
  handleGoToEditAttribute: (idAttr: number) => void;
};

export default CreateView;
