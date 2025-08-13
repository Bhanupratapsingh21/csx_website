
import { Client, Account, Databases } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client().setEndpoint(endpoint).setProject(project);

export const account = new Account(client);
export const databases = new Databases(client);
