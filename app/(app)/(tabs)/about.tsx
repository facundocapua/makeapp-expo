import { Link } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";
import { HomeIcon } from "../../../components/Icons";
import { Screen } from "../../../components/Screen";

export default function About() {
  return (
    <Screen>
      <ScrollView>
        <Link href="/" asChild>
          <Pressable>
            <HomeIcon />
          </Pressable>
        </Link>
        <Text className="text-white font-bold mb-8 text-2xl">About</Text>
        <Text className="text-white/90 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed ac
        </Text>
        <Text className="text-white/90 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed ac
        </Text>
        <Text className="text-white/90 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed ac
        </Text>
        <Text className="text-white/90 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem
          ipsum dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Sed ac Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Sed ac
        </Text>
      </ScrollView>
    </Screen>
  );
}
