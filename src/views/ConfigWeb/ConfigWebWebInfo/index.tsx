import { Box, Button, Group, Text, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { TblConfigWebWebInfo } from "../../../model/TblConfigWeb";
import QuillEditor from "../../../common/QuillEditor";
import { IconEdit } from "@tabler/icons-react";

const ConfigWebWebInfo = ({
  dataWebInfo,
  handelChangeConfigWebWebInfo,
}: ConfigWebWebInfoProps) => {
  const [modal, setModel] = useState("");
  const entity: TblConfigWebWebInfo = {
    saleEmail: null,
    careEmail: null,
    websiteName: null,
    metaTitle: null,
    metaKeyword: null,
    metaDescription: null,
    imgUrl: null,
    content: null,
    descritpion: null,
    contact: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
  };

  const form = useForm<TblConfigWebWebInfo>({
    initialValues: {
      ...entity,
    },

    validate: {},
  });

  useEffect(() => {
    if (dataWebInfo) form.setValues(dataWebInfo);
  }, [dataWebInfo]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx={"sm"}
      mb={"md"}
      onSubmit={form.onSubmit((e: TblConfigWebWebInfo) => {
        handelChangeConfigWebWebInfo(e);
      })}
    >
      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <TextInput
          label={"Email bán hàng"}
          placeholder={"Nhập email"}
          withAsterisk
          type="text"
          {...form.getInputProps("saleEmail")}
        />
        <Text size="sm" mt={"lg"}>
          Dùng nhận đơn hàng mới và gửi thông báo khách hàng về đơn hàng ({" "}
          <Text size="sm" color="red" span>
            Nếu nhiều email thì để cách nhau dấu phẩy ,
          </Text>{" "}
          )
        </Text>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <TextInput
          label={"Email chăm sóc khách hàng"}
          placeholder={"Nhập email"}
          withAsterisk
          type="text"
          {...form.getInputProps("careEmail")}
        />
        <Text size="sm" mt={"lg"}>
          Dùng gửi thư chào mừng khách hàng mới, gửi bản tin, nhận ý kiến phản
          hồi ({" "}
          <Text size="sm" color="red" span>
            Nếu nhiều email thì để cách nhau dấu phẩy ,
          </Text>{" "}
          )
        </Text>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <TextInput
          label={"Tên gọi website"}
          placeholder={"Nhập tên"}
          withAsterisk
          type="text"
          {...form.getInputProps("websiteName")}
        />
        <Text size="sm" mt={"lg"}>
          V.d.{" "}
          <Text size="sm" color="red" span>
            Shop Thời trang Hạng Nguyên
          </Text>{" "}
        </Text>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <TextInput
          label={"Thẻ Meta Title"}
          placeholder={"Nhập tên"}
          withAsterisk
          type="text"
          {...form.getInputProps("metaTitle")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <TextInput
          label={"Thẻ Meta Keyword"}
          placeholder={"Nhập keyword"}
          withAsterisk
          type="text"
          {...form.getInputProps("metaKeyword")}
        />
        <></>
      </Group>

      <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
        <Textarea
          label={"Thẻ Meta Description"}
          placeholder={"Nhập mô tả"}
          withAsterisk
          autosize
          minRows={4}
          {...form.getInputProps("metaDescription")}
        />
        <></>
      </Group>

      <QuillEditor
        description={form.values.content || ""}
        label="Thông tin giới thiệu chi tiết"
        toolbarId="content"
        setValue={setModel}
        onChangeValue={(html: string) => (form.values.content = html)}
      />

      <QuillEditor
        description={form.values.contact || ""}
        label="Thông tin liên hệ"
        toolbarId="contact"
        setValue={setModel}
        onChangeValue={(html: string) => (form.values.contact = html)}
      />

      <Group justify="start" mt="md">
        <Button
          type="submit"
          color="#3598dc"
          leftSection={<IconEdit size={18} />}
        >
          Cập nhật
        </Button>
        <></>
      </Group>
    </Box>
  );
};

export default ConfigWebWebInfo;

type ConfigWebWebInfoProps = {
  dataWebInfo: TblConfigWebWebInfo | null;
  handelChangeConfigWebWebInfo: (value: TblConfigWebWebInfo) => void;
};
