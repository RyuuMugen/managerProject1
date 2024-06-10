import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  euiPaletteColorBlindBehindText
} from "@elastic/eui";
import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";
import { NotificationExtension } from "../../../../_base/extension/NotificationExtension";
import {
  isNullOrUndefined
} from "../../../../_base/extension/StringExtension";
import CreatePrePay from "./CreatePrePay";
import DeletePrePay from "./DeletePrePay";
import EditPrePay from "./EditPrePay";
import { tblInstallmentPayCommands } from "../../../../model/TblInstallment";




interface dataPrePayProp {
  itemid: number;
  data: tblInstallmentPayCommands[];
  onSearch: () => void;
}

const PrePayList = ({ itemid, data, onSearch }: dataPrePayProp) => {
  const [deleteViewStatus, setDeleteViewStatus] = useState(0);

  const handleDeleteViewClose = (status: number) => {
    setDeleteViewStatus(status);
  };

  function editPrePayItem(id: number, prepayid: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa thông tin trả trước</Title>
        </>
      ),

      children: (
        <EditPrePay
          id={id}
          prepayid={prepayid}
          onClose={handleDeleteViewClose}
          onSearch={onSearch}
          // load={deleteViewStatus}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  function createPrePayItem(id: number) {
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm thông tin trả trước</Title>
          </div>
        </>
      ),
      children: (
        <CreatePrePay
          id={id}
          onClose={handleDeleteViewClose}
          load={deleteViewStatus}
          onSearch={onSearch}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  function deletePrePayItem(id: number, prepayid: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xoá Thông tin trả trước</Title>
        </>
      ),
      children: (
        <DeletePrePay
          onSearch={() => onSearch()}
          idItem={id}
          prepayid={prepayid}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  return (
    <div>
      <span>Trả trước:</span>
      <span
        style={{
          color: "blue",
          cursor: "pointer",
          textDecoration: "underline",
        }}
        onClick={(e: any) => {
          if (isNullOrUndefined(itemid))
            NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
          else {
            createPrePayItem(itemid);
          }
        }}
      >
        (Thêm trả trước)
      </span>

      <table
        style={{
          borderCollapse: "collapse",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <tbody>
          {data.map((item) => (
            <td>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  {item.installmentName}
                </td>
              </tr>
              <tr>
                <td
                  style={{ border: "1px solid black", padding: "6px" }}
                >{`${item.prepayment}%`}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid black", padding: "6px" }}>
                  <EuiFlexGroup
                    responsive={true}
                    wrap={false}
                    gutterSize="s"
                    alignItems="center"
                  >
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon
                        iconType="documentEdit"
                        aria-label="Dashboard"
                        color="success"
                        onClick={(e: any) => {
                          if (isNullOrUndefined(itemid))
                            NotificationExtension.Warn(
                              "Xin vui lòng chọn dữ liệu !"
                            );
                          else {
                            editPrePayItem(itemid, item.id);
                          }
                        }}
                      />
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon
                        iconType="trash"
                        color="danger"
                        onClick={(e: any) => {
                          if (isNullOrUndefined(data))
                            NotificationExtension.Warn(
                              "Xin vui lòng chọn dữ liệu !"
                            );
                          else {
                            deletePrePayItem(itemid, item.id);
                          }
                        }}
                      />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </td>
              </tr>
            </td>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrePayList;
