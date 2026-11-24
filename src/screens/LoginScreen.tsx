import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { AppButton } from "../components/AppButton";
import { Icon } from "../components/Icon";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";

export function LoginScreen() {
  const { continueAsDemoUser, loginWithEmail, dataMode } = useApp();
  const [email, setEmail] = useState("demo@eventswipe.gta");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Tenzin Demo");
  const [city, setCity] = useState("Toronto");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleEmailLogin() {
    setError(null);
    setIsSubmitting(true);

    try {
      await loginWithEmail({ email, password, name, city });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemoLogin() {
    setError(null);
    setIsSubmitting(true);

    try {
      await continueAsDemoUser();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to start demo mode.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Icon name="heart" color={theme.colors.surface} size={32} />
          </View>
          <Text style={styles.title}>EventSwipe GTA</Text>
          <Text style={styles.subtitle}>
            Find Toronto plans, match with events, and coordinate with people who are going.
          </Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>{dataMode === "mock" ? "Mock data" : "Supabase"}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
          />
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={theme.colors.muted}
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <AppButton title="Login with email" onPress={handleEmailLogin} loading={isSubmitting} />
          <AppButton
            title="Continue as Demo User"
            onPress={handleDemoLogin}
            variant="secondary"
            loading={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: "space-between",
    gap: theme.spacing.xl
  },
  hero: {
    paddingTop: theme.spacing.xxl,
    gap: theme.spacing.md
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: theme.radius.card,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.coral
  },
  title: {
    color: theme.colors.ink,
    fontSize: 42,
    lineHeight: 48,
    fontWeight: "900"
  },
  subtitle: {
    color: theme.colors.inkSoft,
    fontSize: 17,
    lineHeight: 25,
    fontWeight: "600"
  },
  modeBadge: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: theme.colors.tealSoft
  },
  modeText: {
    color: theme.colors.teal,
    fontSize: 12,
    fontWeight: "900"
  },
  form: {
    gap: theme.spacing.md
  },
  input: {
    minHeight: 52,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: "700"
  },
  error: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "700"
  }
});
