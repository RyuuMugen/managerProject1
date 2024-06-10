import React, { useEffect, useState } from "react";
import {
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiSpacer,
  EuiHeaderSectionItemButton,
  EuiIcon,
  EuiSelectableMessage,
  EuiSelectableTemplateSitewide,
  EuiImage,
  EuiFieldSearch,
} from "@elastic/eui";
import {
  Link,
  NavLink,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useNavigation,
  useResolvedPath,
} from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Group,
  Burger,
  Skeleton,
  ScrollArea,
  Text,
  Anchor,
} from "@mantine/core";
import { nprogress, NavigationProgress } from "@mantine/nprogress";
import _sideNav from "./_sideNav";
import _breadcrumb from "./_breadcrumb";
import { AuthProvider } from "../../helper/IAuthProvider";
import { Notifications } from "@mantine/notifications";
import { SkeletonBase } from "./_skeleton";
import { IconLogout, IconSwitchHorizontal } from "@tabler/icons-react";
import classes from "../../_style/NavbarSegmented.module.css";
import { _sideNavData } from "../../../_setup/navdata/_sideNavData";
import { LinksGroup } from "./NavbarLinksGroup";
import { isNullOrEmpty } from "../../extension/StringExtension";
import { searchSideNavData } from "../../helper/FunctionHelper";
import { LinksGroupProps } from "../../model/_base/LinksGroupProps";
import AuthService from "../../../api/login/auth.service";
import TokenService from "../../../api/login/token.service";
import { NotificationExtension } from "../../extension/NotificationExtension";
//context

export const Layout = () => {
  // #region state

  const location = useLocation();
  const [progress, setProgress] = useState(true);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [sideNavs, setSideNavs] = useState<LinksGroupProps[]>([]);

  //#endregion

  //#region  auth
  const listRouterIgnore = [""];
  const isAuthenticated = AuthProvider.isAuthenticated();

  //#endregion
  useEffect(() => {
    setLoadingSkeleton(false);
    //   nprogress.start()
    window.scrollTo(0, 0);
    if (
      !listRouterIgnore.includes(location.pathname) &&
      isAuthenticated === false
    ) {
      navigate("/auth/login?callback=" + location.pathname);
    } else console.log(" check auth " + location.pathname);
    setSideNavs(_sideNavData);

    return () => {
      nprogress.start();
      setLoadingSkeleton(true);
    };
  }, [location.pathname]);

  //

  // matine
  const [opened, { toggle }] = useDisclosure();
  const search = (
    <EuiSelectableTemplateSitewide
      options={[]}
      searchProps={{
        compressed: true,
      }}
      popoverButton={
        <EuiHeaderSectionItemButton flush="left" aria-label="Sitewide search">
          <EuiIcon type="search" size="m" />
        </EuiHeaderSectionItemButton>
      }
      emptyMessage={
        <EuiSelectableMessage style={{ minHeight: 300 }}>
          Danh sách kết quả tìm kiếm...
          <Link to="/">Trang chủ</Link>
        </EuiSelectableMessage>
      }
    />
  );
  const renderLogo = () => (
    <EuiImage
      margin="s"
      size="s"
      alt="" // Because this image is sufficiently described by its caption, there is no need to repeat it via alt text
      src="https://hanoicomputercdn.com/media/lib/09-08-2023/logo-hacom-since-2001.png"
    />
  );
  // search menu
  function searchDataSide(q: string) {
    if (isNullOrEmpty(q)) return setSideNavs(_sideNavData);
    return setSideNavs(searchSideNavData(sideNavs, q));
  }
  const searchModel = (
    <EuiFieldSearch
      placeholder="Tìm kiếm"
      // value={value}
      onChange={(e: any) => searchDataSide(e.target.value)}
      // isClearable={isClearable}
    />
  );
  const searchMenu = <EuiHeaderSectionItem>{searchModel}</EuiHeaderSectionItem>;
  const links = sideNavs.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));

  const handleLogout = () => {
    TokenService.removeUser();
    localStorage.setItem("userName", "");
    NotificationExtension.Success("Bạn đã đăng xuất thành công");
    navigate("/auth/login");
  };
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "md",
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <EuiHeaderSection>
              <Group h="100%" px="md">
                {/* <Burger
                  opened={mobileOpened}
                  onClick={toggleMobile}
                  hiddenFrom="md"
                  size="sm"
                /> */}
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="md"
                  size="sm"
                />
              </Group>
            </EuiHeaderSection>
            <EuiHeaderSection>
              <EuiHeaderSectionItem>{renderLogo()}</EuiHeaderSectionItem>
            </EuiHeaderSection>
            <EuiHeaderSection>
              <EuiHeaderSectionItem></EuiHeaderSectionItem>
            </EuiHeaderSection>
            <EuiSpacer size="l" />
            <EuiHeaderSection side="right">
              <EuiHeaderSectionItem>
                <Text>
                  Bạn là:{" "}
                  <Anchor underline="always">
                    {localStorage.getItem("userName")}
                  </Anchor>
                </Text>
              </EuiHeaderSectionItem>
            </EuiHeaderSection>
            <EuiHeaderSection>
              <EuiHeaderSectionItem>{search}</EuiHeaderSectionItem>
            </EuiHeaderSection>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppShell.Section>{searchMenu}</AppShell.Section>
          <AppShell.Section grow component={ScrollArea}>
            <ScrollArea className={classes.links}>
              <div className={classes.linksInner}>{links}</div>
            </ScrollArea>
          </AppShell.Section>
          <AppShell.Section>
            <a href="#" className={classes.link} onClick={handleLogout}>
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          {loadingSkeleton ? (
            <SkeletonBase visible={loadingSkeleton}></SkeletonBase>
          ) : (
            <>
              <_breadcrumb></_breadcrumb>
              <Outlet />
            </>
          )}
        </AppShell.Main>
      </AppShell>
    </>
  );
};
