import { Box, Button } from "@mantine/core";
import FormComponent from "./FormComponent";

const Children = ({ setListChildren, listChildren }: any) => {
  const handleAddChildren = () => {
    setListChildren([
      ...listChildren,
      {
        value: "",
        description: "",
        orderNumber: null,
        status: "",
      },
    ]);
  };

  const handleChangeDataChildren = (
    key: string,
    value: string,
    index: number
  ) => {
    const data = listChildren?.map((item: any, idx: number) => {
      return idx === index ? { ...item, [key]: value } : item;
    });
    setListChildren(data);
  };

  const handleDeleteChildren = (index: number) => {
    const data = listChildren?.filter((item: any, idx: number) => {
      return idx !== index;
    });
    setListChildren(data);
  };

  return (
    <Box mt={32}>
      <Button
        style={{ marginTop: 12 }}
        type="button"
        color="#3598dc"
        onClick={handleAddChildren}
      >
        Thêm giá trị
      </Button>
      {listChildren?.map((item: any, index: number) => {
        return (
          <FormComponent
            index={index}
            onChange={handleChangeDataChildren}
            onDelete={handleDeleteChildren}
            listChildren={listChildren}
          />
        );
      })}
    </Box>
  );
};

export default Children;
