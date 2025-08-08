import React from "react";
import {
  Heading,
  Flex,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Meta,
  Schema
} from "@once-ui-system/core";
import {
  home,
  about,
  person,
  baseURL,
  routes,
} from "@/resources";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import Image from "next/image";
import { VideoCarousel } from "@/components/videos/Videos";
import { Web3FormNewsletter } from "@/components/Mailchimp";
import PeopleWhoInspiredMe from "@/components/inspire";

export default function Home() {

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title="CS Explained - Learn. Build. Grow."
        description="CS Explained is a student-powered tech community creating impactful content across YouTube & Instagram. Join us and level up your Computer Science journey."
        image={`/api/og/generate?title=${encodeURIComponent(
          "CS Explained - Learn. Build. Grow."
        )}`}
        author={{
          name: "CS Explained Team",
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* === HERO SECTION === */}
      <Column fillWidth paddingY="24" gap="m" className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-weak/10 via-transparent to-brand-alpha-weak/5" />

        <Column maxWidth="s" horizontal="center" align="center">
          {/* Logo */}


          <RevealFx paddingBottom="16">
            <Badge
              background="brand-alpha-weak"
              paddingX="12"
              paddingY="4"
              onBackground="neutral-strong"
              textVariant="label-default-s"
              arrow={false}
              href="https://www.instagram.com/csexplained/"
              className="mx-auto"
            >
              <Row paddingY="2">📣 Follow us on Instagram & YouTube</Row>
            </Badge>
          </RevealFx>

          <RevealFx translateY="4" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l" className="bg-gradient-to-r from-brand-strong to-brand-weak bg-clip-text text-transparent">
              Learn. Build. Grow.
            </Heading>
          </RevealFx>

          <RevealFx translateY="8" delay={0.2} paddingBottom="32">
            <Text
              align="left"
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-xl"
              className="max-w-2xl"
            >
              CSX Explained is your go-to student community for mastering Computer Science.
              Explore hands-on projects, content breakdowns, and peer support — all in one place.
            </Text>
          </RevealFx>

          <RevealFx delay={0.4} className="w-full">
            <Flex gap="12" horizontal="center" className="flex-wrap">
              <Button
                id="join-community"
                href="https://www.instagram.com/csexplained/"
                variant="primary"
                size="m"
                weight="strong"
                arrowIcon
                className="flex-1 min-w-[200px]"
              >
                Join the Community
              </Button>

              <Button
                id="watch-youtube"
                href="https://www.youtube.com/@CSExplained_official"
                variant="secondary"
                size="m"
                weight="default"
                arrowIcon
                className="flex-1 min-w-[200px]"
              >
                Watch on YouTube
              </Button>
            </Flex>
          </RevealFx>
        </Column>
      </Column>

      <Column fillWidth gap="24" className="relative py-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-brand-weak/5 to-transparent" />

        <RevealFx>
          <Heading
            as="h2"
            variant="display-strong-xs"
            wrap="balance"
            className="text-center"
          >
            Latest from Our Youtube
          </Heading>
        </RevealFx>

        <RevealFx translateY="16" delay={0.6} className="w-full">
          <VideoCarousel />
        </RevealFx>
      </Column>

      {routes["/blog"] && (
        <Column fillWidth gap="24" className="relative py-12">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-brand-weak/5 to-transparent" />

          <RevealFx>
            <Heading
              as="h2"
              variant="display-strong-xs"
              wrap="balance"
              className="text-center"
            >
              Blog's By Our Student's
            </Heading>
          </RevealFx>

          <RevealFx delay={0.2}>
            <Posts range={[1, 2]} columns="2" />
          </RevealFx>
        </Column>
      )}

      <RevealFx delay={0.6} className="w-full">
        <Web3FormNewsletter
          newsletter={{
            display: true,
            title: "Join the CSX Explained Community",
            description: "Subscribe to get updates on student-friendly tech content, workshops, internships, and more.",
          }}
        />

      </RevealFx>

    </Column>
  );
}