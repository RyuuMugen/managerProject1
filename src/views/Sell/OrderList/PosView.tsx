import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { forwardSaleOrderPOS } from "../../../api/ApiSaleOrder";

const PosView = ({ idItem, onSearch }: PosProduct) => {
  const handleForwardSaleOrder = async () => {
    await forwardSaleOrderPOS(idItem);
    onSearch();
    modals.closeAll();
  };

  return (
    <div>
      <Text size="24px">Bạn có chắc chắn muốn gửi đơn hàng này sang POS?</Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="#3598dc"
          onClick={handleForwardSaleOrder}
          leftSection={<IconCheck size={18} />}
        >
          Gửi
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={() => modals.closeAll()}
          leftSection={<IconX size={18} />}
        >
          Hủy
        </Button>
      </Group>
    </div>
  );
};

type PosProduct = {
  idItem: number[];
  onSearch: () => void;
};

export default PosView;
