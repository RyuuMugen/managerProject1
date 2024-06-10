import {
  Box,
  Button,
  Group,
  LoadingOverlay,
  Text,
  TextInput,
} from "@mantine/core";
import React from "react";

const FormComponent: React.FC<any> = ({
  index,
  onChange,
  onDelete,
  listChildren,
}) => {
  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx="auto"
        mt={32}
      >
        <LoadingOverlay
          visible={false}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <Group grow wrap="nowrap" gap={"lg"}>
          <Text fw={600}>Giá trị {index + 1} :</Text>
        </Group>
        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label="Giá trị"
            placeholder="Enter value"
            withAsterisk
            type="text"
            value={listChildren[index]?.value}
            onChange={(event) => onChange("value", event.target.value, index)}
          />
          <TextInput
            label="Thứ tự"
            placeholder="Enter order number"
            withAsterisk
            type="number"
            value={listChildren[index]?.orderNumber}
            onChange={(event) =>
              onChange("orderNumber", event.target.value, index)
            }
          />
          <Button
            style={{ maxWidth: 100, marginTop: 20 }}
            type="button"
            color="#ED1B24"
            onClick={() => onDelete(index)}
          >
            Xóa
          </Button>
        </Group>
        <Group grow wrap="nowrap" gap={"lg"}>
          <TextInput
            label="Description"
            placeholder="Enter description"
            withAsterisk
            mt="md"
            type="text"
            value={listChildren[index]?.description}
            onChange={(event) =>
              onChange("description", event.target.value, index)
            }
          />

          <TextInput
            label="Status"
            maxLength={3}
            placeholder="Enter status"
            withAsterisk
            mt="md"
            type="text"
            value={listChildren[index]?.status}
            onChange={(event) => onChange("status", event.target.value, index)}
          />
          <></>
        </Group>
      </Box>
    </>
  );
};

export default FormComponent;
