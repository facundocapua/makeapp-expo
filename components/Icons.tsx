import { FontAwesome } from "@expo/vector-icons";

type Props = typeof FontAwesome.defaultProps;

export const HomeIcon = (props: Props) => {
  return <FontAwesome name="home" size={24} color="white" {...props} />;
};

export const CircleInfoIcon = (props: Props) => {
  return <FontAwesome name="info-circle" size={24} color="white" {...props} />;
};

export const InfoIcon = (props: Props) => {
  return <FontAwesome name="info" size={24} color="white" {...props} />;
};

export const ArchiveIcon = (props: Props) => {
  return <FontAwesome name="archive" size={24} color="white" {...props} />;
};

export const CalendarIcon = (props: Props) => {
  return <FontAwesome name="calendar-o" size={24} color="white" {...props} />;
};

export const CalendarPlusIcon = (props: Props) => {
  return (
    <FontAwesome name="calendar-plus-o" size={24} color="white" {...props} />
  );
};

export const GearIcon = (props: Props) => {
  return <FontAwesome name="gear" size={24} color="white" {...props} />;
};

export const MoneyIcon = (props: Props) => {
  return <FontAwesome name="money" size={24} color="white" {...props} />;
};

export const ChevronLeft = (props: Props) => {
  return <FontAwesome name="chevron-left" size={24} color="white" {...props} />;
};
