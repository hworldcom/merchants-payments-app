import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@merchant-payments/ui-tokens";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mark} />
        <Text style={styles.eyebrow}>Customer payments</Text>
        <Text style={styles.title}>Mobile foundation ready</Text>
        <Text style={styles.body}>
          The scanner and payment journey will be added under their own tickets.
        </Text>
        <Text style={styles.badge}>Solana Devnet only</Text>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: spacing[8],
  },
  mark: {
    width: 36,
    height: 6,
    marginBottom: spacing[6],
    borderRadius: radius.pill,
    backgroundColor: colors.brandPurple,
  },
  eyebrow: {
    marginBottom: spacing[2],
    color: colors.brandPurple,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1.2,
  },
  body: {
    marginTop: spacing[4],
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
  },
  badge: {
    alignSelf: "flex-start",
    marginTop: spacing[6],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    color: colors.brandPurple,
    backgroundColor: colors.brandPurpleSoft,
    fontSize: 13,
    fontWeight: "700",
  },
});
