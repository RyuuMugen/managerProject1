import { Button, Flex, Group, Text, Textarea } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { TblConfigWebBanIP } from "../../../model/TblConfigWeb";

const ConfigWebBanIp = ({
  dataBanIP,
  handelChangeConfigWebBanIP,
  handleEditConfigWeb,
}: ConfigWebBanIpProps) => {
  return (
    <div>
      <Text mt={"sm"}>
        Chức năng này cho phép bạn ngăn chặn một số địa chỉ IP truy cập vào
        website. Thường dùng để chặn đối thủ hoặc những người có mục đích xấu
        muốn phá hoại website của bạn
      </Text>
      <Group display={"flex"} mt={"xs"}>
        <Text fw={600}>Nhập IP cần cấm (mỗi IP 1 dòng)</Text>
        <Text>
          (Bạn có thể xem địa chỉ IP tại Báo cáo truy cập. Để loại bỏ IP khỏi
          danh sách cấm, xóa IP trong danh sách và cập nhật lại.)
        </Text>
      </Group>
      <Flex gap={"xl"} mt={"md"}>
        <Flex direction={"column"}>
          <Text>Hỗ trợ các định dạng:</Text>
          <Text>127.0.0.1</Text>
          <Text>172.0.0.*</Text>
          <Text>173.0.*.*</Text>
          <Text>126.1.0.0/24</Text>
          <Text>125.0.0.1-125.0.0.9</Text>
        </Flex>

        <Textarea
          autosize
          size="md"
          minRows={15}
          style={{ minWidth: 280 }}
          value={dataBanIP?.ipAddress || ""}
          onChange={(event) =>
            handelChangeConfigWebBanIP(event.currentTarget.value)
          }
        />
      </Flex>

      <Button
        type="button"
        color="#3598dc"
        onClick={handleEditConfigWeb}
        leftSection={<IconEdit size={18} />}
      >
        Cập nhật
      </Button>
    </div>
  );
};

export default ConfigWebBanIp;

type ConfigWebBanIpProps = {
  dataBanIP: TblConfigWebBanIP | null;
  handelChangeConfigWebBanIP: (value: string) => void;
  handleEditConfigWeb: () => void;
};
