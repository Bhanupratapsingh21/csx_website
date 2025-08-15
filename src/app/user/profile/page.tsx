"use client";
import React, { useEffect, useState } from "react";
import { Client, Account, ID, Databases, Query } from "appwrite";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import {
    Heading,
    Flex,
    Text,
    Button,
    Avatar,
    Column,
    Row,
    Card,
    Input,
    Textarea,
    Select,
    Checkbox,
    Badge,
    Spinner,
    useToast,
} from "@once-ui-system/core";

type CodingLevel = "beginner" | "intermediate" | "advanced";

interface ProfileData {
    username: string;
    email: string;
    mobile: string;
    github: string;
    onWhatsapp: boolean;
    codingLevel: CodingLevel;
    bio?: string;
    avatar?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>("");
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const { addToast } = useToast();

    // Appwrite setup
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

    // Validation functions
    const validatePhone = (phone: string) => /^\+?[0-9]{7,15}$/.test(phone);

    // Fetch profile data
    useEffect(() => {
        if (!user) {
            router.push("/auth/signin");
            return;
        }

        const fetchProfile = async () => {
            try {
                const { databases } = getAppwrite();
                const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string;
                const collectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID as string;

                const response = await databases.listDocuments(databaseId, collectionId, [
                    Query.equal("userId", user.id),
                ]);

                if (response.documents.length > 0) {
                    const doc = response.documents[0];
                    setProfile({
                        username: doc.username,
                        email: doc.email,
                        mobile: doc.mobile || "",
                        github: doc.github || "",
                        onWhatsapp: doc.onWhatsapp || false,
                        codingLevel: doc.codingLevel || "beginner",
                        bio: doc.bio || "",
                        avatar: doc.avatar || "",
                    });
                } else {
                    setProfile({
                        username: user.name || "",
                        email: user.email || "",
                        mobile: "",
                        github: "",
                        onWhatsapp: false,
                        codingLevel: "beginner",
                        bio: "",
                        avatar: user.avatar || "",
                    });
                }
            } catch (err: any) {
                console.error("Failed to fetch profile:", err);
                setError(err?.message || "Failed to load profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, router]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setProfile((prev) => ({
            ...prev!,
            [name]: type === "checkbox" ? checked : value,
        }));
        setError("");
    };

    const handleSave = async () => {
        if (!profile || !user) return;

        if (profile.mobile && !validatePhone(profile.mobile)) {
            setError("Please enter a valid phone number (7–15 digits, optional '+').");
            return;
        }

        try {
            setSaving(true);
            setError("");
            const { databases } = getAppwrite();
            const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string;
            const collectionId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID as string;

            const response = await databases.listDocuments(databaseId, collectionId, [
                Query.equal("userId", user.id),
            ]);

            if (response.documents.length > 0) {
                await databases.updateDocument(databaseId, collectionId, response.documents[0].$id, {
                    username: profile.username,
                    mobile: profile.mobile,
                    github: profile.github,
                    onWhatsapp: profile.onWhatsapp,
                    codingLevel: profile.codingLevel,
                    bio: profile.bio,
                    avatar: profile.avatar,
                });
            } else {
                await databases.createDocument(databaseId, collectionId, ID.unique(), {
                    userId: user.id,
                    username: profile.username,
                    email: profile.email,
                    mobile: profile.mobile,
                    github: profile.github,
                    onWhatsapp: profile.onWhatsapp,
                    codingLevel: profile.codingLevel,
                    bio: profile.bio,
                    avatar: profile.avatar,
                });
            }

            if (profile.username !== user.name) {
                useAuthStore.setState({
                    user: {
                        ...user,
                        name: profile.username,
                        avatar: profile.avatar,
                    },
                });
            }

            setEditing(false);
            addToast({ variant: "success", message: "Profile updated successfully" });
        } catch (err: any) {
            console.error("Failed to save profile:", err);
            setError(err?.message || "Failed to save profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            const { account } = getAppwrite();
            await account.deleteSession("current");
            logout();
            ("/login");
            addToast({ variant: "success", message: "Logged out successfully" });
        } catch (err: any) {
            console.error("Logout failed:", err);
            setError(err?.message || "Logout failed. Please try again.");
        }
    };

    if (loading) {
        return (
            <Flex fillWidth minHeight="104" content="center" align="center">
                <Spinner size="l" />
            </Flex>
        );
    }

    if (!profile) {
        return (
            <Flex fillWidth minHeight="104" content="center" align="center" >
                <Text onBackground="danger-strong">Unable to load profile data.</Text>
            </Flex>
        );
    }

    return (
        <Flex fillWidth minHeight="104" className="min-h-screen">
            <Column
                fillWidth

                horizontal="center"
                align="center"
                background="transparent"
            >
                <Column gap="16" className="w-full">
                    <Heading
                        as="h1"
                        style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}
                    >
                        Your CSX Profile
                    </Heading>
                    <Text
                        style={{ textAlign: "center", color: "#666666", fontSize: "1rem", lineHeight: 1.5 }}
                    >
                        Manage your account details and preferences.
                    </Text>

                    {error && (
                        <Text onBackground="danger-strong" align="center">
                            {error}
                        </Text>
                    )}

                    <Card padding="l" border="transparent" radius="l-4">
                        <Flex direction="column" gap="12">
                            <Row gap="2"  align="center">
                                <Column>
                                    <Text weight="strong" >Username : {profile.username}</Text>
                                    <Text onBackground="neutral-weak">Email : {profile.email}</Text>
                                </Column>
                            </Row>

                            {editing ? (
                                <Flex direction="column" gap="12">
                                    <Input
                                        id="username"
                                        name="username"
                                        label="Username"
                                        value={profile.username}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <Input
                                        id="email"
                                        name="email"
                                        label="Email"
                                        value={profile.email}
                                        disabled

                                    />
                                    <Input
                                        id="mobile"
                                        name="mobile"
                                        label="Mobile number (optional)"
                                        value={profile.mobile}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        id="github"
                                        name="github"
                                        label="GitHub username (optional)"
                                        value={profile.github}
                                        onChange={handleInputChange}
                                    />
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        label="Bio (optional)"
                                        value={profile.bio}
                                        onChange={handleInputChange}
                                        rows={4}
                                    />
                                    <Select
                                        id="codingLevel"
                                        name="codingLevel"
                                        label="Coding Level"
                                        value={profile.codingLevel}
                                        onChange={handleInputChange}
                                        options={[
                                            { value: "beginner", label: "Beginner" },
                                            { value: "intermediate", label: "Intermediate" },
                                            { value: "advanced", label: "Advanced" },
                                        ]}
                                    />
                                    <Checkbox
                                        id="onWhatsapp"
                                        name="onWhatsapp"
                                        label="Join WhatsApp community"
                                        checked={profile.onWhatsapp}
                                        onChange={handleInputChange}
                                    />
                                    <Row gap="8" content="end">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setEditing(false)}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={handleSave}
                                            disabled={saving}
                                            style={{
                                                backgroundColor: "white",
                                                color: "#333333",
                                                borderRadius: "0.75rem",
                                                transition: "background-color 0.2s ease-in-out",
                                                outline: "none",
                                            }}
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </Row>
                                </Flex>
                            ) : (
                                <Flex direction="column" gap="12">
                                    <Row gap="8">
                                        <Text weight="strong" style={{ width: "120px" }}>
                                            Mobile:
                                        </Text>
                                        <Text>{profile.mobile || "Not set"}</Text>
                                    </Row>
                                    <Row gap="8">
                                        <Text weight="strong" style={{ width: "120px" }}>
                                            GitHub:
                                        </Text>
                                        <Text>
                                            {profile.github ? (
                                                <a
                                                    href={`https://github.com/${profile.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: "#0066cc", textDecoration: "underline" }}
                                                >
                                                    {profile.github}
                                                </a>
                                            ) : (
                                                "Not set"
                                            )}
                                        </Text>
                                    </Row>

                                    <Row gap="8">
                                        <Text weight="strong" style={{ width: "120px" }}>
                                            Coding Level:
                                        </Text>
                                        <Text>{profile.codingLevel.charAt(0).toUpperCase() + profile.codingLevel.slice(1) || "Not set"}</Text>

                                    </Row>
                                    <Row gap="8">
                                        <Text weight="strong" style={{ width: "120px" }}>
                                            WhatsApp:
                                        </Text>
                                        <Text>{profile.onWhatsapp ? "Joined" : "Not joined"}</Text>
                                    </Row>
                                    <Row gap="8" content="end">

                                        <Button variant="danger" onClick={handleLogout}>
                                            Log Out
                                        </Button>
                                    </Row>
                                </Flex>
                            )}
                        </Flex>
                    </Card>
                </Column>
            </Column>
        </Flex>
    );
}