import {
  Anchor,
  Box,
  Button,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { PasswordRecovery } from "../../..//model/LoginModel";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/login/auth.service";
import { AuthProvider } from "../../helper/IAuthProvider";
import classes from "./AuthenticationRegister.module.css";

export function SubmitPassRecovery() {
  //#region  state
  const entity = {
    username: "",
  };
  const form = useForm<PasswordRecovery>({
    initialValues: {
      ...entity,
    },

    validate: {
      username: isEmail("Vui lòng nhập Email"),
    },
  });

  const navigate = useNavigate();

  const [visible, { toggle, open, close }] = useDisclosure(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const callbackParam = queryParams.get("callback");
  const isAuthenticated = AuthProvider.isAuthenticated();

  const [focused, setFocused] = useState(false);
  const floating = focused || form.values.username.length > 0 || undefined;

  //#endregion
  const handleSubmit = async (dataSubmit: PasswordRecovery) => {
    if (form.isValid()) {
      // Nếu dữ liệu hợp lệ, gọi hàm handlePasswordRecovery
      open();
      await AuthService.PassRecovery(dataSubmit);
      close();
    }
    navigate("/auth/login");
  };

  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
      if (isAuthenticated === true) {
        navigate(callbackParam ?? "/");
      }
    };
  }, []);

  return (
    <Box
      component="form"
      maw={500}
      mx="auto"
      pt={"5%"}
      onSubmit={form.onSubmit((e: PasswordRecovery) => {
        handleSubmit(e);
      })}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Paper withBorder shadow="md" p={30} radius="md">
        <Title ta="center" className={classes.title}>
          Chào mừng bạn đến trang khôi phục mật khẩu!
        </Title>
        <Text ta={"center"} style={{ margin: 15 }}>
          Nhập email của bạn để khôi phục mật khẩu
        </Text>
        <div className={classes.inputBox}>
          <TextInput
            label="Email"
            labelProps={{ "data-floating": floating }}
            withAsterisk
            mt="md"
            classNames={{
              root: classes.root,
              input:
                form.values.username !== "" ? classes.input2 : classes.input,
              label: classes.label,
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...form.getInputProps("username")}
          />
        </div>

        <button type="submit" className={classes.button}>
          Tạo tài khoản
        </button>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Bạn đã có tài khoản?{" "}
          <Anchor
            onClick={() => navigate("/auth/login")}
            size="sm"
            underline="hover"
          >
            Đăng nhập
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
