import { CustomButtonProps } from "@/type";
import cn from "clsx";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CustomButton = ({
  onPress,
  title = "Click me",
  style,
  textStyle = "text-white-100",
  leftIcon,
  isLoading = false,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={cn("custom-btn", style)}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={1}
    >
      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" className="mr-2" />
        ) : (
          <>
            {leftIcon && (
              <Image
                className={cn("h-5 w-5 mr-2", textStyle)}
                source={
                  typeof leftIcon === "string" ? { uri: leftIcon } : leftIcon
                }
              />
            )}
            <Text className={cn("paragraph-semibold", textStyle)}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
