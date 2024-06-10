import { Tabs, Text, rem } from "@mantine/core";
import {
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import classes from "./categoryFeatureView.module.css";
import { EuiLink } from "@elastic/eui";

const CategoryFeatureView = function () {
  const [catId, setCatId] = useState<number>(0);
  let params = useParams();
  const catIdGet = params.cat_id;
  const location = useLocation();
  const categoryName = location.state && location.state.categoryName;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>("gallery");
  const iconStyle = { width: rem(16), height: rem(16) };
  useEffect(() => {
    if (catIdGet !== undefined && !isNaN(Number(catIdGet))) {
      setCatId(Number(catIdGet));
    } else {
      navigate(-1);
    }
  }, []);

  const formCreate = (
    <>
      <Text style={{ fontSize: 18 }}>
        Danh mục: <EuiLink>{categoryName} </EuiLink>
      </Text>
      <Tabs
        radius="md"
        value={activeTab}
        onChange={setActiveTab}
        classNames={classes}
      >
        <Tabs.List grow justify="space-between">
          <Tabs.Tab value="tab1" leftSection={<IconPhoto style={iconStyle} />}>
            Danh mục con
          </Tabs.Tab>
          <Tabs.Tab
            value="tab2"
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Thương hiệu
          </Tabs.Tab>
          <Tabs.Tab
            value="tab3"
            leftSection={<IconSettings style={iconStyle} />}
          >
            Sản phẩm bán chạy
          </Tabs.Tab>
          <Tabs.Tab
            value="tab4"
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Sản phẩm mới
          </Tabs.Tab>
          <Tabs.Tab value="tab5" leftSection={<IconPhoto style={iconStyle} />}>
            Sản phẩm HOT
          </Tabs.Tab>
          <Tabs.Tab
            value="tab6"
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Sản phẩm giảm giá
          </Tabs.Tab>
          <Tabs.Tab value="tab7" leftSection={<IconPhoto style={iconStyle} />}>
            Danh mục liên quan
          </Tabs.Tab>
          <Tabs.Tab
            value="tab8"
            leftSection={<IconMessageCircle style={iconStyle} />}
          >
            Bài viết
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tab1">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab2">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab3">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab4">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab5">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab6">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab7">{catId + Math.random()}</Tabs.Panel>
        <Tabs.Panel value="tab8">{catId + Math.random()}</Tabs.Panel>
      </Tabs>
    </>
  );

  return <>{formCreate}</>;
};

export default CategoryFeatureView;
