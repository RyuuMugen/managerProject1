import { Box, Image } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";

const ImageShow = function ({
  img,
  w,
  h,
}: {
  img: string;
  w: number | undefined;
  h: number | undefined;
}) {
  //
  const [visible, { toggle, close, open }] = useDisclosure(false);
  useEffect(() => {}, []);

  //#endregion

  const formCreate = (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={w}
        mah={h == 0 ? 100 : h}
        maw={w == 0 ? 100 : w}
        mx="auto"
      >
        {/* <Text >Ảnh:</Text> */}
        <Image radius="md" src={img} />

        {/* <Group justify="flex-end" mt="lg">
                    <Button
                        variant="outline"
                        color="black"
                        type="submit"
                        // onClick={() => modals.closeAll()}
                        leftSection={<IconX size={18} />}
                    >
                        Đóng
                    </Button>
                </Group> */}
      </Box>
    </>
  );

  return <>{formCreate}</>;
};

export default ImageShow;
