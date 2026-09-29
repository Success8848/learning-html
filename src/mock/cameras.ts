import type { Camera } from "@/types";

export const cameras: Camera[] = [
  { id: "CAM-001", name: "Koteshwor Junction", location: "Koteshwor, Kathmandu", district: "Kathmandu", status: "online", mode: "demo", lastHeartbeat: "2026-09-22T15:46:51Z", currentDemoId: "RED_01", androidDeviceId: "AND-KTM-001", installedAt: "2026-06-12" },
  { id: "CAM-002", name: "Maitighar Mandala", location: "Maitighar, Kathmandu", district: "Kathmandu", status: "online", mode: "standby", lastHeartbeat: "2026-09-22T15:46:42Z", currentDemoId: null, androidDeviceId: "AND-KTM-002", installedAt: "2026-06-18" },
  { id: "CAM-003", name: "Jawalakhel Chowk", location: "Jawalakhel, Lalitpur", district: "Lalitpur", status: "offline", mode: "standby", lastHeartbeat: "2026-09-22T14:21:08Z", currentDemoId: null, androidDeviceId: null, installedAt: "2026-07-03" },
  { id: "CAM-004", name: "Ring Road Kalanki", location: "Kalanki, Kathmandu", district: "Kathmandu", status: "online", mode: "demo", lastHeartbeat: "2026-09-22T15:46:58Z", currentDemoId: "SPEED_01", androidDeviceId: "AND-KTM-004", installedAt: "2026-05-24" },
  { id: "CAM-005", name: "Suryabinayak Gate", location: "Suryabinayak, Bhaktapur", district: "Bhaktapur", status: "maintenance", mode: "standby", lastHeartbeat: "2026-09-22T12:05:17Z", currentDemoId: null, androidDeviceId: "AND-BKT-001", installedAt: "2026-08-10" },
  { id: "CAM-006", name: "Narayangopal Chowk", location: "Maharajgunj, Kathmandu", district: "Kathmandu", status: "online", mode: "demo", lastHeartbeat: "2026-09-22T15:46:37Z", currentDemoId: "HELMET_01", androidDeviceId: "AND-KTM-006", installedAt: "2026-06-29" },
  { id: "CAM-007", name: "Satdobato Junction", location: "Satdobato, Lalitpur", district: "Lalitpur", status: "online", mode: "standby", lastHeartbeat: "2026-09-22T15:45:58Z", currentDemoId: null, androidDeviceId: "AND-LTP-002", installedAt: "2026-07-19" },
  { id: "CAM-008", name: "Tinkune Corridor", location: "Tinkune, Kathmandu", district: "Kathmandu", status: "offline", mode: "standby", lastHeartbeat: "2026-09-22T10:14:32Z", currentDemoId: null, androidDeviceId: null, installedAt: "2026-08-02" },
];