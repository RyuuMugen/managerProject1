import {
  Box,
  Button,
  Divider,
  FileInput,
  Group,
  Select,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconFileCv } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ImageShow from "../../../_base/component/_image";
import { urlToImageFile } from "../../../_base/helper/FunctionHelper";
import { listTblCategoryImage } from "../../../model/TblCategoryModel";

const ListTblCategoryImageView = ({
  dataCategoryImage,
  onAddCategoryImage,
}: ListTblCategoryImageViewProps) => {
  const [groupCount, setGroupCount] = useState(0);
  const [dataImage, setDataImage] = useState<listTblCategoryImage[]>([]);
  const [isImageChange, setIsImageChange] = useState<boolean[]>([]);

  const handleAddGroup = () => {
    setGroupCount((prevCount) => prevCount + 1);
    setDataImage((prevData) => [
      ...prevData,
      {
        id: 0,
        imageCode: null,
        imageName: null,
        description: null,
        image: null,
        status: null,
        title: null,
        linkUrl: null,
        imageGroup: null,
        orgId: null,
        categoryId: null,
        createdBy: null,
        lastUpdateDate: null,
        lastUpdatedBy: null,
        lastUpdateLogin: null,
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

    if (field === "image") {
      setIsImageChange((prevData) => {
        const newData = [...prevData];
        newData[index] = true;
        return newData;
      });
    }

    setDataImage(newDataImage);
  };

  const handleSaveForm = () => {
    onAddCategoryImage(dataImage, isImageChange);
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

  useEffect(() => {
    const getDataImage = async () => {
      if (dataCategoryImage) {
        const updatedDataImage = await Promise.all(
          dataCategoryImage.map(async (item) => {
            if (
              item.image !== null &&
              item.image !== undefined &&
              typeof item.image === "string"
            ) {
              item.image = await urlToImageFile(item.image);
            }
            return item;
          })
        );
        setDataImage(updatedDataImage);
        setGroupCount(dataCategoryImage.length);
      }
    };
    getDataImage();
  }, [dataCategoryImage]);

  return (
    <Box className="flex-none" component="form" miw={1100} maw={1100} mx="auto">
      <Text mt={24} fw={600}>
        Chú ý :
      </Text>
      <Text fw={400}>
        - Ảnh Sản phẩm kích thước lớn sẽ được tự động co lại thành các ảnh nhỏ
        hơn cho những vị trí liên quan.
        <br />
        - Chỉ dùng file ảnh đuôi .jpg và .gif. <br />
      </Text>

      {/* Render các Group dựa trên số lượng đã được xác định */}
      {[...Array(groupCount)].map((_, index) => (
        <>
          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <FileInput
              leftSection={icon}
              label="Ảnh sản phẩm"
              placeholder="Chọn tệp..."
              accept="image/png,image/jpeg"
              leftSectionPointerEvents="none"
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
              label="Tên ảnh"
              placeholder="Tên ảnh..."
              type="text"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "imageName")
              }
              value={dataImage[index]?.imageName?.toString()}
            />
            <Select
              label={"Đang sử dụng"}
              placeholder={"Banner Right/Image Right/Image Bottom"}
              data={[
                { value: "BR", label: "Banner Right" },
                { value: "IR", label: "Image Right" },
                { value: "IB", label: "Image Bottom" },
              ]}
              value={dataImage[index]?.status || ""}
              onChange={(e) => handleChangeValue(e, index, "status")}
            />
          </Group>
          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <TextInput
              label="Tiêu đề"
              placeholder="Tiêu đề"
              type="text"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "title")
              }
              value={dataImage[index]?.title || ""}
            />
            <TextInput
              label="Mô tả"
              placeholder="Mô tả"
              type="text"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "description")
              }
              value={dataImage[index]?.description?.toString()}
            />
          </Group>
          <Group key={index} grow wrap="nowrap" mt="xs" gap={"lg"}>
            <TextInput
              label="link Url"
              placeholder="link Url"
              type="text"
              onChange={(e) =>
                handleChangeValue(e.target.value, index, "linkUrl")
              }
              value={dataImage[index]?.linkUrl?.toString()}
            />
          </Group>

          <Divider style={{ marginTop: 24 }} />
        </>
      ))}

      <Button mt={24} type="button" color="#3598dc" onClick={handleAddGroup}>
        Thêm ảnh
      </Button>
      <Group justify="flex-end" mt="lg">
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

export default ListTblCategoryImageView;

type ListTblCategoryImageViewProps = {
  dataCategoryImage: listTblCategoryImage[] | null;
  onAddCategoryImage: (
    data: listTblCategoryImage[],
    isImageChange: boolean[]
  ) => void;
};
