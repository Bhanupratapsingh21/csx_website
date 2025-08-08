"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Fade,
  Flex,
  Line,
} from "@once-ui-system/core";

import { display, person } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";

// === Time Display Component ===
const TimeDisplay = ({
  timeZone,
  locale = "en-GB",
}: {
  timeZone: string;
  locale?: string;
}) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat(locale, options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

// === Header Component ===
export const Header = () => {
  return (
    <>
      {/* Blur Effects */}
      <Fade fillWidth position="fixed" height="80" zIndex={9} />
      <Fade fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9} />

      {/* Header Container */}
      <Flex
        as="header"
        fillWidth
        className={styles.position}
        position="fixed"
        zIndex={9}
        paddingX="16"
        paddingY="8"
        background="transparent"
        horizontal="end"
        vertical="center"
        data-border="rounded"
      >
        {/* Left: Location */}
        <Flex textVariant="body-default-s" color="neutral-weak">
          {true && person.location}
        </Flex>

        {/* Center: Theme Toggle only */}
        <Flex
          background="page"
          border="neutral-alpha-weak"
          radius="m-4"
          shadow="l"
          paddingX="12"

          horizontal="center"
          gap="4"
        >
          {display.themeSwitcher && <ThemeToggle />}
        </Flex>

        {/* Right: Time */}
        <Flex vertical="center" textVariant="body-default-s" color="neutral-weak">
          {display.time && <TimeDisplay timeZone={person.location} />}
        </Flex>
      </Flex>
    </>
  );
};
