import { LoadingOverlay, Tabs } from "@mantine/core";
import { TblConfigWebBanner } from "../../../model/TblConfigWeb";
import ConfigBannerBgWebsite from "./ConfigBannerBgWebsite";
import ConfigBannerHeader from "./ConfigBannerHeader";
import ConfigBannerOtherInformation from "./ConfigBannerOtherInformation";
import ConfigBannerPopUp from "./ConfigBannerPopUp";

const ConfigWebBanner = ({
  dataBanner,
  handelChangeConfigWebBanner,
}: ConfigWebBannerProps) => {
  const handelChangeConfigWebBannerTabs = (dataSubmit: TblConfigWebBanner) => {
    handelChangeConfigWebBanner(dataSubmit);
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
          <Tabs.Tab value="info1">Phần header</Tabs.Tab>
          <Tabs.Tab value="info2">Banner Pop-Up</Tabs.Tab>
          <Tabs.Tab value="info3">Hình nền website</Tabs.Tab>
          <Tabs.Tab value="info4">Thông tin khác</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="info1">
          <ConfigBannerHeader
            dataBanner={dataBanner}
            handelChangeConfigWebBannerTabs={handelChangeConfigWebBannerTabs}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info2">
          <ConfigBannerPopUp
            dataBanner={dataBanner}
            handelChangeConfigWebBannerTabs={handelChangeConfigWebBannerTabs}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info3">
          <ConfigBannerBgWebsite
            dataBanner={dataBanner}
            handelChangeConfigWebBannerTabs={handelChangeConfigWebBannerTabs}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info4">
          <ConfigBannerOtherInformation
            dataBanner={dataBanner}
            handelChangeConfigWebBannerTabs={handelChangeConfigWebBannerTabs}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default ConfigWebBanner;

type ConfigWebBannerProps = {
  dataBanner: TblConfigWebBanner | null;
  handelChangeConfigWebBanner: (value: TblConfigWebBanner) => void;
};
