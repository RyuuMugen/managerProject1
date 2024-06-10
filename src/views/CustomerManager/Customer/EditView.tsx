import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Select,
  TextInput,
  rem,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconFileCv } from "@tabler/icons-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { isNullOrUndefined } from "../../../_base/extension/StringExtension";
import Repository from "../../../_base/helper/HttpHelper";
import {
  getDataCommune,
  getDataDistrict,
  getDataProvice,
} from "../../../api/ApiAddress";
import { getDataCustomerGroup, modifyCustomer } from "../../../api/ApiCustomer";
import { MessageResponse } from "../../../model/MessageResponse";
import {
  tblCommune,
  tblDistrict,
  tblProvince,
} from "../../../model/TblAddress";
import { tblCustomer, tblCustomerGroup } from "../../../model/TblCustomer";

const icon = (
  <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
);

const EditView = ({ id, onSearch }: any) => {
  const entity = {
    customerId: 0,
    parentCustomerId: null,
    customerNumber: null,
    customerName: null,
    customerType: null,
    validatedFlag: null,
    taxReference: null,
    country: null,
    address: null,
    city: null,
    contactName: null,
    telephoneNumber: null,
    fax: null,
    email: null,
    taxCode: null,
    type: null,
    status: null,
    note: null,
    sex: null,
    dateOfBirth: null,
    customerFullName: null,
    otherName: null,
    ethnic: null,
    nationality: null,
    religion: null,
    nation: null,
    // province: null,
    // provinceId: null,
    // district: null,
    // districtId: null,
    // ward: null,
    // wardId: null,
    shipToProvince: null,
    shipToDistrict: null,
    shipToWard: null,
    height: null,
    weight: null,
    identifiedNumber: null,
    effectiveDate: null,
    issuedBy: null,
    dateParty1: null,
    date2Party2: null,
    groupId: null,
    userName: null,
    avatar: null,
    taxCompany: null,
    taxAddress: null,
    description: null,
    ordercount: null,
    totalvalue: null,
    orderCountSuccess: null,
    totalValueSuccess: null,
    lastOrderDate: null,
    addDate: null,
    banned: null,
    loginToken: null,
    productReviewCount: null,
    questionAsk: null,
    questionAnswer: null,
    loyaltyPoint: null,
    loyaltyLevel: null,
    articleComment: null,
    tblCustomerSiteCommands: [],
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdateLogin: null,
    creationDate: null,
  };

  const handleCreateCustomer = async (dataSubmit: tblCustomer) => {
    open();
    await modifyCustomer(dataSubmit);
    close();
    onSearch();
    modals.closeAll();
  };

  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [dataCustomerGroup, setDataCustomerGroup] = useState<
    tblCustomerGroup[]
  >([]);
  const [dataOption, setDataOption] = useState<any[]>();

  const form = useForm<tblCustomer>({
    initialValues: {
      ...entity,
    },
    validate: {
      customerName: isNotEmpty("Tên chưa chưa nhập"),
      email: isNotEmpty("Email chưa chưa nhập"),
    },
  });

  const handleChangeDataCustomerGroup = (id: string | null) => {
    if (id) {
      const customer = dataCustomerGroup?.filter(
        (item: tblCustomerGroup) => item.id === Number(id)
      );
      form.getInputProps("groupId").onChange(customer[0].id);
    }
  };

  const [dataAllProvince, setDataAllProvince] = useState<tblProvince[]>([]);
  const [dataAllDistrict, setDataAllDistrict] = useState<tblDistrict[]>([]);
  const [dataAllCommune, setDataAllCommune] = useState<tblCommune[]>([]);
  const [dataOptionProvince, setDataOptionProvince] = useState<any[]>([]);
  const [dataOptionDistrict, setDataOptionDistrict] = useState<any[]>([]);
  const [dataOptionCommune, setDataOptionCommune] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<tblProvince>();
  const [selectedDistrict, setSelectedDistrict] = useState<tblDistrict>();
  const [selectedCommune, setSelectedCommune] = useState<tblCommune>();
  const callApiGetData = async () => {
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    open();
    const urlDetail = `TblCustomer/details?id=` + id;
    let callApi = await repository.post<MessageResponse<tblCustomer>>(
      urlDetail
    );
    if (!isNullOrUndefined(callApi) && !isNullOrUndefined(callApi?.data)) {
      let dataApi = callApi?.data;
      if (dataApi != null && !isNullOrUndefined(dataApi)) {
        const { tblCustomerSiteModels, ...restGroup } = dataApi;
        form.setValues({
          ...restGroup,
          tblCustomerSiteCommands: tblCustomerSiteModels,
        });
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

  useEffect(() => {
    fetchDataProvince();
    fetchDataDistrict();
    fetchDataCommune();
  }, []);

  useEffect(() => {
    callApiGetData();
  }, [id]);

  const handleChangeSelectedProvince = (id: string | null) => {
    if (id) {
      form.getInputProps("shipToProvince").onChange(Number(id));
      form.getInputProps("shipToDistrict").onChange(null);
      setSelectedProvince(
        dataAllProvince?.find(
          (item: tblProvince) => item.provinceId.toString() === id.toString()
        )
      );
    }
  };

  const handleChangeSelectedDistrict = (id: string | null) => {
    if (id) {
      form.getInputProps("shipToDistrict").onChange(Number(id));
      form.getInputProps("shipToWard").onChange(null);
      setSelectedDistrict(
        dataAllDistrict?.find(
          (item: tblDistrict) => item.districtId.toString() === id.toString()
        )
      );
    }
  };

  const handleChangeSelectedCommune = (id: string | null) => {
    if (id) {
      form.getInputProps("shipToWard").onChange(Number(id));
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

  useEffect(() => {
    fetchDataProvince();
    fetchDataDistrict();
    fetchDataCommune();
  }, []);

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
    form.values.shipToProvince,
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
    form.values.shipToDistrict,
    selectedDistrict,
    dataAllCommune,
    dataAllDistrict,
  ]);

  useEffect(() => {
    const loadDataCustomerGroup = async () => {
      setDataCustomerGroup([]);
      const data = await getDataCustomerGroup("Active=true&Skip=0&Take=1000");
      setDataCustomerGroup(data?.data);
    };
    loadDataCustomerGroup();
  }, []);

  useEffect(() => {
    if (dataCustomerGroup) {
      setDataOption(
        dataCustomerGroup.map((option) => {
          return {
            value: option?.id.toString(),
            label: option?.groupName,
          };
        })
      );
    }
  }, [dataCustomerGroup]);
  useEffect(() => {
    setSelectedProvince(
      dataAllProvince?.find(
        (item: tblProvince) =>
          item.provinceId === Number(form.values.shipToProvince)
      )
    );
    setSelectedDistrict(
      dataAllDistrict?.find(
        (item: tblDistrict) =>
          item.districtId === Number(form.values.shipToDistrict)
      )
    );
    setSelectedCommune(
      dataAllCommune?.find(
        (item: tblCommune) => item.communeId === Number(form.values.shipToWard)
      )
    );
  }, [dataAllProvince, dataAllDistrict, dataAllCommune]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={900}
        maw={900}
        mx="auto"
        onSubmit={form.onSubmit((e: tblCustomer) => {
          handleCreateCustomer(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên khách hàng"}
            placeholder={"Nhập tên"}
            withAsterisk
            mt="md"
            type="text"
            {...form.getInputProps("customerName")}
          />
          <TextInput
            label={"Địa chỉ Email"}
            placeholder={"customer@gmail.com"}
            withAsterisk
            mt="md"
            type="email"
            {...form.getInputProps("email")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label={"Phân nhóm"}
            placeholder={"Chọn nhóm khách hàng"}
            mt="md"
            data={dataOption}
            value={form.values.groupId?.toString()}
            onChange={handleChangeDataCustomerGroup}
          />
          <Select
            label={"Giới tính"}
            placeholder={"Chọn giới tính"}
            mt="md"
            data={["Nam", "Nữ"]}
            {...form.getInputProps("sex")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <DateTimePicker
            value={
              form.getInputProps("dateOfBirth").value
                ? new Date(form.getInputProps("dateOfBirth").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("dateOfBirth")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Sinh nhật"
            placeholder="Nhâp ngày sinh"
          />
          <TextInput
            label={"Điện thoại nhà"}
            placeholder={""}
            mt="md"
            type="number"
            {...form.getInputProps("mobileNumber")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Điện thoại di động"}
            placeholder={""}
            mt="md"
            type="number"
            {...form.getInputProps("telephoneNumber")}
          />

          <Select
            id="bbbb"
            mt={"lg"}
            label="Chọn Tỉnh/Thành phố"
            placeholder="Tỉnh/Thành phố"
            nothingFoundMessage="Không có dữ liệu"
            data={dataOptionProvince}
            searchable
            value={
              form.values.shipToProvince
                ? form.values.shipToProvince?.toString()
                : null
            }
            onChange={(e) => handleChangeSelectedProvince(e)}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            disabled={
              form.values.shipToProvince && form.values.shipToProvince > 0
                ? false
                : true
            }
            id="aaaaaa"
            mt={"lg"}
            label="Chọn Quận/Huyện"
            placeholder="Quận/Huyện"
            data={dataOptionDistrict}
            nothingFoundMessage="Không có dữ liệu"
            value={
              form.values.shipToDistrict
                ? form.values.shipToDistrict?.toString()
                : null
            }
            onChange={(e) => handleChangeSelectedDistrict(e)}
            searchable
          />

          <Select
            disabled={
              form.values.shipToDistrict && form.values.shipToDistrict > 0
                ? false
                : true
            }
            id="ccccc"
            mt={"lg"}
            label="Chọn Phường/Xã"
            placeholder="Phường/Xã"
            data={dataOptionCommune}
            nothingFoundMessage="Không có dữ liệu"
            value={
              form.values.shipToWard ? form.values.shipToWard?.toString() : null
            }
            onChange={(e) => handleChangeSelectedCommune(e)}
            searchable
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Địa chỉ"}
            placeholder={"Nhập địa chỉ"}
            mt="md"
            type="text"
            {...form.getInputProps("address")}
          />
          <TextInput
            label={"Tên công ty"}
            placeholder={"Nhập tên công ty"}
            mt="md"
            type="text"
            {...form.getInputProps("taxCompany")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Mã số thuế"}
            placeholder={"Nhập tax"}
            mt="md"
            type="text"
            {...form.getInputProps("taxCode")}
          />
          <TextInput
            label={"Địa chỉ công ty"}
            placeholder={"Nhập địa chỉ công ty"}
            mt="md"
            type="text"
            {...form.getInputProps("taxAddress")}
          />
        </Group>

        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Ghi chú"}
            placeholder={"Nhập ghi chú"}
            mt="md"
            type="text"
            {...form.getInputProps("description")}
          />
        </Group>

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Lưu
          </Button>
          <Button
            variant="outline"
            color="black"
            type="button"
            onClick={() => modals.closeAll()}
            loading={visible}
            leftSection={!visible ? <IconCheck size={18} /> : undefined}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default EditView;
