import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";

const DeleteView = ({ idItems, handleDeleteStore }: DeleteProduct) => {
  const handleOKDelete = () => {
    handleDeleteStore(idItems);
    modals.closeAll();
  };
  return (
    <div>
      <Text size="24px">Bạn có chắc chắn muốn xóa các cửa hàng này ?</Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="#3598dc"
          onClick={handleOKDelete}
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
  idItems: number[];
  handleDeleteStore: (idItems: number[]) => void;
};

export default DeleteView;
