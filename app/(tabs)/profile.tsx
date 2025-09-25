import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import UserAvatar from "@/components/UserAvatar";
import { images } from "@/constants";
import { logOut } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { user, envelope, phone, location, pencil, logout } = images;

const infos = [
  {
    title: "Nom Complet",
    desc: "Gajone Dev",
    img: user,
  },
  {
    title: "Adresse Email",
    desc: "gajonedev@gmail.com",
    img: envelope,
  },
  {
    title: "Numéro de Téléphone",
    desc: "+229 01 46 89 73 22",
    img: phone,
  },
  {
    title: "Adresse 1 (domicile)",
    desc: "123 Rue de la Paix, Cotonou",
    img: location,
  },
  {
    title: "Adresse 2 (travail)",
    desc: "221B Rue des Fleurs, Porto-Novo",
    img: location,
  },
];

const Profile = () => {
  const { fetchAuthenticatedUser } = useAuthStore();

  return (
    <SafeAreaView className="bg-[#f0f0f0] h-full flex-1 items-center px-5 py-3">
      <CustomHeader title="Profile" />
      <UserAvatar />
      <View className="flex flex-col p-5 bg-white rounded-2xl mt-5 w-full items-start gap-6">
        {infos.map((info, index) => (
          <View key={index} className="flex flex-row items-center gap-4">
            <View className="flex items-center justify-center p-3 bg-white-200/20 rounded-full">
              <Image source={info.img} className="w-6 h-6 object-contain" />
            </View>
            <View>
              <Text className="text-gray-200 font-outfit-medium ">
                {info.title}
              </Text>
              <Text className="text-black text-lg font-outfit-bold">
                {info.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View className="w-full mt-10 flex flex-col gap-4">
        <CustomButton
          title="Modifier le profil"
          style="bg-white-200/10 border border-white-200"
          textStyle="text-white-200"
        />
        <CustomButton
          title="Se déconnecter"
          style="bg-red-600/10 border border-red-600"
          textStyle="text-red-600"
          leftIcon={logout}
          onPress={async () => {
            await logOut();
            await fetchAuthenticatedUser();
            router.push("/sign-in");
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
