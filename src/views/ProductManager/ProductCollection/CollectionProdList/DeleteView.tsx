import { Button, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";
import { editCollection } from "../../../../api/ApiCollection";
import { TblCollection } from "../../../../model/TblComboSetCollection";

const DeleteView = ({ formData, idItem, onSearch }: DeleteProduct) => {
  const handleDeleteProductAds = async () => {
    const filteredArray = formData.tblComboSetCollectionProdCommands.filter(
      (obj) => !idItem.includes(obj.prodId)
    );
    const updatedFormData = {
      ...formData,
      tblComboSetCollectionProdCommands: filteredArray,
    };
    editCollection(updatedFormData);
    modals.close("delete");
    onSearch();
  };

  return (
    <div>
      <Text size="24px">
        Bạn có chắc chắn muốn xóa các sản phẩm này khỏi bộ sưu tập{" "}
        {formData.title} ?
      </Text>
      <Group justify="center" mt="lg">
        <Button
          type="button"
          color="#3598dc"
          onClick={handleDeleteProductAds}
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
  formData: TblCollection;
};

export default DeleteView;
