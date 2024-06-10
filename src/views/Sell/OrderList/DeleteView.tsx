import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { deleteSaleOrder } from "../../../api/ApiSaleOrder";

const DeleteView = ({ idItem, onSearch }: DeleteProduct) => {
  const handleDeleteProduct = async () => {
    await deleteSaleOrder(idItem);
    modals.closeAll();
    onSearch();
  };

  return (
    <div>
      <Text size="24px">bạn có chắc chắn muốn xóa đơn hàng này?</Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="#3598dc"
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
