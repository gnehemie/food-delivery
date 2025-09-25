import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";

import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const { fetchAuthenticatedUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert("Erreur", "Veuillez remplir tous les champs");

    setIsSubmitting(true);

    try {
      await signIn({ email, password });

      await fetchAuthenticatedUser();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Entrez votre email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Entrez votre mot de passe"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        label="Mot de passe"
        secureTextEntry
      />

      <CustomButton
        title="Se connecter"
        onPress={submit}
        isLoading={isSubmitting}
      />
      <View className="flex-row justify-center mt-5 items-center gap-1">
        <Text className="base-regular text-gray-100">
          Vous n&apos;avez pas de compte ?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary underline">
          S&apos;inscrire
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
