import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getDataProvice, modifyDataDistrict } from "../../../api/ApiAddress";
import Repository from "../../../_base/helper/HttpHelper";
import { useDisclosure } from "@mantine/hooks";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNotEmpty, useForm } from "@mantine/form";
import { tblDistrict, tblProvince } from "../../../model/TblAddress";

const EditView = ({ id, onSearch }: CreateViewProps) => {
  const entity = {
    districtId: 0,
    provinceCode: null,
    provinceName: null,
    provinceId: 0,
    districtCode: null,
    districtName: null,
  };
  const [dataAllProvince, setDataAllProvince] = useState<tblProvince[]>([]);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<tblDistrict>({
    initialValues: {
      ...entity,
    },

    validate: {
      provinceId: isNotEmpty("Mã Tỉnh/Huyện chưa nhập"),
      districtCode: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Mã Quận/Huyện chưa nhập"
          : undefined;
      },
      districtName: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Tên Quận/Huyện chưa nhập"
          // : !/^[a-zA-Z\sàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ]+$/u.test(
          //     value
          //   )
          // ? "Tên Quận/Huyện không được chứa kí tự đặc biệt"
          : undefined;
      },
    },
  });

  const handleCreateDistrict = async (dataSubmit: tblDistrict) => {
    await modifyDataDistrict(dataSubmit);
    onSearch();
    modals.closeAll();
  };

  const handleConverDataOption = (data: any) => {
    return data?.map((item: tblProvince) => {
      return {
        value: item.provinceId.toString(),
        label: item.provinceName,
      };
    });
  };

  const handleChangeDataProvince = (e: string | null) => {
    const Province = dataAllProvince?.filter(
      (item: tblProvince) => item.provinceId === Number(e)
    );
    form.getInputProps("provinceName").onChange(Province[0].provinceName);
    form.getInputProps("provinceCode").onChange(Province[0].provinceCode);
    form.getInputProps("provinceId").onChange(Province[0].provinceId);
  };

  useEffect(() => {
    const fetchDataProvince = async () => {
      const data = await getDataProvice("Active=true&Skip=0&Take=1000");
      setDataAllProvince(data?.data);
    };
    fetchDataProvince();
  }, []);

  useEffect(() => {
    if (id) {
      callApiGetData();
    }
  }, [id]);

  const callApiGetData = async () => {
    open();
    const urlDetail = `/TblDistrict/details?id=` + id;
    let callApi = await repository.post<MessageResponse<tblDistrict>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      const dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        form.setValues(dataApi);
      } else {
        NotificationExtension.Fails("Dữ liệu không tồn tại");
        modals.closeAll();
      }
      close();
    } else {
      NotificationExtension.Fails("Dữ liệu không tồn tại");
      modals.closeAll();
    }
  };

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: tblDistrict) => {
          handleCreateDistrict(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            mt={"lg"}
            label="Chọn Tỉnh/Thành phố"
            placeholder="Tỉnh/Thành phố"
            data={handleConverDataOption(dataAllProvince)}
            searchable
            withAsterisk
            nothingFoundMessage="Không có dữ liệu"
            value={form.values.provinceId.toString()}
            onChange={handleChangeDataProvince}
            mb={"lg"}
          />
          <></>
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên Quận/Huyện"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("districtName")}
          />

          <TextInput
            label={"Mã Quận/Huyện"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("districtCode")}
          />
        </Group>

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
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

type CreateViewProps = {
  id?: number;
  dataProvince?: any;
  onSearch: () => void;
};

export default EditView;
