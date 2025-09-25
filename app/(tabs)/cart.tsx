import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { images } from "@/constants";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps } from "@/type";
import cn from "clsx";
import { router } from "expo-router";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart = () => {
  const { items, getTotalItems, getTotalPrice } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Votre Panier" />}
        ListEmptyComponent={() => (
          <View className="flex-1 flex-col justify-center items-center gap-6 mt-10">
            <Image
              source={images.emptyCart}
              resizeMode="contain"
              className="w-48 h-48"
            />
            <View className="items-center my-4">
              <Text className="text-2xl text-center font-quicksand-bold text-black">
                Votre panier semble être vide
              </Text>
              <Text className="text-lg text-center font-quicksand-semibold text-gray-500 mt-2">
                Découvrez nos délicieux plats et ajoutez-les à votre panier.
              </Text>
            </View>
            <CustomButton
              title="Découvrir"
              onPress={() => router.push("/search")}
            />
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Détails de paiement
                </Text>

                <PaymentInfoStripe
                  label={`Plats totaux (${totalItems})`}
                  value={`$${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe
                  label={`Frais de livraison`}
                  value={`$5.00`}
                />
                <PaymentInfoStripe
                  label={`Remise`}
                  value={`- $0.50`}
                  valueStyle="!text-success"
                />
                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label={`Total`}
                  value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              <CustomButton title="Commander maintenant" />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Cart;
