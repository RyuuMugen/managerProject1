import {
  Box,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TblCoupon } from "../../../model/TblCoupon";
import { createCoupon } from "../../../api/ApiCoupon";
import { DateTimePicker } from "@mantine/dates";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import FormChooseItem from "./FormChooseItem";

const CreateView = ({ datas }: any) => {
  const navigate = useNavigate();

  const entity: TblCoupon = {
    id: 0,
    code: null,
    codeType: null,
    title: null,
    description: null,
    type: null,
    content: null,
    validOrderValue: null,
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
    limitUsePerUser: null,
    limitTotalAmountMin: null,
    total: null,
    orderCondition: null,
    totalUse: null,
    canUseWithOther: null,
    showToPublic: null,
    status: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
    lastUpdateLogin: null,
  };

  const handleCreateCoupon = async (dataSubmit: TblCoupon) => {
    open();
    await createCoupon(dataSubmit);
    close();
    navigate("/coupon");
    modals.closeAll();
  };

  const [dataOption, setDataOption] = useState<TblCoupon>();
  const [visible, { toggle, close, open }] = useDisclosure(false);

  useState<TblCoupon[]>();

  const form = useForm<TblCoupon>({
    initialValues: {
      ...entity,
    },
    validate: {
      codeType: isNotEmpty("Chưa chọn mã số phiếu"),
      title: isNotEmpty("Chưa nhập tên phiếu khuyến mại"),
      content: isNotEmpty("Chưa nhập mô tả"),
      fromDate: isNotEmpty("Chưa nhập ngày bắt đầu"),
      toDate: isNotEmpty("Chưa nhập ngày kết thúc"),
      limitTotalAmountMin: isNotEmpty("Chưa nhập giá trị đơn hàng"),
      limitUsePerUser: isNotEmpty("Chưa nhập giới hạn số lượng sử dụng"),
      orderCondition: isNotEmpty("Chưa chọn điều kiện áp dụng"),
      validOrderValue: isNotEmpty("Chưa nhập số lượng phiếu"),
      type: isNotEmpty("Chưa chọn phân loại"),
      total: isNotEmpty("Chưa nhập Total"),
    },
  });

  useEffect(() => {
    const dataOption = datas?.map((item: any) => {
      return { value: item?.id?.toString(), label: item?.name };
    });
    setDataOption(dataOption);
  }, [datas]);

  const [changeValue, setChangeValue] = useState("");

  let name = "";
  const handleValue = (event: any) => {
    if (event === "cash") {
      name = "Nhập số tiền";
    } else if (event === "pro") {
      name = "ID Sản phẩm";
    } else if (event === "priceoff") {
      name = "Nhập % giảm giá";
    } else {
      name = "Khác";
    }
    form.getInputProps("type").onChange(event);
    setChangeValue(name);
  };

  const handleCodeTypeChange = (event: any) => {
    form.getInputProps("codeType").onChange(event);
  };

  const handleChooseItem = (idItem: number) => {
    form.getInputProps("validOrderValue").onChange(idItem);
  };

  const openModal = () =>
    modals.openConfirmModal({
      modalId: "item",
      title: (
        <>
          <div color="white">
            <Title order={5}>Chọn sản phẩm thêm vào commbo set</Title>
          </div>
        </>
      ),
      children: <FormChooseItem onChooseItem={handleChooseItem} />,

      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1300}
        maw={1300}
        mx="auto"
        onSubmit={form.onSubmit((e: TblCoupon) => {
          handleCreateCoupon(e);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label="Mã số phiếu"
            placeholder="Chọn mã số phiếu"
            mt="md"
            withAsterisk
            data={[
              { value: "AUTO", label: "Tự nhập tay" },
              { value: "MANUAL", label: "Hệ thống tự tạo" },
            ]}
            {...form.getInputProps("codeType")}
            value={form.values.codeType}
            onChange={(e) => handleCodeTypeChange(e)}
          />

          <TextInput
            disabled={form.values.codeType !== "AUTO" ? true : false}
            label="Nhập mã số phiếu"
            placeholder="Nhập mã số phiếu"
            mt="md"
            withAsterisk
            type="text"
            {...form.getInputProps("code")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Tên phiếu khuyến mại"}
            placeholder={"Nhập tên phiếu khuyến mại"}
            mt="md"
            type="text"
            withAsterisk
            {...form.getInputProps("title")}
          />
          <TextInput
            label={"Mô tả"}
            placeholder={"Nhập mô tả"}
            mt="md"
            type="text"
            withAsterisk
            {...form.getInputProps("content")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <DateTimePicker
            value={
              form.getInputProps("fromDate").value
                ? new Date(form.getInputProps("fromDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("fromDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày bắt đầu hoạt động"
            placeholder="Ngày hoạt động"
            withAsterisk
          />
          <DateTimePicker
            value={
              form.getInputProps("toDate").value
                ? new Date(form.getInputProps("toDate").value)
                : null
            }
            onChange={(value) =>
              form
                .getInputProps("toDate")
                .onChange(moment(value).format("YYYY-MM-DD[T]HH:mm:ss"))
            }
            mt="md"
            label="Ngày bắt đầu kết thúc"
            placeholder="Ngày kết thúc"
            withAsterisk
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <TextInput
            label={"Giá trị đơn hàng tối thiểu"}
            placeholder={"Nhập giá trị đơn hàng tối thiểu"}
            mt="md"
            type="number"
            withAsterisk
            {...form.getInputProps("limitTotalAmountMin")}
          />
          <TextInput
            label={"Giới hạn số lượng sử dụng / 1 khách hàng"}
            placeholder={
              "Giới hạn số lượng sử dụng phiếu này trên 1 khách hàng"
            }
            mt="md"
            type="number"
            withAsterisk
            {...form.getInputProps("limitUsePerUser")}
          />
        </Group>
        <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
          <Select
            label="Điều kiện áp dụng "
            placeholder="Chọn điều kiện áp dụng"
            mt="md"
            withAsterisk
            data={[
              { value: "ALL", label: "Tất cả các sản phẩm" },
              { value: "Chỉ một số sản phẩm", label: "Chỉ một số sản phẩm" },
            ]}
            {...form.getInputProps("orderCondition")}
          />
          <TextInput
            label={"Số lương phiếu"}
            placeholder={"Nhập số lượng phiếu"}
            mt="md"
            type="number"
            withAsterisk
            {...form.getInputProps("total")}
          />
        </Group>
        <Text fw={700} mt={32} fz={18}>
          Phân loại
        </Text>
        <Box bg={"yellow.1"} p={10}>
          <Group grow wrap="nowrap" mt="lg" gap={"lg"}>
            <Select
              label="Phân loại"
              placeholder="Chọn phân loại"
              withAsterisk
              miw={525}
              mt="md"
              data={[
                { value: "cash", label: "Tặng tiền mặt" },
                { value: "pro", label: "Tặng sản phẩm" },
                { value: "priceoff", label: "Giảm giá %" },
                { value: "other", label: "Khác" },
              ]}
              {...form.getInputProps("type")}
              value={form.values.type}
              onChange={(e) => handleValue(e)}
            />

            <TextInput
              label={changeValue ? changeValue : "Điền thông tin"}
              placeholder={changeValue}
              mt="md"
              withAsterisk
              miw={525}
              type="number"
              {...form.getInputProps("validOrderValue")}
            />
            {form.values.type === "pro" ? (
              <Flex mt={40}>
                <Button onClick={(e) => openModal()}>Chọn sản phẩm</Button>
              </Flex>
            ) : null}
          </Group>
        </Box>

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
            onClick={() => navigate("/coupon")}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
};

export default CreateView;
