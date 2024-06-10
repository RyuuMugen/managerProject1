import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteAttribute } from "../../../api/ApiAttribute";

const DeleteView = ({ idItem, onSearch }: DeleteProduct) => {
  const handleDeleteProduct = async () => {
    await deleteAttribute(idItem);
    onSearch();
    modals.closeAll();
  };

  return (
    <div>
      <Text size="24px"> bạn có chắc chắn muốn xóa các thuộc tính này ?</Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="#ED1B24"
          onClick={handleDeleteProduct}
          leftSection={<IconCheck size={18} />}
        >
          Xóa
        </Button>
        <Button
          type="button"
          color="#3598dc"
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
  onSearch: () => void;
};

export default DeleteView;
