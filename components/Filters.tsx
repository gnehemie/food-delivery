import { Category } from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity } from "react-native";

const Filters = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "all");

  const handlePress = (id: string) => {
    setActive(id);

    if (id === "all") router.setParams({ category: undefined });
    else router.setParams({ category: id });
  };

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: "all", name: "Tout" }, ...categories]
    : [{ $id: "all", name: "Tout" }];

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          className={cn(
            "filter border  px-4 py-2 rounded-full",
            active === item.$id
              ? "bg-amber-500 border-amber-500"
              : "bg-white border-gray-100/20"
          )}
          style={
            Platform.OS === "android"
              ? { elevation: 5, shadowColor: "#c2c0c0" }
              : {}
          }
          onPress={() => handlePress(item.$id)}
          activeOpacity={1}
        >
          <Text
            className={cn(
              "body-medium",
              active === item.$id ? "text-white" : "text-gray-500"
            )}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default Filters;
