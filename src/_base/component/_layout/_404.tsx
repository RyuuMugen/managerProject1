import React, { useContext } from "react";
import {
  EuiEmptyPrompt,
  EuiImage,
  EuiButton,
  EuiButtonEmpty,
} from "@elastic/eui";
import { Link, useNavigate } from "react-router-dom";
const PageNotFound = () => {
  // const themeContext = useContext(ThemeContext);
  // const isDarkTheme = themeContext.theme.includes('dark');
  const isDarkTheme = false;
  // const pageNotFound = isDarkTheme ? pageNotFoundDark : pageNotFoundLight;
  // const pageNotFound2x = isDarkTheme ? pageNotFoundDark2x : pageNotFoundLight2x;
  const navigate = useNavigate();
  return (
    <EuiEmptyPrompt
      color="subdued"
      icon={
        <EuiImage
          size="fullWidth"
          // srcSet={`${pageNotFound} 1x, ${pageNotFound2x} 2x`}
          src="https://eui.elastic.co/images/3debad008db0a67b9696-pageNotFound--light.png"
          alt="An outer space illustration. In the background is a large moon and two planets. In the foreground is an astronaut floating in space and the numbers '404'."
        />
      }
      title={<h2>Trang không tồn tại !</h2>}
      layout="vertical"
      body={<p>Chúng tôi không thể tìm thấy trang theo yêu cầu của bạn !</p>}
      actions={[
        <EuiButton color="primary" fill onClick={() => navigate("/")}>
          Trang chủ
        </EuiButton>,
        <EuiButtonEmpty
          iconType="arrowLeft"
          flush="both"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </EuiButtonEmpty>,
      ]}
    />
  );
};

export default PageNotFound;
