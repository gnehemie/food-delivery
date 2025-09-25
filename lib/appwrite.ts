import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  ID,
  Query,
  Storage,
  TablesDB,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://fra.cloud.appwrite.io/v1",
  projectId: "68c7e208002040f80919",
  projectName: "food-app",
  platform: "com.gajonedev.foodapp",
  database: "68c7e4a200067e892505",
  userTableId: "users",
  categoriesTableId: "categories",
  menuTableId: "menu",
  customizationsTableId: "customizations",
  menuCustomizationsTableId: "menu_customizations",
  bucketId: "68c893690010c109084a",
};

export const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const avatars = new Avatars(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

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
      appwriteConfig.userTableId,
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
      appwriteConfig.userTableId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error("Failed to fetch user");

    return currentUser.rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const logOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const getMenu = async ({
  category,
  query,
  limit = 6,
}: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal("categories", category));
    if (query) queries.push(Query.search("name", query));
    if (limit) queries.push(Query.limit(limit));

    const menus = await tablesDB.listRows(
      appwriteConfig.database,
      appwriteConfig.menuTableId,
      queries.length ? queries : undefined
    );

    return menus.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await tablesDB.listRows(
      appwriteConfig.database,
      appwriteConfig.categoriesTableId
    );

    return categories.rows;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getMenuDetails = async ({ id }: { id: string }) => {
  try {
    const menu = await tablesDB.getRow(
      appwriteConfig.database,
      appwriteConfig.menuTableId,
      id
    );

    const categories = await tablesDB.getRow(
      appwriteConfig.database,
      appwriteConfig.categoriesTableId,
      menu.categories
    );

    const customizationsId = await tablesDB.listRows(
      appwriteConfig.database,
      appwriteConfig.menuCustomizationsTableId,
      [Query.equal("menu", id)]
    );

    const customizations = await Promise.all(
      customizationsId.rows.map(async (item) => {
        const customization = await tablesDB.getRow(
          appwriteConfig.database,
          appwriteConfig.customizationsTableId,
          item.customizations
        );
        return customization;
      })
    );

    return { menu, categories, customizations };
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};
