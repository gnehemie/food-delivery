import { images } from "@/constants";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { TabBarIconProps } from "@/type";

import cn from "clsx";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function Layout() {
  const { isAuthenticated } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [totalItems, setTotalItems] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const items = getTotalItems();
    setTotalItems(items);
  });

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderRadius: 50,
          marginHorizontal: 20,
          height: 65,
          position: "absolute",
          bottom: 20,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.home} title="Accueil" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Recherche",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={images.search}
              title="Recherche"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Panier",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={images.bag}
              title="Panier"
              totalItems={totalItems || 0}
              isCart
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.person} title="Profil" />
          ),
        }}
      />

      {/* <Slot /> */}
    </Tabs>
  );
}

const TabBarIcon = ({
  focused,
  icon,
  title,
  isCart = false,
  totalItems = 0,
}: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
    <Text
      className={cn(
        "text-sm font-outfit-bold",
        focused ? "text-primary" : "text-gray-200"
      )}
    >
      {title}
    </Text>
    {isCart && totalItems > 0 && (
      <View className="absolute -top-2 right-3 flex items-center justify-center size-5 bg-primary rounded-full">
        <Text className="small-bold text-white">{totalItems}</Text>
      </View>
    )}
  </View>
);
