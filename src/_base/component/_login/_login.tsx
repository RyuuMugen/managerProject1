import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  LoadingOverlay,
  Box,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LoginModel } from "../../../model/LoginModel";
import {
  isNullOrEmpty,
  isNullOrUndefined,
} from "../../extension/StringExtension";
import { AuthProvider } from "../../helper/IAuthProvider";
import { NotificationExtension } from "../../extension/NotificationExtension";
import AuthService from "../../../api/login/auth.service";

export function AuthenticationTitle() {
  //#region  state
  const entity = {
    username: "",
    password: "",
    remember: false,
  };
  const form = useForm<LoginModel>({
    initialValues: {
      ...entity,
    },

    validate: {
      username: isEmail("Vui lòng nhập Email"),
      password: hasLength(
        { min: 5, max: 100 },
        "Mật khẩu phải chưa từ 5-10 kí tự !"
      ),
    },
  });
  const navigate = useNavigate();

  const [visible, { toggle, open, close }] = useDisclosure(false);
  const [visible1, setvisible1] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const callbackParam = queryParams.get("callback");
  const [value, setValue] = useLocalStorage({ key: "token", defaultValue: "" });

  const [focused, setFocused] = useState(false);
  const floating = focused || form.values.username.length > 0 || undefined;
  const [focused2, setFocused2] = useState(false);
  const floating2 = focused2 || form.values.password.length > 0 || undefined;
  //#endregion

  //#region use
  //#region  auth
  const isAuthenticated = AuthProvider.isAuthenticated();

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setvisible1(true);
    const data = form.values;
    // const resLogin = await IAuthProvider.signin(data);
    const resLogin = await AuthProvider.signin(data);
    setvisible1(false);
    if (resLogin !== undefined && !isNullOrEmpty(resLogin.data.jwt)) {
      setValue(resLogin.data.jwt);
      navigate(callbackParam ?? "/");
    }
  };

  const fakeLogin = async (e: FormEvent) => {
    e.preventDefault();
    setvisible1(true);
    localStorage.setItem("token", "fake token");
    AuthProvider.username = "da";
    NotificationExtension.Success("Đăng nhập thành công !");
    setvisible1(false);
    navigate(callbackParam ?? "/");
  };

  const handleLogin = async (dataSubmit: LoginModel) => {
    open();
    const data = {
      ...dataSubmit,
      username: dataSubmit.username.toLocaleLowerCase(),
    };
    await AuthService.login(data).then(() => {
      navigate(callbackParam ?? "/");
    });

    localStorage.setItem("userName", dataSubmit.username);

    // const customerInfo = await getCustomerInfo();

    // if (
    //   !isNullOrUndefined(customerInfo) &&
    //   !isNullOrUndefined(customerInfo?.data)
    // ) {
    //   localStorage.setItem("userInfo", JSON.stringify(customerInfo));
    // } else localStorage.setItem("userInfo", "");
    close();
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
      onSubmit={form.onSubmit((e: LoginModel) => {
        handleLogin(e);
      })}
    >
      <LoadingOverlay
        visible={visible1}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title ta="center" className={classes.title}>
          Xin chào!
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
          />
        </div>
        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Ghi nhớ"
            onChange={(e) => {
              form.values.remember = e.target.checked;
            }}
          />
          <Anchor size="sm" onClick={() => navigate("/auth/recovery")}>
            Quên mật khẩu?
          </Anchor>
        </Group>

        <button type="submit" className={classes.button}>
          Đăng nhập
        </button>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Bạn không có tài khoản?{" "}
          <Anchor
            onClick={() => navigate("/auth/register")}
            size="sm"
            underline="hover"
          >
            Tạo mới tài khoản
          </Anchor>
        </Text>
      </Paper>
    </Box>
  );
}
