import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import { Icon } from "../components/Icon";
import { theme } from "../constants/theme";
import { useApp } from "../context/AppContext";
import { EventChatScreen } from "../screens/EventChatScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";
import { FriendsScreen } from "../screens/FriendsScreen";
import { HomeSwipeScreen } from "../screens/HomeSwipeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MyEventsScreen } from "../screens/MyEventsScreen";
import { MainTabParamList, RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.coral,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700"
        },
        tabBarStyle: {
          height: 78,
          paddingTop: 8,
          paddingBottom: 18,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.surface
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Discover") {
            return <Icon name="search-outline" color={color} size={size} />;
          }

          if (route.name === "MyEvents") {
            return <Icon name="calendar-outline" color={color} size={size} />;
          }

          return <Icon name="people-outline" color={color} size={size} />;
        }
      })}
    >
      <Tabs.Screen name="Discover" component={HomeSwipeScreen} options={{ title: "Discover" }} />
      <Tabs.Screen name="MyEvents" component={MyEventsScreen} options={{ title: "My Events" }} />
      <Tabs.Screen name="Friends" component={FriendsScreen} options={{ title: "Friends" }} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const { currentUser, isBooting } = useApp();

  if (isBooting) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background
        }}
      >
        <ActivityIndicator color={theme.colors.coral} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: theme.colors.ink,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: theme.colors.background
          },
          contentStyle: {
            backgroundColor: theme.colors.background
          }
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{
            title: "Event details",
            headerRight: () => <Icon name="heart" color={theme.colors.coral} size={20} />
          }}
        />
        <Stack.Screen
          name="EventChat"
          component={EventChatScreen}
          options={{
            title: "Event chat",
            headerRight: () => (
              <Icon name="chatbubble-ellipses-outline" color={theme.colors.teal} size={20} />
            )
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
