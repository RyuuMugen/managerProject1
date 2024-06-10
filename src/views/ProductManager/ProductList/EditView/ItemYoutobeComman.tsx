import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { TblItemYoutubeCommand } from "../../../../model/ProductList";

const ItemYoutubeCommand = ({
  onAddYoutobe,
  dataYoutube,
}: ItemYoutobeProps) => {
  const [dataYoutobe, setDataYoutobe] = useState<TblItemYoutubeCommand[]>([]); // Lưu giữ giá trị của TextInput cho từng Group

  const handleAddGroup = () => {
    setDataYoutobe((prevData) => [
      ...prevData,
      { id: 0, linkYoutube: "", description: "" },
    ]);
  };

  const handleRemoveGroup = (index: number) => {
    const newDataYoutobe = [...dataYoutobe];
    newDataYoutobe.splice(index, 1);
    setDataYoutobe(newDataYoutobe);
  };

  const handleChangeValue = (
    value: string,
    index: number,
    field: "linkYoutube" | "description"
  ) => {
    const newDataYoutobe = [...dataYoutobe];
    newDataYoutobe[index] = {
      ...newDataYoutobe[index],
      [field]: value,
    };
    setDataYoutobe(newDataYoutobe);
  };

  useEffect(() => {
    if (dataYoutube) {
      setDataYoutobe(dataYoutube);
    }
  }, [dataYoutube]);

  return (
    <Box
      className="flex-none"
      component="form"
      miw={1200}
      maw={1200}
      mx="auto"
      style={{ position: "relative" }}
    >
      <Text mt={24} fw={600}>
        Youtube Video: Bạn cần gắn url của video được cung cấp bởi Youtube vào
        đây <br />
        Ví dụ:
        https://www.youtube.com/watch?NR=1&v=QqzJhk1p4rU&feature=endscreen
      </Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddGroup}>
        Thêm Link
      </Button>

      {dataYoutobe?.map((_, index) => (
        <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
          <TextInput
            label={`Link Youtube ${index + 1}`}
            placeholder={"Nhập Link"}
            withAsterisk
            mt="md"
            type="text"
            value={dataYoutobe[index]?.linkYoutube?.toString()}
            onChange={(e) =>
              handleChangeValue(e.target.value, index, "linkYoutube")
            }
          />

          <TextInput
            label={`Mô tả (nếu có) `}
            placeholder={"Nhập mô tả"}
            mt="md"
            type="text"
            value={dataYoutobe[index]?.description?.toString()}
            onChange={(e) =>
              handleChangeValue(e.target.value, index, "description")
            }
          />

          <Button
            mt={"34px"}
            style={{ maxWidth: 80 }}
            type="button"
            color="red"
            onClick={() => handleRemoveGroup(index)}
          >
            Xóa
          </Button>
        </Group>
      ))}
      <Group
        justify="flex-end"
        mt="lg"
        p="10px 0"
        style={{ position: "sticky", bottom: 49, backgroundColor: "white" }}
      >
        <Button
          type="button"
          color="#3598dc"
          onClick={() => {
            onAddYoutobe(dataYoutobe);
          }}
        >
          Lưu
        </Button>

        <Button
          variant="outline"
          color="black"
          type="button"
          onClick={() => modals.closeAll()}
        >
          Đóng
        </Button>
      </Group>
    </Box>
  );
};

type ItemYoutobeProps = {
  onAddYoutobe: (data: any) => void;
  dataYoutube: TblItemYoutubeCommand[] | null;
};

export default ItemYoutubeCommand;
