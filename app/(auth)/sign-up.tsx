import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/appwrite";
import { useAuthStore } from "@/store/auth.store";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const { fetchAuthenticatedUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password)
      return Alert.alert("Erreur", "Veuillez remplir tous les champs");

    setIsSubmitting(true);

    try {
      await createUser({ name, email, password });
      await fetchAuthenticatedUser();

      router.replace("/");
    } catch (error: any) {
      console.log(error);
      Alert.alert("Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Entrez votre nom complet"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        label="Nom complet"
      />
      <CustomInput
        placeholder="Entrez votre email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Choisissez votre mot de passe"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        label="Mot de passe"
        secureTextEntry
      />

      <CustomButton
        title="S'inscrire"
        onPress={submit}
        isLoading={isSubmitting}
      />

      <View className="flex-row justify-center items-center gap-1">
        <Text className="base-regular text-gray-100">
          Vous avez déjà un compte ?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary underline">
          S&apos;identifier
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
