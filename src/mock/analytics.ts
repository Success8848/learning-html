import type { AnalyticsData } from "@/types";

export const analytics: AnalyticsData = {
  byType: [{ name: "Signal jumping", value: 48 }, { name: "Overspeeding", value: 41 }, { name: "No helmet", value: 27 }, { name: "Wrong lane", value: 19 }, { name: "Triple riding", value: 13 }],
  byCamera: [{ name: "CAM-001", value: 39 }, { name: "CAM-004", value: 34 }, { name: "CAM-006", value: 28 }, { name: "CAM-002", value: 25 }, { name: "CAM-007", value: 22 }],
  overTime: [{ time: "08:00", incidents: 8 }, { time: "10:00", incidents: 17 }, { time: "12:00", incidents: 14 }, { time: "14:00", incidents: 26 }, { time: "16:00", incidents: 31 }, { time: "18:00", incidents: 23 }, { time: "20:00", incidents: 18 }],
  bySeverity: [{ name: "Critical", value: 12 }, { name: "High", value: 38 }, { name: "Medium", value: 62 }, { name: "Low", value: 36 }],
  daily: [{ day: "Mon", incidents: 118 }, { day: "Tue", incidents: 132 }, { day: "Wed", incidents: 109 }, { day: "Thu", incidents: 141 }, { day: "Fri", incidents: 148 }, { day: "Sat", incidents: 96 }, { day: "Sun", incidents: 83 }],
  weekly: [{ week: "W35", incidents: 682 }, { week: "W36", incidents: 731 }, { week: "W37", incidents: 704 }, { week: "W38", incidents: 769 }],
};