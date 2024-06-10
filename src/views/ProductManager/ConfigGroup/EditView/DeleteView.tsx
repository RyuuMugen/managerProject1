import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";

const DeleteView = ({ idItem, type, handleDelete }: DeleteProduct) => {
  const handleDeleteConfigGroup = async () => {
    await handleDelete(idItem);
    modals.closeAll();
  };

  return (
    <div>
      <Text size="24px">Bạn có chắc chắn muốn xóa {type} này?</Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="#3598dc"
          onClick={handleDeleteConfigGroup}
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
  type: string;
  handleDelete: (idsItem: number[]) => Promise<void>;
};

export default DeleteView;
