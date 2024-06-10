import {
  Box,
  Button,
  Divider,
  FileInput,
  Group,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconFileCv } from "@tabler/icons-react";
import { useState } from "react";
import { TblItemImageCommand } from "../../../../model/ProductList";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import ImageShow from "../../../../_base/component/_image";

const ItemImageCommand = ({ onAddItemImage }: ItemImageProps) => {
  const [groupCount, setGroupCount] = useState(1); // Số lượng ô Group hiện tại
  const [dataImage, setDataImage] = useState<TblItemImageCommand[]>([]); // Lưu giữ giá trị của TextInput cho từng Group

  const handleAddGroup = () => {
    setGroupCount((prevCount) => prevCount + 1);
    setDataImage((prevData) => [
      ...prevData,
      {
        image: "",
        imageCode: "",
        imageName: "",
        orderNumber: 0,
        primaryImg: "N",
      },
    ]);
  };

  const icon = (
    <IconFileCv style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );

  const handleRemoveGroup = (index: number) => {
    setGroupCount((prevCount) => prevCount - 1);
    const newDataImage = [...dataImage];
    newDataImage.splice(index, 1);
    setDataImage(newDataImage);
  };

  const handleChangeValue = (
    value: string | File | null,
    index: number,
    field: string
  ) => {
    const newDataImage = [...dataImage];
    newDataImage[index] = {
      ...newDataImage[index],
      [field]: value,
    };
    setDataImage(newDataImage);
  };

  const handleChangeMainImage = (count: number) => {
    const newDataImage = dataImage?.map((item, index) => {
      if (index === count) {
        return { ...item, primaryImg: "Y" };
      } else {
        return { ...item, primaryImg: "N" };
      }
    });

    setDataImage(newDataImage);
  };

  const handleRemoveMainImage = (index: number) => {
    const newDataImage = [...dataImage];
    newDataImage[index] = {
      ...newDataImage[index],
      primaryImg: "N",
    };
    setDataImage(newDataImage);
  };

  const handleSaveForm = () => {
    const hasPrimaryImage = dataImage.some((image) => image.primaryImg === "Y");

    if (dataImage.length !== 0 && !hasPrimaryImage) {
      NotificationExtension.Fails(
        "Vui lòng chọn một ảnh làm ảnh chính trước khi lưu"
      );
      return;
    } else onAddItemImage(dataImage);
  };

  const getObjectURL = (image: string | File | null): string => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    } else return image as string;
  };

  const valueFileInput = (image: string | File | null): File | null => {
    if (image instanceof File) {
      return image;
    } else return null;
  };

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
        Chú ý :
      </Text>
      <Text fw={400}>
        - Ảnh Sản phẩm kích thước lớn sẽ được tự động co lại thành các ảnh nhỏ
        hơn cho những vị trí liên quan. <br />
        Tùy giao diện website của bạn mà kích thước ảnh Sản phẩm khác nhau
        <br />
        - Chỉ dùng file ảnh đuôi .jpg và .gif. <br />- Cập nhật hình ảnh cho Sản
        phẩm ở nhiều góc cạnh, màu sắc để người dùng xem rõ nhất. Nên cập nhật
        ảnh có kích thước lớn và độ phân giải cao.
      </Text>
      <Button mt={24} type="button" color="#3598dc" onClick={handleAddGroup}>
        Thêm ảnh
      </Button>

      {[...Array(groupCount)].map((_, index) => (
        <>
          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <FileInput
              leftSection={icon}
              label="Ảnh sản phẩm"
              placeholder="Chọn tệp..."
              leftSectionPointerEvents="none"
              accept="image/png,image/jpeg"
              value={valueFileInput(dataImage[index]?.image)}
              onChange={(e) => handleChangeValue(e, index, "image")}
            />
            {dataImage[index]?.image ? (
              <ImageShow
                h={200}
                w={200}
                img={getObjectURL(dataImage[index]?.image)}
              />
            ) : (
              <Box></Box>
            )}
          </Group>

          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <TextInput
              label="Mã ảnh"
              placeholder="Mã ảnh..."
              type="text"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "imageCode")
              }
              value={dataImage[index]?.imageCode?.toString()}
            />

            {dataImage[index]?.primaryImg! === "Y" ? (
              <Button
                mt={"24px"}
                style={{ maxWidth: 130 }}
                type="button"
                color="red"
                onClick={() => handleRemoveMainImage(index)}
              >
                Bỏ ảnh chính
              </Button>
            ) : (
              <Button
                mt={"24px"}
                style={{ maxWidth: 130 }}
                type="button"
                color="blue"
                onClick={() => handleChangeMainImage(index)}
              >
                Chọn ảnh chính
              </Button>
            )}
          </Group>

          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <TextInput
              label="Alt của ảnh"
              placeholder="Alt của ảnh..."
              type="text"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "imageName")
              }
              value={dataImage[index]?.imageName?.toString()}
            />

            <Button
              mt={"24px"}
              style={{ maxWidth: 80 }}
              type="button"
              color="red"
              onClick={() => handleRemoveGroup(index)}
            >
              Xóa
            </Button>
          </Group>
          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <TextInput
              label="STT"
              placeholder="Nhập số STT"
              type="number"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "orderNumber")
              }
              value={dataImage[index]?.orderNumber || 0}
            />
            <></>
          </Group>
          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <TextInput
              label="Width"
              placeholder="Nhập chiều rộng của ảnh"
              type="number"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "imageWidth")
              }
              value={dataImage[index]?.imageWidth || 0}
            />
            <TextInput
              label="Height"
              placeholder="Nhập chiều cao của ảnh"
              type="number"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "imageHeight")
              }
              value={dataImage[index]?.imageHeight || 0}
            />
          </Group>
          <Divider style={{ marginTop: 24 }} />
        </>
      ))}
      <Group
        justify="flex-end"
        mt="lg"
        p="10px 0"
        style={{ position: "sticky", bottom: 45, backgroundColor: "white" }}
      >
        <Button
          type="button"
          color="#3598dc"
          onClick={() => {
            handleSaveForm();
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

export default ItemImageCommand;

type ItemImageProps = {
  onAddItemImage: (data: any) => void;
};
