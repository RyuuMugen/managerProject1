import {
  Box,
  Button,
  Divider,
  Group,
  LoadingOverlay,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconX } from "@tabler/icons-react";

import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import { TblBrand } from "../../../model/TblBrand";

const UpdateOrderNumberView = function ({
  orderNumber,
  brand,
  featuredActive,
}: {
  orderNumber: number;
  brand: TblBrand;
  featuredActive: (
    id: number,
    type: string,
    order?: number
  ) => Promise<boolean | undefined>;
}) {
  //
  const [visible, { toggle, close, open }] = useDisclosure(false);

  const form = useForm<{ orderNumber: number }>({
    initialValues: {
      orderNumber: orderNumber,
    },
  });

  const apiUpdate = async (orderNumber: number) => {
    open();
    if (orderNumber < 0 || orderNumber > 10000) {
      NotificationExtension.Fails("STT chỉ được nằm trong khoảng 0 - 10000 !");
      close();
    } else if (brand.ordering === orderNumber) {
      NotificationExtension.Fails("Bạn chưa thay đổi STT !");
      close();
    } else {
      featuredActive(brand.id, "order", orderNumber);
      modals.closeAll();
    }
  };

  const formCreate = (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={600}
        maw={600}
        mx="auto"
        onSubmit={form.onSubmit(async (e: any) => {
          toggle();
          await apiUpdate(form.values.orderNumber);
        })}
      >
        <LoadingOverlay
          visible={visible}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Divider my="sm" />
        <TextInput
          label="STT: "
          placeholder="Nhập STT..."
          type="number"
          withAsterisk
          {...form.getInputProps("orderNumber")}
        />

        <Group justify="flex-end" mt="lg">
          <Button
            type="submit"
            color="#3598dc"
            loading={visible}
            leftSection={<IconCheck size={18} />}
          >
            Lưu
          </Button>

          <Button
            variant="outline"
            color="black"
            type="button"
            loading={visible}
            onClick={() => modals.closeAll()}
            leftSection={<IconX size={18} />}
          >
            Đóng
          </Button>
        </Group>
      </Box>
    </>
  );
  return <>{formCreate}</>;
};

export default UpdateOrderNumberView;
