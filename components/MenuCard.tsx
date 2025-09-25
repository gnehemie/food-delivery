import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { router } from "expo-router";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";

const MenuCard = ({
  item: { image_url, name, price, $id },
}: {
  item: MenuItem;
}) => {
  const { addItem } = useCartStore();

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
      onPress={() => {
        router.push({
          pathname: "/menu/[id]",
          params: { id: $id },
        });
      }}
    >
      <Image
        source={{ uri: image_url }}
        className="size-32 absolute -top-10"
        resizeMode="contain"
      />
      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">
        A partir de ${price}
      </Text>
      <TouchableOpacity
        onPress={() =>
          addItem({ id: $id, name, price, image_url, customizations: [] })
        }
        className="btn-primary !px-3 !pb-2 !rounded-lg"
      >
        <View className="flex flex-row items-center gap-2">
          <Text className="text-2xl text-primary font-quicksand-bold">+</Text>
          <Text className="paragraph-bold text-primary">Ajouter</Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
