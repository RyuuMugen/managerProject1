import { useState } from "react";
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { IconCalendarStats, IconChevronRight } from "@tabler/icons-react";
import classes from "../../_style/NavbarLinksGroup.module.css";
import { LinksGroupProps } from "../../model/_base/LinksGroupProps";
import { useNavigate, useLocation } from "react-router-dom";

export function LinksGroup({
  icon: Icon,
  label,
  initiallyOpened,
  links,
}: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const formatLink = (link: any) => {
    // Nếu link không chứa "/", thêm "/" vào đầu
    return link.startsWith("/") ? link : `/${link}`;
  };
  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(link.link);
        console.log(pathname);
      }}
      style={{
        color: formatLink(link.link) === pathname ? "#006bb8" : "black",
        backgroundColor:
          formatLink(link.link) === pathname
            ? "rgba(0,119,204,0.2)"
            : "initial",
      }}
    >
      {link.label}
    </Text>
  ));
  const handleClick = (event: any) => {
    event.preventDefault();
    if (links && links.length > 0 && links[0].link) {
      navigate(links[0].link);
    }
    console.log(pathname);
  };
  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group justify="space-between" gap={0}>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <ThemeIcon variant="light" size={30}>
              <Icon style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Box ml="md" onClick={handleClick}>
              {label}
            </Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

// const mockdata = {
//   label: 'Releases',
//   icon: IconCalendarStats,
//   links: [
//     { label: 'Upcoming releases', link: '/' },
//     { label: 'Previous releases', link: '/' },
//     { label: 'Releases schedule', link: '/' },
//   ],
// };

// export function NavbarLinksGroup() {
//   return (
//     <Box mih={220} p="md">
//       <LinksGroup {...mockdata} />
//     </Box>
//   );
// }
