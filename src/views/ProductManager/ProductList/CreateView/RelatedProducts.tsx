import { Box, Button, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import FormChooseItem from "../../../Marketing/Coupons/FormChooseItem";

const RelatedProducts = () => {
  const openModal = () =>
    modals.openConfirmModal({
      modalId: "item",
      title: (
        <>
          <div color="white">
            <Title order={5}>Chọn sản phẩm liên quan</Title>
          </div>
        </>
      ),
      children: (
        <FormChooseItem
          onChooseItem={handleChooseItem}
          textButton="Chọn SP liên quan"
        />
      ),

      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  const handleChooseItem = () => {
    // viết hàm call API thêm sp liên quan vào đây
  };

  return (
    <Box>
      <Button style={{ margin: 12 }} onClick={() => openModal()}>
        Chọn SP
      </Button>
    </Box>
  );
};

export default RelatedProducts;
