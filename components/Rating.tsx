import { images } from "@/constants";
import React from "react";
import { Image, Text, View } from "react-native";

export default function Rating({ rating = 4.5 }: { rating?: number }) {
  // Calcule le nombre d'étoiles à afficher
  const getStarsCount = (value: number): number => {
    if (value >= 1 && value <= 1.4) return 1;
    if (value >= 1.5 && value <= 2.4) return 2;
    if (value >= 2.5 && value <= 3.4) return 3;
    if (value >= 3.5 && value <= 4.4) return 4;
    if (value >= 4.5) return 5;
    return 0; // Pour les valeurs < 1
  };

  const starsCount = getStarsCount(rating);

  return (
    <View className="flex flex-row items-center gap-3 mb-3">
      <View className="flex flex-row items-center">
        {Array.from({ length: starsCount }, (_, index) => (
          <Image
            key={index}
            source={images.star}
            className="w-5 h-5"
            resizeMode="contain"
            tintColor="#FFC107"
          />
        ))}
      </View>
      <Text className="text-gray-400 font-outfit-medium text-md">
        {rating} / 5
      </Text>
    </View>
  );
}
