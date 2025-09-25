import { images } from "@/constants";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDebouncedCallback } from "use-debounce";

const SearchBar = () => {
  const params = useLocalSearchParams<{ query: string }>();
  const [searchQuery, setSearchQuery] = React.useState(params.query || "");

  const debouncedSearch = useDebouncedCallback(
    (text: string) => router.setParams({ query: text }),
    400
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  return (
    <View
      className="searchbar"
      style={
        Platform.OS === "android"
          ? {
              elevation: 5,
              shadowColor: "#c2c0c0",
            }
          : {}
      }
    >
      <TextInput
        placeholder="Rechercher pizzas, burgers..."
        className="flex-1 p-4 font-quicksand-semibold caret-white-200"
        placeholderTextColor="#A0A0A0"
        value={searchQuery}
        onChangeText={handleSearch}
        returnKeyType="search"
      />

      <TouchableOpacity className="pr-5" onPress={() => {}}>
        <Image
          source={images.search}
          className="size-6"
          resizeMode="contain"
          tintColor="#5D5F6D"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
