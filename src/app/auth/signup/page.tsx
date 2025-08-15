"use client";
import React, { useMemo, useState } from "react";
import {
  Background,
  Badge,
  Button,
  Checkbox,
  Column,
  Flex,
  Heading,
  Input,
  Row,
  Select,
  Text,
  useToast,
} from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { mailchimp } from "@/resources"; // reusing your gradient/dots config
import { Client, Account, ID, Databases } from "appwrite";
import styles from "@/components/about/about.module.scss";
// Optional: if you have a RevealFx component available from your UI kit
// comment this line in and ensure the import is correct. Otherwise, the inline animation can be skipped.
// import { RevealFx } from "@once-ui-system/experimental";
import { useAuthStore } from "@/store/auth"; // adjust path as needed
import { useRouter } from "next/navigation";
import Link from "next/link";
// Small helper for classNames without pulling a lib
const cx = (...arr: (string | false | undefined)[]) => arr.filter(Boolean).join(" ");

// Environment-driven Appwrite setup to avoid hardcoding
const getAppwrite = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string | undefined;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string | undefined;

  if (!endpoint || !project) {
    throw new Error(
      "Appwrite ENV missing. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID."
    );
  }

  const client = new Client().setEndpoint(endpoint).setProject(project);
  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
  };
};

// Types for form state
type CodingLevel = "beginner" | "intermediate" | "advanced";

interface FormState {
  username: string;
  email: string;
  password: string;
  mobile: string;
  github: string;
  onWhatsapp: boolean;
  codingLevel: CodingLevel;
}

const initialState: FormState = {
  username: "",
  email: "",
  password: "",
  mobile: "",
  github: "",
  onWhatsapp: true,
  codingLevel: "beginner",
};

export default function CSXSignup() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const { addToast } = useToast();
  const appwriteReady = useMemo(() => {
    try {
      getAppwrite();
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone);
  const validatePassword = (pwd: string) => pwd.length >= 8;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(form.password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (form.mobile && !validatePhone(form.mobile)) {
      setError("Please enter a valid phone number (7–15 digits, optional '+').");
      return;
    }

    try {
      setLoading(true);
      const { account, databases } = getAppwrite();

      // 1) Create the auth account
      const user = await account.create(
        ID.unique(),
        form.email,
        form.password,
        form.username,
      );

      // 2) Optionally create a profile document with extra metadata
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string | undefined;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID as string | undefined;

      if (databaseId && collectionId) {
        await databases.createDocument(databaseId, collectionId, ID.unique(), {
          userId: user.$id,
          username: form.username,
          email: form.email,
          mobile: form.mobile,
          github: form.github,
          onWhatsapp: form.onWhatsapp,
          codingLevel: form.codingLevel,
        });
      }

      // 3) Create a session (optional). Remove if you prefer email verification first.
      await account.createEmailPasswordSession(form.email, form.password);

      setSuccess("Welcome to CSX! Your account has been created.");
      login({
        id: user.$id,
        name: form.username,
        email: form.email,
        avatar: "", // You can update this with a real avatar if you store one
      });
      setForm(initialState);
      addToast({ "variant": "success", "message": "Account Created Successfully" })

      router.push("/"); // redirect to dashboard
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex fillWidth minHeight="104" className="min-h-screen" >

      {/* RIGHT: Signup Form */}
      <Column
        fillWidth
        className="flex-1"
        padding="xl"
        horizontal="center"
        align="center"
        background="transparent"
      >
        <Column maxWidth={24} gap="16" className="w-full">
          <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>
            Create your CSX account
          </h1>
          <p style={{ textAlign: "center", color: "#666666", fontSize: "1rem", lineHeight: 1.5 }}>
            Join the community to access projects, content breakdowns, and more.
          </p>

          {!appwriteReady && (
            <Text onBackground="danger-strong">
              Appwrite environment not configured. Set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID.
            </Text>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <Flex direction="column" gap="12" className="w-full">
              <Input
                id="username"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
              />

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Use PasswordInput if available; otherwise fallback to Input */}
              {/* <PasswordInput id="password" label="Password" value={form.password} onChange={(e)=> setForm(f=>({...f, password: e.target.value}))} required /> */}
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password (min 8 chars)"
                value={form.password}
                onChange={handleChange}
                required
              />

              <Input
                id="mobile"
                name="mobile"
                placeholder="Mobile number (optional)"
                value={form.mobile}
                onChange={handleChange}
              />

              <Input
                id="github"
                name="github"
                placeholder="GitHub username (optional)"
                value={form.github}
                onChange={handleChange}
              />


              <Select
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
                id="codingLevel"
                label="Coding Level"
                name="codingLevel"
                value={form.codingLevel}
                onChange={handleChange}
              />


              <Checkbox
                label="Join WhatsApp community"
                checked={form.onWhatsapp}
                onChange={(e) => setForm({ ...form, onWhatsapp: e.target.checked })}
              />

              {error && (
                <Text onBackground="danger-strong">{error}</Text>
              )}
              {success && (
                <Text onBackground="success-strong">{success}</Text>
              )}

              <Button
                type="submit"
                size="l"
                disabled={loading || !appwriteReady}
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  color: "#333333", // replace with your neutral-strong color
                  borderRadius: "0.75rem",
                  transition: "background-color 0.2s ease-in-out",
                  outline: "none"
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    Creating account...
                  </span>
                ) : (
                  "Sign up"
                )}
              </Button>

              <Text align="center" onBackground="neutral-weak">
                By signing up, you agree to our Terms and Privacy Policy.
              </Text>
              <Text align="center" onBackground="neutral-weak">
                Already Have a Account <br />&nbsp;
                <Link href="/auth/signin">
                  Signin
                </Link>
              </Text>

            </Flex>
          </form>
        </Column>
      </Column>
    </Flex>
  );
}
