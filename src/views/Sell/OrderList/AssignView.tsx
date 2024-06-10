import { Box, Button, Group, Select, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { getDataEmployeekdol } from "../../../api/ApiEmployee";
import { modifySaleOrderAssign } from "../../../api/ApiSaleOrder";
import { tblEmployeekdol } from "../../../model/TblEmployee";

const DeleteView = ({ idItem, onSearch }: DeleteProduct) => {
  const [dataOptionEmployee, setDataOptionEmployee] = useState<any>([]);
  const [dataEmployee, setDataEmployee] = useState<tblEmployeekdol[]>([]);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const [note, setNote] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [valuesArray, setValuesArray] = useState<
    Array<{
      OrderId: number;
      assignId: number | null;
      assignName: string | null;
      description?: string;
    }>
  >([]);
  const handleEditAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
    open();
    const updatedValuesArray = valuesArray.map((item) => ({
      ...item,
      description: descriptionValue, // Sử dụng giá trị của TextInput
    }));
    modifySaleOrderAssign(updatedValuesArray);

    close();
    modals.closeAll();
    onSearch();
  };
  const handleSelectChange = (selectedValue: any) => {
    // const parts = selectedValue.split("+");
    // const beforePlus = parts[0];
    // const afterPlus = parts.slice(1).join("+");
    const employee = dataEmployee.find(
      (item) => item.id === parseInt(selectedValue)
    );
    idItem.forEach((itemId: number) => {
      valuesArray.push({
        OrderId: itemId,
        assignId: employee?.id || null,
        assignName: employee?.email_organ || null,
      });
    });
    setValuesArray(valuesArray);
  };
  useEffect(() => {
    const loadDataEmployee = async () => {
      setDataEmployee([]);
      const data = await getDataEmployeekdol("Skip=0&Take=1000");
      setDataEmployee(data?.data);
    };
    loadDataEmployee();
  }, []);

  useEffect(() => {
    if (dataEmployee) {
      setDataOptionEmployee(
        dataEmployee.map((option) => {
          return {
            value: option?.id.toString(),
            label:
              "Email: " +
              option?.email_organ +
              " - " +
              "Tên nhân viên: " +
              option?.name,
          };
        })
      );
    }
  }, [dataEmployee]);

  return (
    <div>
      <Box component="form" onSubmit={handleEditAssign}>
        <Text fw={700}>Cập nhật người phụ trách</Text>
        <Group grow wrap="nowrap" mt="md" gap={"lg"}>
          <Select
            label={"Chọn người phụ trách"}
            placeholder={"Chọn người phụ trách"}
            withAsterisk
            searchable
            nothingFoundMessage="Không có dữ liệu"
            data={dataOptionEmployee}
            onChange={handleSelectChange}
            w={500}
          />
          <TextInput
            label={"Ghi chú thêm"}
            type="text"
            value={descriptionValue} // Gán giá trị và onChange
            onChange={(e) => setDescriptionValue(e.currentTarget.value)}
          />
        </Group>
        <Button mt={"md"} type="submit">
          Cập nhật
        </Button>
      </Box>
    </div>
  );
};

type DeleteProduct = {
  idItem: number[];
  onSearch: () => void;
};

export default DeleteView;
