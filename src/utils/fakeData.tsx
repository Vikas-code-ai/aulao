import { Course } from "~/types";

export const courses: Course[] = [
  {
    id: "1",
    title: "Ballet",
    startTime: "10:00",
    weekDays: ["Monday", "Wednesday", "Friday"],
    duration: 60,
    level: "Beginner",
    teacher: "John Doe",
    icon: <svg></svg>,
  },
  {
    id: "2",
    title: "Hip Hop",
    startTime: "14:00",
    weekDays: ["Tuesday", "Thursday"],
    duration: 90,
    level: "Intermediate",
    teacher: "Jane Smith",
    icon: <svg></svg>,
  },
  {
    id: "3",
    title: "Jazz",
    startTime: "18:00",
    weekDays: ["Monday", "Wednesday", "Friday"],
    duration: 75,
    level: "Advanced",
    teacher: "Bob Johnson",
    icon: <svg></svg>,
  },
];
