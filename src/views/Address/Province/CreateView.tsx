import { Box, Button, Group, LoadingOverlay, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { createDataProvince } from "../../../api/ApiAddress";

const CreateView = ({ onSearch }: any) => {
  const entity = {
    provinceCode: "",
    provinceName: "",
  };

  const handleCreateProvince = async (dataSubmit: DataProvince) => {
    open();
    await createDataProvince(dataSubmit);
    close();
    modals.closeAll();
    onSearch();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<DataProvince>({
    initialValues: {
      ...entity,
    },

    validate: {
      provinceName: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Tên Tỉnh/Thành phố chưa nhập"
          : !/^[a-zA-Z\sàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ]+$/u.test(
              value
            )
          ? "Tên Tỉnh/Thành phố không được chứa ký tự đặc biệt."
          : /\d/.test(value)
          ? "Tên Tỉnh/Thành phố không được chứa số."
          : undefined;
      },
      provinceCode: isNotEmpty("Mã Tỉnh/Thành phố chưa nhập"),
    },
  });

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: DataProvince) => {
          handleCreateProvince(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên Tỉnh/Thành phố"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("provinceName")}
          />

          <TextInput
            label={"Mã Tỉnh/Thành phố"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("provinceCode")}
          />
        </Group>

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

type DataProvince = {
  provinceCode: string;
  provinceName: string;
};

export default CreateView;
