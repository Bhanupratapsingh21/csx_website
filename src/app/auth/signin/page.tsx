"use client";
import React, { useMemo, useState } from "react";
import {
  Column,
  Flex,
  Input,
  Button,
  Text,
  useToast,
} from "@once-ui-system/core";
import { Client, Account } from "appwrite";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Helper to get Appwrite
const getAppwrite = () => {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string;
  const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string;
  if (!endpoint || !project) {
    throw new Error("Appwrite ENV missing.");
  }
  const client = new Client().setEndpoint(endpoint).setProject(project);
  return { account: new Account(client) };
};

interface LoginForm {
  email: string;
  password: string;
}

const initialState: LoginForm = {
  email: "",
  password: "",
};

export default function CSXLogin() {
  const [form, setForm] = useState<LoginForm>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const { addToast } = useToast();

  const appwriteReady = useMemo(() => {
    try {
      getAppwrite();
      return true;
    } catch {
      return false;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const { account } = getAppwrite();

      // Create session
      await account.createEmailPasswordSession(form.email, form.password);

      // Fetch user data
      const user = await account.get();

      // Update Zustand global state
      login({
        id: user.$id,
        name: user.name || "",
        email: user.email,
        avatar: "",
      });

      addToast({ variant: "success", message: "Login Successful" });
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex fillWidth minHeight="104" className="min-h-screen">
      <Column
        fillWidth
        className="flex-1"
        padding="xl"
        horizontal="center"
        align="center"
        background="transparent"
      >
        <Column maxWidth={24} gap="16" className="w-full">
          <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700 }}>
            Login to your CSX account
          </h1>
          <p style={{ textAlign: "center", color: "#666666" }}>
            Access projects, content breakdowns, and more.
          </p>

          {!appwriteReady && (
            <Text onBackground="danger-strong">
              Appwrite not configured. Set environment variables.
            </Text>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <Flex direction="column" gap="12" className="w-full">
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              {error && <Text onBackground="danger-strong">{error}</Text>}

              <Button
                type="submit"
                size="l"
                disabled={loading || !appwriteReady}
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  color: "#333333",
                  borderRadius: "0.75rem",
                  transition: "background-color 0.2s ease-in-out",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Text align="center" onBackground="neutral-weak">
                 Create New Account &nbsp;
                <Link href="/auth/signup">
                  Signup
                </Link>
              </Text>
            </Flex>
          </form>
        </Column>
      </Column>
    </Flex>
  );
}
