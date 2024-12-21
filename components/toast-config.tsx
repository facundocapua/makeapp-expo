import { View, Text } from "react-native";
import { BaseToastProps } from "react-native-toast-message";
import { CheckCircleIcon, CrossCircleIcon, WarningIcon } from "./Icons";

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  error: ({ text1, text2 }: CustomToastProps) => (
    <View className="flex-row items-center justify-start w-[90%] gap-6 bg-[#374151] border-b-4 border-[#ef4444] py-3 px-8 rounded-lg">
      <CrossCircleIcon color="#ef4444" />
      <View className="flex-col gap-2">
        {text1 && (
          <Text className="text-white text-[16px] font-semibold">{text1}</Text>
        )}
        {text2 && <Text className="text-white/80 text-[12px]">{text2}</Text>}
      </View>
    </View>
  ),
  success: ({ text1, text2 }: CustomToastProps) => (
    <View className="flex-row items-center justify-start w-[90%] gap-6 bg-[#374151] border-b-4 border-[#10b981] py-3 px-8 rounded-lg">
      <CheckCircleIcon color="#10b981" />
      <View className="flex-col gap-2">
        {text1 && (
          <Text className="text-white text-[16px] font-semibold">{text1}</Text>
        )}
        {text2 && <Text className="text-white/80 text-[12px]">{text2}</Text>}
      </View>
    </View>
  ),
  warning: ({ text1, text2 }: CustomToastProps) => (
    <View className="flex-row items-center justify-start w-[90%] gap-6 bg-[#374151] border-b-4 border-[#fbbf24] py-3 px-8 rounded-lg">
      <WarningIcon color="#fbbf24" />
      <View className="flex-col gap-2">
        {text1 && (
          <Text className="text-white text-[16px] font-semibold">{text1}</Text>
        )}
        {text2 && <Text className="text-white/80 text-[12px]">{text2}</Text>}
      </View>
    </View>
  ),
};

export default toastConfig;
