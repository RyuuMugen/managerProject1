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
import {
  getDataDistrict,
  getDataProvice,
  modifyDataCommune,
} from "../../../api/ApiAddress";
import Repository from "../../../_base/helper/HttpHelper";
import { useDisclosure } from "@mantine/hooks";
import { MessageResponse } from "../../../model/MessageResponse";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  tblCommune,
  tblDistrict,
  tblProvince,
} from "../../../model/TblAddress";

const EditView = ({ id, onSearch }: CreateViewProps) => {
  const [dataAllDistrict, setDataAllDistrict] = useState<tblDistrict[]>([]);
  const [dataAllProvince, setDataAllProvince] = useState<tblProvince[]>([]);
  const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
  const [visible, { close, open }] = useDisclosure(false);

  const entity = {
    communeId: 0,
    communeCode: null,
    communeName: null,
    communeType: null,
    communeNameEn: null,
    provinceCode: null,
    provinceName: null,
    districtId: 0,
    districtCode: null,
    districtName: null,
  };

  const form = useForm<tblCommune>({
    initialValues: {
      ...entity,
    },

    validate: {
      provinceCode: isNotEmpty("Chưa chọn Tỉnh/Thành phố"),
      districtCode: isNotEmpty("Chưa chọn Quận/Huyện"),
      communeName: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Tên Phường/Xã chưa nhập"
          // : !/^[a-zA-Z0-9À-ÖØ-öø-ÿ ,ĂăÂâẹếÀàÃãỰựsàáạãảăắằẳẵặâầấẩẫậèéẹẽẻêềếểễệđìíịĩỉòóọõỏôồốổỗộơờớởỡợùúụũủưừứửữựỳýỵỹỷ\p{M}]+$/u.test(
          //     value
          //   )
          // ? "Tên Phường/Xã không được chứa kí tự đặc biệt"
          : undefined;
      },
      communeCode: (value: string | null) => {
        return !value || /^\s*$/.test(value)
          ? "Mã Phường/Xã chưa nhập"
          // : !/^\d+$/.test(value)
          // ? "Mã Phường/Xã chỉ được nhập số"
          : undefined;
      },
    },
  });

  const handleCreateCommune = async (dataSubmit: tblCommune) => {
    await modifyDataCommune(dataSubmit);

    onSearch();
    modals.closeAll();
  };

  const handleConverDataOptionDistrict = (data: any) => {
    return data
      ?.filter((item: any) => {
        return item.provinceCode === form.getInputProps("provinceCode").value;
      })
      .map((item: any) => {
        return {
          value: item.districtId.toString(),
          label: item.districtName,
        };
      });
  };

  const handleConverDataOptionProvince = (data: any) => {
    return data?.map((item: tblProvince) => {
      return {
        value: item.provinceCode,
        label: item.provinceName,
      };
    });
  };

  const handleChangeProvince = (e: string | null) => {
    const Province = dataAllProvince?.filter(
      (item: tblProvince) => item.provinceCode === e
    );
    form.getInputProps("provinceName").onChange(Province[0].provinceName);
    form.getInputProps("provinceCode").onChange(Province[0].provinceCode);
    form.getInputProps("districtId").onChange(null);
    form.getInputProps("districtName").onChange(null);
    form.getInputProps("districtCode").onChange(null);
  };

  const handleChangeDistrict = (e: string | null) => {
    const District = dataAllDistrict?.filter(
      (item: tblDistrict) => item.districtId === Number(e)
    );
    form.getInputProps("districtName").onChange(District[0].districtName);
    form.getInputProps("districtCode").onChange(District[0].districtCode);
    form.getInputProps("districtId").onChange(District[0].districtId);
  };

  const fetchDataProvince = async () => {
    const data = await getDataProvice("Active=true&Skip=0&Take=1000");
    setDataAllProvince(data?.data);
  };

  const fetchDataDistrict = async () => {
    const data = await getDataDistrict("Active=true&Skip=0&Take=1000");
    setDataAllDistrict(data?.data);
  };

  useEffect(() => {
    fetchDataDistrict();
    fetchDataProvince();
  }, []);

  useEffect(() => {
    const callApiGetData = async () => {
      open();
      const urlDetail = `/TblCommune/details?id=` + id;
      let callApi = await repository.post<MessageResponse<tblCommune>>(
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
    if (id) {
      callApiGetData();
    }
  }, [id]);
  // useEffect(() => {
  //   const district = dataAllDistrict.filter(
  //     (item) => form.values.districtId === item.districtId
  //   );
  //   form.values.provinceCode = district[0].provinceCode;
  //   form.values.provinceName = district[0].provinceName;
  // }, [dataAllDistrict]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        onSubmit={form.onSubmit((e: tblCommune) => {
          handleCreateCommune(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            id="bbbb"
            mt={"lg"}
            label="Chọn Tỉnh/Thành phố"
            placeholder="Tỉnh/Thành phố"
            data={handleConverDataOptionProvince(dataAllProvince)}
            searchable
            withAsterisk
            nothingFoundMessage="Không có dữ liệu"
            {...form.getInputProps("provinceCode")}
            onChange={handleChangeProvince}
            mb={"lg"}
          />
          <Select
            disabled={
              form.values.provinceCode || form.values.districtId ? false : true
            }
            id="aaaaaa"
            mt={"lg"}
            label="Chọn Quận/Huyện"
            placeholder="Quận/Huyện"
            nothingFoundMessage="Không có dữ liệu"
            data={handleConverDataOptionDistrict(dataAllDistrict)}
            // {...form.getInputProps("districtCode")}
            value={form.values.districtId?.toString() || null}
            onChange={handleChangeDistrict}
            searchable
            withAsterisk
            mb={"lg"}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên Phường/Xã"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("communeName")}
          />

          <TextInput
            label={"Mã Phường/Xã"}
            placeholder={"Nhập mã"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("communeCode")}
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
  onSearch: () => void;
};

export default EditView;
