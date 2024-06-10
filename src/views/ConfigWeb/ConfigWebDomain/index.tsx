import { Pagination } from "@elastic/eui";
import { Box, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { TblConfigWebDomain } from "../../../model/TblConfigWeb";

const ConfigWebDomain = ({
  dataDomain,
  handelChangeConfigWebDomain,
}: ConfigWebDomainProps) => {
  const entity: TblConfigWebDomain = {
    domain: null,
    primaryDomain: null,
    creationDate: null,
    createdBy: null,
    lastUpdateDate: null,
    lastUpdatedBy: null,
  };

  const form = useForm<TblConfigWebDomain>({
    initialValues: {
      ...entity,
    },

    validate: {},
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [isSelectedItem, setSelectedItems] = useState<TblConfigWebDomain[]>([]);

  useEffect(() => {
    if (dataDomain) form.setValues(dataDomain);
  }, [dataDomain]);

  return (
    <>
      <Box
        className="flex-none"
        component="form"
        miw={1200}
        maw={1200}
        mx={"sm"}
        mb={"md"}
        onSubmit={form.onSubmit((e: TblConfigWebDomain) => {
          handelChangeConfigWebDomain(e);
        })}
      >
        <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
          <TextInput
            label={"Tên miền"}
            placeholder={"Nhập tên"}
            withAsterisk
            type="text"
            {...form.getInputProps("domain")}
          />
          <></>
        </Group>

        <Group grow wrap="nowrap" mt="xs" gap={"lg"}>
          <TextInput
            label={"Tên miền chính"}
            placeholder={"Nhập tên"}
            withAsterisk
            type="text"
            {...form.getInputProps("primaryDomain")}
          />
          <></>
        </Group>

        <Group justify="start" mt="md">
          <Button
            type="submit"
            color="#3598dc"
            leftSection={<IconEdit size={18} />}
          >
            Cập nhật
          </Button>
          <></>
        </Group>
      </Box>
    </>
  );
};

export default ConfigWebDomain;

type ConfigWebDomainProps = {
  dataDomain: TblConfigWebDomain | null;
  handelChangeConfigWebDomain: (value: TblConfigWebDomain) => void;
};
