import { ID } from "react-native-appwrite";
import { appwriteConfig, storage, tablesDB } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await tablesDB.listRows(appwriteConfig.database, collectionId);

  await Promise.all(
    list.rows.map((doc) =>
      tablesDB.deleteRow(appwriteConfig.database, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile(appwriteConfig.bucketId, file.$id)
    )
  );
}

async function uploadImageToStorage(imageUrl: string) {
  console.log(`🌱 Uploading image to storage: ${imageUrl}`);
  console.log("Fetching image...");
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  console.log("Image fetched: ", JSON.stringify(blob, null, 2));

  const fileObj = {
    name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
    type: blob.type || "image/png",
    size: blob.size,
    uri: imageUrl,
  };

  console.log(JSON.stringify(fileObj, null, 2));

  console.log("Uploading image to appwrite...");
  const file = await storage.createFile(
    appwriteConfig.bucketId,
    ID.unique(),
    fileObj
  );

  return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
}

async function seed(): Promise<void> {
  try {
    // 1. Clear all
    console.log("🧹 Clearing existing data...");
    await clearAll(appwriteConfig.categoriesTableId);
    await clearAll(appwriteConfig.customizationsTableId);
    await clearAll(appwriteConfig.menuTableId);
    await clearAll(appwriteConfig.menuCustomizationsTableId);
    await clearStorage();

    // 2. Create Categories
    console.log("🌱 Creating categories...");
    const categoryMap: Record<string, string> = {};
    for (const cat of data.categories) {
      console.log(`🌱 Creating category: ${cat.name}`);
      const doc = await tablesDB.createRow(
        appwriteConfig.database,
        appwriteConfig.categoriesTableId,
        ID.unique(),
        cat
      );
      categoryMap[cat.name] = doc.$id;
    }

    // 3. Create Customizations
    console.log("🌱 Creating customizations...");
    const customizationMap: Record<string, string> = {};
    for (const cus of data.customizations) {
      console.log(`🌱 Creating customization: ${cus.name}`);
      const doc = await tablesDB.createRow(
        appwriteConfig.database,
        appwriteConfig.customizationsTableId,
        ID.unique(),
        {
          name: cus.name,
          price: cus.price,
          type: cus.type,
        }
      );
      customizationMap[cus.name] = doc.$id;
    }

    // 4. Create Menu Items
    console.log("🌱 Creating menu items...");
    const menuMap: Record<string, string> = {};
    for (const item of data.menu) {
      console.log(`🌱 Creating menu item: ${item.name}`);
      const uploadedImage = await uploadImageToStorage(item.image_url);

      const doc = await tablesDB.createRow(
        appwriteConfig.database,
        appwriteConfig.menuTableId,
        ID.unique(),
        {
          name: item.name,
          description: item.description,
          image_url: uploadedImage,
          price: item.price,
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryMap[item.category_name],
        }
      );

      menuMap[item.name] = doc.$id;

      // 5. Create menu_customizations
      console.log("🌱 Creating menu customizations...");
      for (const cusName of item.customizations) {
        console.log(`🌱 Creating menu customization: ${cusName}`);
        await tablesDB.createRow(
          appwriteConfig.database,
          appwriteConfig.menuCustomizationsTableId,
          ID.unique(),
          {
            menu: doc.$id,
            customizations: customizationMap[cusName],
          }
        );
      }
    }

    console.log("✅ Seeding complete.");
  } catch (error: any) {
    console.error("Error seeding data:", error.message);
    throw error;
  }
}

export default seed;
