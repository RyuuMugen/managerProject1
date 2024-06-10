import { LoadingOverlay, Tabs } from "@mantine/core";
import { TblConfigWebPage } from "../../../model/TblConfigWeb";
import ConfigGeneralSettings from "./ConfigGeneralSettings";
import ConfigHomePage from "./ConfigHomePage";
import ConfigProductCategory from "./ConfigProductCategory";
import ConfigProductDetails from "./ConfigProductDetails";

const ConfigWebPage = ({
  dataPage,
  handelChangeConfigWebPage,
}: ConfigWebPageProps) => {
  const handelChangeConfigWebPageTabs = (dataSubmit: TblConfigWebPage) => {
    handelChangeConfigWebPage(dataSubmit);
  };

  return (
    <>
      <Tabs
        mt={"xs"}
        mx={"xs"}
        defaultValue="info1"
        color="red"
        variant="outline"
      >
        <LoadingOverlay
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Tabs.List>
          <Tabs.Tab value="info1">Cài đặt chung</Tabs.Tab>
          <Tabs.Tab value="info2">Trang chủ</Tabs.Tab>
          <Tabs.Tab value="info3">Danh mục sản phẩm</Tabs.Tab>
          <Tabs.Tab value="info4">Chi tiết sản phẩm</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="info1">
          <ConfigGeneralSettings
            dataPage={dataPage}
            handelChangeConfigWebPageTabs={handelChangeConfigWebPageTabs}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info2">
          <ConfigHomePage
            dataPage={dataPage}
            handelChangeConfigWebPageTabs={handelChangeConfigWebPageTabs}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info3">
          <ConfigProductCategory
            dataPage={dataPage}
            handelChangeConfigWebPageTabs={handelChangeConfigWebPageTabs}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info4">
          <ConfigProductDetails
            dataPage={dataPage}
            handelChangeConfigWebPageTabs={handelChangeConfigWebPageTabs}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default ConfigWebPage;

type ConfigWebPageProps = {
  dataPage: TblConfigWebPage | null;
  handelChangeConfigWebPage: (value: TblConfigWebPage) => void;
};
