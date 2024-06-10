import { LoadingOverlay, Tabs } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../_base/extension/StringExtension";
import { getDataConfigWeb, modifyConfigWeb } from "../../api/ApiConfigWeb";
import {
  TblConfigWeb,
  TblConfigWebBanIP,
  TblConfigWebBanner,
  TblConfigWebDomain,
  TblConfigWebPage,
  TblConfigWebStore,
  TblConfigWebWebInfo,
} from "../../model/TblConfigWeb";
import ConfigWebBanIp from "./ConfigWebBanIp";
import ConfigWebBanner from "./ConfigWebBanner";
import ConfigWebDomain from "./ConfigWebDomain";
import ConfigWebPage from "./ConfigWebPage";
import ConfigWebStore from "./ConfigWebStore/HomeView";
import ConfigWebWebInfo from "./ConfigWebWebInfo";

const ConfigWeb = () => {
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [data, setData] = useState<TblConfigWeb>();
  const [dataDomain, setDataDomain] = useState<TblConfigWebDomain>();
  const [isDataDomain, setIsDataDomain] = useState(false);
  const [dataStore, setDataStore] = useState<TblConfigWebStore[]>();
  const [isDataStoreChanged, setIsDataStoreChanged] = useState(false);
  const [dataBanner, setDataBanner] = useState<TblConfigWebBanner>();
  const [isDataBannerChanged, setIsDataBannerChanged] = useState(false);
  const [dataPage, setDataPage] = useState<TblConfigWebPage>();
  const [isDataPageChanged, setIsDataPageChanged] = useState(false);
  const [dataBanIP, setDataBanIP] = useState<TblConfigWebBanIP>();
  const [dataWebInfo, setDataWebInfo] = useState<TblConfigWebWebInfo>();
  const [isDataWebInfoChanged, setIsDataWebInfoChanged] = useState(false);

  const handelChangeConfigWebBanIP = (value: string) => {
    setDataBanIP((prevState) => ({
      ...(prevState as TblConfigWebBanIP),
      ipAddress: value,
    }));
  };

  const handelChangeConfigWebDomain = (dataSubmit: TblConfigWebDomain) => {
    setDataDomain(dataSubmit);
    setIsDataDomain(true);
  };

  const handelChangeConfigWebStore = (dataSubmit: TblConfigWebStore[]) => {
    setDataStore(dataSubmit);
    setIsDataStoreChanged(true);
  };

  const handelChangeConfigWebBanner = (dataSubmit: TblConfigWebBanner) => {
    setDataBanner(dataSubmit);
    setIsDataBannerChanged(true);
  };

  const handelChangeConfigWebPage = (dataSubmit: TblConfigWebPage) => {
    setDataPage(dataSubmit);
    setIsDataPageChanged(true);
  };

  const handelChangeConfigWebWebInfo = (dataSubmit: TblConfigWebWebInfo) => {
    setDataWebInfo(dataSubmit);
    setIsDataWebInfoChanged(true);
  };

  const handleEditConfigWeb = async () => {
    open();
    if (data)
      if (isDataBannerChanged) {
        await modifyConfigWeb({
          ...data,
          domain: dataDomain,
          store: dataStore,
          banner: dataBanner,
          page: dataPage,
          banIP: dataBanIP,
          webInfo: dataWebInfo,
        });
        callApiGetData();
      } else {
        if (dataBanner) {
          const {
            wallpaperImgUrl,
            logoUrl,
            headerImgUrl,
            bannerImgUrl,
            faviconUrl,
            sitemapUrl,
            robotUrl,
            ...restGroup
          } = dataBanner;

          await modifyConfigWeb({
            ...data,
            domain: dataDomain,
            store: dataStore,
            banner: restGroup,
            page: dataPage,
            banIP: dataBanIP,
            webInfo: dataWebInfo,
          });
        } else
          await modifyConfigWeb({
            ...data,
            domain: dataDomain,
            store: dataStore,
            banner: dataBanner,
            page: dataPage,
            banIP: dataBanIP,
            webInfo: dataWebInfo,
          });
        callApiGetData();
      }
    close();
  };

  const callApiGetData = async () => {
    open();
    const callApi = await getDataConfigWeb();
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        setData(dataApi);
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
    }
  };

  useEffect(() => {
    callApiGetData();
  }, []);

  useEffect(() => {
    if (
      isDataStoreChanged ||
      isDataPageChanged ||
      isDataWebInfoChanged ||
      isDataBannerChanged ||
      isDataDomain
    ) {
      handleEditConfigWeb();
      setIsDataStoreChanged(false);
      setIsDataPageChanged(false);
      setIsDataWebInfoChanged(false);
      setIsDataBannerChanged(false);
      setIsDataDomain(false);
    }
  }, [
    isDataStoreChanged,
    isDataPageChanged,
    isDataWebInfoChanged,
    isDataBannerChanged,
    isDataDomain,
  ]);

  useEffect(() => {
    if (data) {
      setDataDomain(data?.domain);
      setDataStore(data?.store);
      setDataBanner(data?.banner);
      setDataPage(data?.page);
      setDataBanIP(data?.banIP);
      setDataWebInfo(data?.webInfo);
    }
  }, [data]);

  return (
    <>
      <Tabs defaultValue="info1">
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Tabs.List>
          <Tabs.Tab value="info1">Domain</Tabs.Tab>
          <Tabs.Tab value="info2">Địa chỉ cửa hàng</Tabs.Tab>
          <Tabs.Tab value="info3">Tuỳ chỉnh giao diện</Tabs.Tab>
          <Tabs.Tab value="info4">Cài đặt hiển thị</Tabs.Tab>
          <Tabs.Tab value="info5">Chặn Ip truy cập website</Tabs.Tab>
          <Tabs.Tab value="info6">Thông tin Web</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="info1">
          <ConfigWebDomain
            dataDomain={dataDomain || null}
            handelChangeConfigWebDomain={handelChangeConfigWebDomain}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info2">
          <ConfigWebStore
            dataStore={dataStore || null}
            handelChangeConfigWebStore={handelChangeConfigWebStore}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info3">
          <ConfigWebBanner
            dataBanner={dataBanner || null}
            handelChangeConfigWebBanner={handelChangeConfigWebBanner}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info4">
          <ConfigWebPage
            dataPage={dataPage || null}
            handelChangeConfigWebPage={handelChangeConfigWebPage}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info5">
          <ConfigWebBanIp
            dataBanIP={dataBanIP || null}
            handelChangeConfigWebBanIP={handelChangeConfigWebBanIP}
            handleEditConfigWeb={handleEditConfigWeb}
          />
        </Tabs.Panel>
        <Tabs.Panel value="info6">
          <ConfigWebWebInfo
            dataWebInfo={dataWebInfo || null}
            handelChangeConfigWebWebInfo={handelChangeConfigWebWebInfo}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default ConfigWeb;
