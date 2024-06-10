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
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../../api/login/auth.service";
import { Register } from "../../../model/LoginModel";
import { AuthProvider } from "../../helper/IAuthProvider";
import classes from "./AuthenticationRegister.module.css";

export function AuthenticationRegister() {
  //#region  state
  const entity = {
    username: "",
    password: "",
    confirmPassword: "",
  };
  const form = useForm<Register>({
    initialValues: {
      ...entity,
    },

    validate: {
      username: isEmail("Vui lòng nhập Email"),
      password: hasLength(
        { min: 5, max: 100 },
        "Mật khẩu phải chưa từ 5-10 kí tự !"
      ),
      confirmPassword: (value) => {
        return value !== password ? "Xác nhận mật khẩu không chính xác" : null;
      },
    },
  });

  const navigate = useNavigate();

  const [visible, { toggle, open, close }] = useDisclosure(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const callbackParam = queryParams.get("callback");
  const isAuthenticated = AuthProvider.isAuthenticated();
  const [password, setPassword] = useState("");

  const [focused, setFocused] = useState(false);
  const floating = focused || form.values.username.length > 0 || undefined;
  const [focused2, setFocused2] = useState(false);
  const floating2 = focused2 || form.values.password.length > 0 || undefined;
  const [focused3, setFocused3] = useState(false);
  const floating3 =
    focused3 || form.values.confirmPassword.length > 0 || undefined;
  //#endregion
  const handleRegister = async (dataSubmit: Register) => {
    open();
    const data = {
      ...dataSubmit,
      username: dataSubmit.username.toLocaleLowerCase(),
    };
    await AuthService.register(data);
    close();
    navigate("/auth/login");
  };

  const handleChangePassword = (password: string) => {
    setPassword(password);
    form.getInputProps("password").onChange(password);
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
      onSubmit={form.onSubmit((e: Register) => {
        handleRegister(e);
      })}
    >
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Paper withBorder shadow="md" p={30} radius="md">
        <Title ta="center" className={classes.title}>
          Chào mừng bạn đến trang đăng ký!
        </Title>

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
        <div className={classes.inputBox}>
          <PasswordInput
            label="Mật khẩu"
            labelProps={{ "data-floating": floating2 }}
            withAsterisk
            mt="md"
            classNames={{
              root: classes.root,
              input:
                form.values.password !== "" ? classes.input2 : classes.input,
              label: classes.label,
            }}
            onFocus={() => setFocused2(true)}
            onBlur={() => setFocused2(false)}
            {...form.getInputProps("password")}
            onChange={(e) => handleChangePassword(e.target.value)}
          />
        </div>
        <div className={classes.inputBox}>
          <PasswordInput
            label="Nhập lại mật khẩu"
            labelProps={{ "data-floating": floating3 }}
            withAsterisk
            mt="md"
            classNames={{
              root: classes.root,
              input:
                form.values.confirmPassword !== ""
                  ? classes.input2
                  : classes.input,
              label: classes.label,
            }}
            onFocus={() => setFocused3(true)}
            onBlur={() => setFocused3(false)}
            {...form.getInputProps("confirmPassword")}
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
