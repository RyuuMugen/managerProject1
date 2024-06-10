import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { TimeInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  getDataCommune,
  getDataDistrict,
  getDataProvice,
} from "../../../api/ApiAddress";
import {
  tblCommune,
  tblDistrict,
  tblProvince,
} from "../../../model/TblAddress";
import { TblConfigWebStore } from "../../../model/TblConfigWeb";

const EditView = ({ data, handleEditStore }: EditViewProps) => {
  const entity: TblConfigWebStore = {
    id: 0,
    storeName: null,
    address: null,
    telephone: null,
    provinceId: null,
    districtId: null,
    communeId: null,
    storeID: null,
    isActualStore: null,
    status: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    image: null,
    linkMap: null,
    mapEmbeded: null,
    warrantyTel: null,
    email: null,
    openTime: null,
    closedTime: null,
    side: null,
  };

  const form = useForm<TblConfigWebStore>({
    initialValues: {
      ...entity,
    },

    validate: {
      storeName: isNotEmpty("Tên cửa hàng chưa nhập"),
      telephone: (value) => {
        if (!value) {
          return "Số điện thoại chưa nhập"; // Trả về null nếu value là null hoặc không xác định
        }
        return /^\d{10}$/.test(value.trim())
          ? null
          : "Số điện thoại không hợp lệ";
      },
      address: isNotEmpty("Địa chỉ chưa nhập"),
      isActualStore: isNotEmpty("Đây là cửa hàng có thể tới chưa chọn"),
      status: isNotEmpty("Trạng thái chưa chọn"),
      image: isNotEmpty("Link ảnh cửa hàng chưa nhập"),
      linkMap: isNotEmpty("Link map chưa nhập"),
      email: isNotEmpty("Chưa nhập email liên hệ"),
      openTime: isNotEmpty("Chưa chọ thời gian mở cửa"),
      closedTime: (value, fieldValues) => {
        if (!value) {
          return "Chưa chọn thời gian đóng cửa";
        } else if (!fieldValues.openTime) {
          return "Chưa chọn thời gian mở cửa";
        } else if (value <= fieldValues.openTime) {
          return "Thời gian đóng cửa phải sau thời gian mở cửa";
        }
        return undefined;
      },
    },
  });

  const [dataAllProvince, setDataAllProvince] = useState<tblProvince[]>([]);
  const [dataAllDistrict, setDataAllDistrict] = useState<tblDistrict[]>([]);
  const [dataAllCommune, setDataAllCommune] = useState<tblCommune[]>([]);
  const [dataOptionProvince, setDataOptionProvince] = useState<any[]>([]);
  const [dataOptionDistrict, setDataOptionDistrict] = useState<any[]>([]);
  const [dataOptionCommune, setDataOptionCommune] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<tblProvince>();
  const [selectedDistrict, setSelectedDistrict] = useState<tblDistrict>();
  const handleChangeSelectedProvince = (id: string | null) => {
    if (id) {
      form.getInputProps("provinceId").onChange(Number(id));
      form.getInputProps("districtId").onChange(null);
      setSelectedProvince(
        dataAllProvince?.find((item: any) => item.provinceId === id)
      );
    }
  };

  const handleChangeSelectedDistrict = (id: string | null) => {
    if (id) {
      form.getInputProps("districtId").onChange(Number(id));
      form.getInputProps("communeId").onChange(null);
      setSelectedDistrict(
        dataAllDistrict?.find((item: any) => item.districtId === id)
      );
    }
  };

  const handleChangeSelectedCommune = (id: string | null) => {
    if (id) {
      form.getInputProps("communeId").onChange(Number(id));
    }
  };
  const handleChangeSide = (id: string | null) => {
    if (id) {
      form.getInputProps("side").onChange(Number(id));
    }
  };
  const fetchDataProvince = async () => {
    const data = await getDataProvice("Active=true&Skip=0&Take=1000");
    setDataAllProvince(data?.data);
  };

  const fetchDataDistrict = async () => {
    const data = await getDataDistrict("Active=true&Skip=0&Take=1000");
    setDataAllDistrict(data?.data);
  };

  const fetchDataCommune = async () => {
    const data = await getDataCommune("Active=true&Skip=0&Take=1000");
    setDataAllCommune(data?.data);
  };

  const handleCreateConfigStore = async (dataSubmit: TblConfigWebStore) => {
    handleEditStore(dataSubmit);
    modals.closeAll();
  };
  const isOpenTimeEmpty = form.values.openTime === null;
  useEffect(() => {
    fetchDataProvince();
    fetchDataDistrict();
    fetchDataCommune();
  }, []);

  useEffect(() => {
    if (data) {
      form.setValues({ ...data });
      setSelectedProvince(
        dataAllProvince?.find(
          (item: tblProvince) => item.provinceId === data.provinceId
        )
      );
      setSelectedDistrict(
        dataAllDistrict?.find(
          (item: tblDistrict) => item.districtId === data.districtId
        )
      );
    }
  }, [data, dataAllProvince, dataAllDistrict]);

  useEffect(() => {
    setDataOptionProvince(
      dataAllProvince?.map((item: tblProvince) => {
        return {
          value: item.provinceId.toString(),
          label: item.provinceName,
        };
      })
    );
  }, [dataAllProvince]);

  useEffect(() => {
    setDataOptionDistrict(
      dataAllDistrict
        ?.filter((item: tblDistrict) => {
          return item?.provinceCode === selectedProvince?.provinceCode;
        })
        .map((item: any) => {
          return {
            value: item.districtId.toString(),
            label: item.districtName,
          };
        })
    );
  }, [
    form.values.provinceId,
    dataAllDistrict,
    selectedProvince,
    dataAllProvince,
  ]);
  useEffect(() => {
    setDataOptionCommune(
      dataAllCommune
        ?.filter((item: tblCommune) => {
          return item?.districtCode === selectedDistrict?.districtCode;
        })
        .map((item: any) => {
          return {
            value: item.communeId.toString(),
            label: item.communeName,
          };
        })
    );
  }, [
    form.values.districtId,
    selectedDistrict,
    dataAllCommune,
    dataAllDistrict,
  ]);
  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      onSubmit={form.onSubmit((e: TblConfigWebStore) => {
        handleCreateConfigStore(e);
      })}
    >
      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TextInput
          label={"Tên cửa hàng"}
          placeholder={"Nhập tên"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("storeName")}
        />

        <TextInput
          label={"Số điện thoại"}
          placeholder={"Nhập telephone"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("telephone")}
        />
      </Group>
      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <Select
          id="bbbb"
          mt={"lg"}
          label="Chọn Tỉnh/Thành phố"
          placeholder="Tỉnh/Thành phố"
          nothingFoundMessage="Không có dữ liệu"
          data={dataOptionProvince}
          searchable
          value={
            form.values.provinceId ? form.values.provinceId?.toString() : null
          }
          onChange={(e) => handleChangeSelectedProvince(e)}
        />

        <Select
          disabled={
            form.values.provinceId && form.values.provinceId > 0 ? false : true
          }
          id="aaaaaa"
          mt={"lg"}
          label="Chọn Quận/Huyện"
          placeholder="Quận/Huyện"
          data={dataOptionDistrict}
          nothingFoundMessage="Không có dữ liệu"
          value={
            form.values.districtId ? form.values.districtId?.toString() : null
          }
          onChange={(e) => handleChangeSelectedDistrict(e)}
          searchable
        />
      </Group>

      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <Select
          disabled={
            form.values.districtId && form.values.districtId > 0 ? false : true
          }
          id="ccccc"
          mt={"lg"}
          label="Chọn Phường/Xã"
          placeholder="Phường/Xã"
          data={dataOptionCommune}
          nothingFoundMessage="Không có dữ liệu"
          value={
            form.values.communeId ? form.values.communeId?.toString() : null
          }
          onChange={(e) => handleChangeSelectedCommune(e)}
          searchable
        />
        <TextInput
          label={"Địa chỉ"}
          placeholder={"Nhập địa chỉ"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("address")}
        />
      </Group>
      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TextInput
          label={"URL ShowRoom"}
          placeholder={"Nhập URL ShowRoom"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("image")}
        />
        <TextInput
          label={"URL google map"}
          placeholder={"Nhập URL google map"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("linkMap")}
        />
      </Group>
      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TextInput
          label={"URL Embeded"}
          placeholder={"Nhập URL Embeded của map"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("mapEmbeded")}
        />
      </Group>
      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TextInput
          label={"Mail liên hệ"}
          placeholder={"Nhập địa chỉ mail liên hệ"}
          withAsterisk
          mt="md"
          type="text"
          {...form.getInputProps("email")}
        />
        <TextInput
          label={"Số điện thoại bảo hành"}
          placeholder={"Nhập số điện thoại bảo hành"}
          mt="md"
          type="text"
          {...form.getInputProps("warrantyTel")}
        />
      </Group>

      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <TimeInput
          label={"Thòi gian mở của"}
          placeholder={"Nhập thời gian mở của"}
          withAsterisk
          mt="md"
          {...form.getInputProps("openTime")}
        />
        <TimeInput
          label={"Thời gian đóng cửa"}
          placeholder={"Nhập thời gian đóng cửa"}
          withAsterisk
          mt="md"
          disabled={isOpenTimeEmpty}
          {...form.getInputProps("closedTime")}
        />
      </Group>
      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <Select
          label={"Đây là 1 cửa hàng khách có thể tới"}
          placeholder={"Có/Không"}
          withAsterisk
          mt="md"
          data={[
            { value: "Y", label: "Có" },
            { value: "N", label: "Không" },
          ]}
          {...form.getInputProps("isActualStore")}
        />

        <Select
          label={"Trạng thái"}
          placeholder={"Hiển thị/Không hiển thị"}
          withAsterisk
          mt="md"
          data={[
            { value: "A", label: "Hiển thị" },
            { value: "I", label: "Không hiển thị" },
          ]}
          {...form.getInputProps("status")}
        />
      </Group>

      <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
        <Select
          label={"Khu vực"}
          placeholder={"Chọn khu vực"}
          mt="md"
          data={[
            { value: "1", label: "Miền Bắc" },
            { value: "2", label: "Miền Trung" },
            { value: "3", label: "Miền Nam" },
          ]}
          value={form.values.side ? form.values.side?.toString() : null}
          onChange={(e) => handleChangeSide(e)}
        />
        <TextInput
          label={"StoreID trên phần mềm kho hàng (nếu có)"}
          placeholder={"Nhập StoreID"}
          mt="md"
          type="text"
          {...form.getInputProps("storeID")}
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
  );
};

export default EditView;

type EditViewProps = {
  data: TblConfigWebStore | null;
  handleEditStore: (data: TblConfigWebStore) => void;
};
