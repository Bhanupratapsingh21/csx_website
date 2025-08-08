"use client";

import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  Background,
  Column
} from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { mailchimp } from "@/resources";

type NewsletterProps = {
  display: boolean;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
};

export const Web3FormNewsletter = ({ newsletter }: { newsletter: NewsletterProps }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setTouched(true);
      setError("Please enter a valid email address.");
      return;
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.NEXT_PUBLIC_WEB_THREE_FORM_KEY,
        email,
        subject: "New Subscriber on CS Explained",
        from_name: "CS Explained",
      }),
    });

    if (res.ok) {
      setSubmitted(true);
      setEmail("");
      setError("");
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />

      <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
        {newsletter.title}
      </Heading>

      <Text
        style={{ position: "relative", maxWidth: "var(--responsive-width-xs)" }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {newsletter.description}
      </Text>

      {submitted ? (
        <Text onBackground="success-strong">Thanks for subscribing!</Text>
      ) : (
        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Flex fillWidth maxWidth={24} direction="column" gap="8">
            <Input
              id="mce-EMAIL"
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              errorMessage={touched && !validateEmail(email) ? error || "Invalid email." : ""}
              required
            />
            <Flex height="48" vertical="center">
              <Button type="submit" size="m" fillWidth>
                Subscribe
              </Button>
            </Flex>
          </Flex>
        </form>
      )}
    </Column>
  );
};
