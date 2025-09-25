import CartButton from "@/components/CartButton";
import Filters from "@/components/Filters";
import MenuCard from "@/components/MenuCard";
import SearchBar from "@/components/SearchBar";
import { images } from "@/constants";

import { getCategories, getMenu } from "@/lib/appwrite";
import { MENUS_LIMIT } from "@/lib/constants";
import useAppwrite from "@/lib/useAppwrite";
import { Category, MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    category: string;
    query: string;
  }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: MENUS_LIMIT },
  });

  const { data: categories } = useAppwrite({
    fn: getCategories,
  });

  useEffect(() => {
    refetch({ category, query, limit: MENUS_LIMIT });
  }, [category, query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 !== 0;

          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                isFirstRightColItem ? "mt-10" : "mt-0"
              )}
            >
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Recherche
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Trouvez votre plat préféré
                  </Text>
                </View>
              </View>

              <CartButton />
            </View>

            <SearchBar />

            <Filters categories={categories as unknown as Category[]} />
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && (
            <View className="flex-1 flex-col justify-center items-center gap-5 mt-10">
              <Image
                source={images.emptyState}
                resizeMode="contain"
                className="w-48 h-48"
              />
              <View>
                <Text className="text-2xl text-center font-quicksand-bold text-black">
                  Aucun plat trouvé
                </Text>
                <Text className="text-lg text-center font-quicksand-semibold text-gray-500 mt-2">
                  Essayez de modifier votre recherche
                </Text>
              </View>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Search;
