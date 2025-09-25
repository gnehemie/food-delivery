import { images } from "@/constants";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "./CustomButton";

export default function UserAvatar() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Désolé, nous avons besoin des permissions pour accéder à la galerie!"
      );
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de la permission pour utiliser l'appareil photo."
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Aspect carré pour l'avatar
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      // allowsEditing: true,
      aspect: [1, 1], // Aspect carré pour l'avatar
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      // setModalVisible(false);
    }
  };

  return (
    <>
      <View className="w-24 h-24 rounded-full flex items-center justify-center my-4 relative">
        <Image
          source={images.placeholder}
          className="w-full h-full rounded-full"
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="w-7 h-7 rounded-full bg-white-200/80 absolute bottom-1 right-0 flex items-center justify-center border border-white"
        >
          <Image source={images.pencil} className="w-4 h-4 object-contain" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80">
          <View className="bg-white rounded-xl p-4 w-[90%] flex items-center">
            <Text className="text-xl font-outfit-bold mb-4">
              Modifier la photo de profil
            </Text>

            {/* Contenu du modal - ajoute tes options ici */}
            <View className="w-24 h-24 rounded-full flex items-center justify-center relative">
              <Image
                source={
                  selectedImage ? { uri: selectedImage } : images.placeholder
                }
                className="w-full h-full rounded-full"
              />
              {selectedImage && (
                <TouchableOpacity
                  onPress={pickImageFromGallery}
                  className="w-7 h-7 rounded-full bg-white-200/80 absolute bottom-1 right-0 flex items-center justify-center border border-white"
                >
                  <Image
                    source={images.pencil}
                    className="w-4 h-4 object-contain"
                  />
                </TouchableOpacity>
              )}
            </View>
            <View className="w-full mt-10 flex flex-col gap-3">
              <CustomButton
                title="Choisir depuis la galerie"
                style="bg-white-200/10 border border-white-200"
                textStyle="text-white-200"
                onPress={pickImageFromGallery}
              />
              <CustomButton
                title="Prendre une photo"
                style="bg-red-600/10 border border-red-600"
                textStyle="text-red-600"
                onPress={takePhoto}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
