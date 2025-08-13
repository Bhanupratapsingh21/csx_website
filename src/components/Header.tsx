"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookText, Grid3x3, Home, User, User as UserIcon } from "lucide-react";

import { Fade, Flex, Line, ToggleButton } from "@once-ui-system/core";

import { routes, display, person, blog, work } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.scss";
import { useAuthStore } from "@/store/auth";

// Clock Component
type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({ timeZone, locale = "en-GB" }) => {
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
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export const Header = () => {
  const pathname = usePathname() ?? "";
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Fade hidden fillWidth position="fixed" height="80" zIndex={9} />
      <Fade fillWidth position="fixed" bottom="0" to="top" height="80" zIndex={9} />
      <Flex
        fitHeight
        position="unset"
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
      >

        {/* Center - Navigation */}
        <Flex fillWidth horizontal="center">
          <Flex
            background="page"
            border="neutral-alpha-weak"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Flex gap="8" vertical="center" textVariant="body-default-s" suppressHydrationWarning>
              <Link
                href="/"
                className={`p-2 rounded-full ${pathname === "/"
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <Home
                  size={20}
                  className={pathname === "/"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                  }
                />
              </Link>



              {/* Work */}
              <Link
                href="/work"
                className={`p-2 rounded-full ${pathname.startsWith("/work")
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <Grid3x3
                  size={20}
                  className={pathname.startsWith("/work")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                  }
                />
              </Link>
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* Blog */}
              <Link
                href="/blogs"
                className={`p-2 rounded-full ${pathname.startsWith("/blogs")
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <BookText
                  size={20}
                  className={pathname.startsWith("/blogs")
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300"
                  }
                />
              </Link>

              {/* User */}
              <Link
                href={user ? "/profile" : "/auth/signup"}
                className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <User
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </Link>



            </Flex>
          </Flex>
        </Flex>

        {/* Right side - Time + Auth */}

      </Flex>
    </>
  );
};
