import React, { createContext, useContext, useEffect, useState } from "react";
import {
  EuiBreadcrumb,
  EuiButton,
  EuiButtonEmpty,
  EuiHeaderBreadcrumbs,
  EuiHeaderLink,
  EuiHorizontalRule,
  EuiIcon,
} from "@elastic/eui";
import {
  Link,
  NavigateFunction,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom";
import { Divider, Group } from "@mantine/core";
import { isNullOrEmpty } from "../../extension/StringExtension";
import { SelectListItem } from "../../../model/SelectListItem";

const BreadCrumb = () => {
  const navigate = useNavigate();
  //
  const location = useLocation();
  const currentPath = location.pathname;
  const [isLoadingButon, setisLoadingButon] = useState(true);
  const listPathIgnoreBreadcrumbs = ["/"];
  const [isIgnoreBreadcrumbs, setIgnoreBreadcrumbs] = useState(false);

  //
  useEffect(() => {
    if (
      !isNullOrEmpty(location.pathname) &&
      listPathIgnoreBreadcrumbs.includes(location.pathname)
    ) {
      setIgnoreBreadcrumbs(true);
    } else setIgnoreBreadcrumbs(false);
  }, [location.pathname]);

  function Breadcrumbs() {
    let matches = useMatches();
    const breadcrumbsData: EuiBreadcrumb[] = [];
    breadcrumbsData.push({
      text: "Trang chủ",
      onClick: (e) => {
        navigate("/");
      },
      className: "customClass",
    });
    let crumbs = matches
      .filter((match: any) => Boolean(match.handle?.crumb))
      .map((match: any) => match.handle.crumb(match.data));
    let url = "";
    for (let index = 0; index < crumbs.length; index++) {
      const element: SelectListItem = crumbs[index];
      if (element && !isNullOrEmpty(element.Text) && element.Value !== "/") {
        url = url + element.Value;
        if (index !== crumbs.length - 1) {
          if (!element.Disabled)
            breadcrumbsData.push({
              text: element.Text,
              onClick: (e) => {
                navigate(url);
              },
              className: "customClass",
            });
          else
            breadcrumbsData.push({
              text: element.Text,
              className: "customClass",
            });
        } else
          breadcrumbsData.push({
            text: element.Text,
            className: "customClass",
          });
      }
    }
    return breadcrumbsData;
  }

  return (
    <>
      <Group m={0}>
        <EuiHeaderBreadcrumbs
          className="brecrum-header-layout"
          aria-label="Header breadcrumbs example"
          breadcrumbs={Breadcrumbs()}
        />

        <EuiButtonEmpty
          iconType="arrowLeft"
          flush="both"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </EuiButtonEmpty>
      </Group>
      <Divider my="xs" label="Chức năng" labelPosition="center" />
    </>
  );
};

export default BreadCrumb;
