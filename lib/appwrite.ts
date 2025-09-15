import { CreateUserParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  TablesDB,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  projectName: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_PLATFORM!,
  database: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: "users",
};

export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const tablesDB = new TablesDB(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw Error("Failed to create account");

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name, 256, 256);

    if (!avatarUrl) throw Error("Failed to get avatar URL");

    const newUser = await tablesDB.createRow(
      appwriteConfig.database,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, name, email, avatar: avatarUrl }
    );

    if (!newUser) throw Error("Failed to create user");

    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error("No user logged in");

    const currentUser = await tablesDB.listRows(
      appwriteConfig.database,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("Failed to fetch user");

    return currentUser.rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};
