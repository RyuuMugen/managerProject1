import { showNotification, updateNotification } from "@mantine/notifications";
import {
  Icon2fa,
  IconAccessPoint,
  IconCheck,
  IconInbox,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
function Success(noti: string | undefined) {
  showNotification({
    title: "Thông báo",
    message: noti,
    icon: <IconCheck />,
    color: "green",
    // autoClose:100000,
    style: { borderBlockEndColor: "2px solid #e0e0e1" },
    //border-bottom: 1px solid #e0e0e1;
  });
}
function SuccessTimeonClose(noti: string, url: string) {
  showNotification({
    onClose: () => {
      window.location.href = url;
    },
    autoClose: 1000,
    title: "Thông báo",
    message: noti,
    icon: <IconCheck />,
    color: "green",
  });
}
function SuccessTimeonOpen(noti: string, url: string) {
  showNotification({
    onOpen: () => {
      window.location.href = url;
    },
    autoClose: 1000,
    title: "Thông báo",
    message: noti,
    icon: <IconCheck />,
    color: "green",
  });
}
function Fails(noti: string) {
  showNotification({
    title: "Thông báo",
    message: noti,
    icon: <IconX />,
    color: "red",
  });
}

function Info(noti: string) {
  showNotification({
    title: "Thông báo",
    message: noti,
    icon: <IconInfoCircle />,
    color: "blue",
  });
}

function Warn(noti: string) {
  showNotification({
    title: "Thông báo",
    message: noti,
    icon: <IconAccessPoint />,
    color: "orange",
  });
}

export const NotificationExtension = {
  Success,
  Fails,
  Info,
  Warn,
  SuccessTimeonClose,
  SuccessTimeonOpen,
};
