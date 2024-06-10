import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteItemProduct } from "../../../api/ApiProduct";

const DeleteView = ({ idItem, onSearch }: DeleteProduct) => {
  const handleDeleteProduct = async () => {
    await deleteItemProduct(idItem);
    onSearch();
    modals.closeAll();
  };

  return (
    <div>
      <Text size="24px"> bạn có chắc chắn muốn xóa các sản phẩm này ?</Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="red"
          onClick={handleDeleteProduct}
          leftSection={<IconCheck size={18} />}
        >
          Xóa
        </Button>
        <Button
          type="button"
          color="blue"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
      </Group>
    </div>
  );
};

type DeleteProduct = {
  idItem: number[];
  onSearch: Function;
};

export default DeleteView;
