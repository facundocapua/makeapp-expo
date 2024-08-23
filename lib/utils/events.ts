import {
  EventType,
  GroupedEventCollection,
  GroupedEventItemType,
} from "@/types/event";

export const groupByDate = (events: EventType[]): GroupedEventItemType[] => {
  const groupedEvents = events.reduce(
    (current: GroupedEventCollection, item) => {
      const startDate = new Date(item.date);
      startDate.setHours(23, 59, 59);
      const dateIndex = `${startDate.getFullYear()}_${startDate.getMonth()}_${startDate.getDate()}`;
      current[dateIndex] ??= {
        title: startDate.toString(),
        data: [],
      };
      current[dateIndex].data.push(item);
      return current;
    },
    {},
  );
  const response = Object.values(groupedEvents);
  response.map((group) => {
    group.data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    return group;
  });
  return response;
};
