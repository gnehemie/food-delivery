import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import Rating from "@/components/Rating";
import { images } from "@/constants";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const toppings = [
  { name: "Tomato", image: images.tomatoes },
  { name: "Onions", image: images.onions },
  { name: "Cheese", image: images.cheese },
  { name: "Pickles", image: images.cucumber },
  { name: "Mushroom", image: images.mushrooms },
  { name: "Avocado", image: images.avocado },
];

const sideOptions = [
  { name: "Fries", image: images.fries },
  { name: "Coleslaw", image: images.coleslaw },
  { name: "Salad", image: images.salad },
  { name: "Pringles", image: images.onionRings },
  { name: "Mozz", image: images.mozarellaSticks },
];

const MenuPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="bg-white h-full flex-1 items-center px-5 py-3">
      <CustomHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full flex flex-col gap-3"
      >
        <View className="flex flex-row items-center justify-between mt-3 mb-5">
          <View className="w-1/2 flex flex-col gap-2">
            <View className="flex flex-col mb-3 gap-1">
              <Text className="text-2xl text-black font-outfit-bold max-w-[12rem]">
                Wendy&apos;s Burger
              </Text>
              <Text className="text-lg font-outfit-medium text-gray-200">
                Cheeseburger
              </Text>
            </View>
            <Rating rating={4.9} />
            <View className="flex flex-row items-center">
              <Text className="text-3xl text-primary font-outfit-extrabold">
                $
              </Text>
              <Text className="text-3xl text-black font-outfit-extrabold">
                10.25
              </Text>
            </View>
            <View className="flex flex-col mt-5 mb-3 gap-2">
              <View className="flex flex-row items-center gap-5">
                <TextDesc title="Calories" desc={`500 Cal`} />
                <TextDesc title="Protein" desc={`25 g`} />
              </View>
              <TextDesc
                title="Bun Type"
                desc={`Whole Wheat`}
                descriptionClassNames="max-w-[6rem] truncate line-clamp-1"
              />
            </View>
          </View>
          <View className="flex-1 relative">
            <Image
              source={images.burgerTwo}
              className="w-[15rem] h-[15rem] object-cover"
            />
          </View>
        </View>
        <View className="w-full bg-white-200/20 py-4 rounded-full flex flex-row items-center justify-around">
          {[
            { icon: images.dollar, text: "Free Delivery" },
            { icon: images.clock, text: "30-40 min" },
            { icon: images.star, text: "4.9" },
          ].map((item, index) => (
            <View
              key={index}
              className="flex flex-row items-center justify-center gap-2"
            >
              <Image source={item.icon} className="w-4 h-4 object-contain" />
              <Text className="text-md font-outfit-medium text-black">
                {item.text}
              </Text>
            </View>
          ))}
        </View>
        <Text className="text-lg text-gray-200 font-outfit-medium my-3">
          The Cheeseburger Wendy&apos;s Burger is a classic fast food burger
          that packs a punch of flavor in every bite. Made with a juicy beef
          patty cooked to perfection, it&apos;s topped with melted American
          cheese, crispy lettuce, tomato, & crunchy pickles.
        </Text>
        <View className="w-full flex flex-col gap-3 mb-10">
          <Text className="text-black font-outfit-semibold text-2xl">
            Toppings
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full"
            contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}
            data={toppings}
            renderItem={({ item }) => (
              <View className="flex flex-col items-center w-[6rem] bg-[#3C2F2F] rounded-xl p-1">
                {/* Container avec image */}
                <View className="bg-white rounded-lg w-full flex py-2 items-center justify-center">
                  <Image
                    source={item.image}
                    className="w-16 h-16 object-contain"
                  />
                </View>

                {/* Container noir avec texte et bouton + */}
                <View className="w-full flex flex-row items-center justify-between">
                  <Text className="text-white font-outfit-medium text-sm flex-1">
                    {item.name}
                  </Text>
                  <View className="bg-[#FF6B35] rounded-full w-5 h-5 flex items-center justify-center my-2 mx-1">
                    <Image
                      source={images.plus}
                      className="w-3 h-3 object-contain"
                      style={{ tintColor: "white" }}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </View>
        <View className="w-full flex flex-col gap-3 mb-10">
          <Text className="text-black font-outfit-semibold text-2xl">
            Side options
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            className="w-full"
            contentContainerStyle={{ paddingHorizontal: 4, gap: 12 }}
            data={sideOptions}
            renderItem={({ item }) => (
              <View className="flex flex-col items-center w-[6rem] bg-[#3C2F2F] rounded-xl p-1">
                {/* Container avec image */}
                <View className="bg-white rounded-lg w-full flex py-2 items-center justify-center">
                  <Image
                    source={item.image}
                    className="w-16 h-16 object-contain"
                  />
                </View>

                {/* Container noir avec texte et bouton + */}
                <View className="w-full flex flex-row items-center justify-between">
                  <Text className="text-white font-outfit-medium text-sm flex-1">
                    {item.name}
                  </Text>
                  <View className="bg-[#FF6B35] rounded-full w-5 h-5 flex items-center justify-center my-2 mx-1">
                    <Image
                      source={images.plus}
                      className="w-3 h-3 object-contain"
                      style={{ tintColor: "white" }}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        </View>
        <View className="h-20 flex w-full flex-row items-center justify-between p-3 bg-white mb-8 rounded-xl shadow-lg">
          <View className="flex flex-row-reverse items-center gap-3">
            <View className="flex flex-col items-center justify-center bg-white-200/10 rounded-lg p-2">
              <Image source={images.plus} className="w-3 h-3 object-contain" />
            </View>
            <Text className="text-lg text-black font-outfit-bold">+</Text>
            <View className="flex flex-col items-center justify-center bg-white-200/10 rounded-lg p-2">
              <Image source={images.minus} className="w-3 h-3 object-cover" />
            </View>
          </View>
          <CustomButton
            title="Add to Cart ($10.25)"
            leftIcon={images.bag}
            style="flex-1 ml-8 py-3"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const TextDesc = ({
  title,
  desc,
  descriptionClassNames,
}: {
  title: string;
  desc: string;
  descriptionClassNames?: string;
}) => {
  return (
    <View className="flex flex-col">
      <Text className="text-lg text-gray-200 font-outfit-medium">{title}</Text>
      <Text
        className={cn(
          "text-base font-outfit-semibold text-black",
          descriptionClassNames
        )}
      >
        {desc}
      </Text>
    </View>
  );
};

export default MenuPage;
