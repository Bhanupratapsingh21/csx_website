import { Flex, IconButton, SmartLink, Text } from "@once-ui-system/core";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.scss";

const socialLinks = [
  {
    name: "Instagram",
    link: "https://www.instagram.com/csexplained/",
    icon: <FaInstagram />,
  },
  {
    name: "YouTube",
    link: "https://www.youtube.com/@csexplained",
    icon: <FaYoutube />,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/company/csexplained", // if you have one
    icon: <FaLinkedin />,
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      direction="column"
    >
      <Flex
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="between"
        vertical="center"
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text onBackground="neutral-weak">© {currentYear} /</Text>
          <Text paddingX="4">CSX Explained</Text>
          <Text onBackground="neutral-weak">
            / Built with ❤️

          </Text>
        </Text>
        <Flex gap="16">
          {socialLinks.map(
            (item) =>
              item.link && (
                <IconButton
                  key={item.name}
                  href={item.link}
                  icon={String(item.icon)}
                  tooltip={item.name}
                  size="s"
                  variant="ghost"
                />
              )
          )}
        </Flex>
      </Flex>
      <Flex height="80" />
    </Flex>
  );
};
