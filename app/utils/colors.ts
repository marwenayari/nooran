export const storiesColors = [
  "bg-sky-300",
  "bg-orange-300",
  "bg-violet-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-emerald-300",
  "bg-red-300",
  "bg-lime-400",
  "bg-teal-800",
  "bg-amber-300",
];

export const courseBgColors = [
  "bg-red-200",
  "bg-orange-200",
  "bg-violet-200",
  "bg-green-200",
  "bg-blue-200",
];

export const courseBgColorsFull = [
  "bg-red-400",
  "bg-orange-400",
  "bg-violet-400",
  "bg-green-400",
  "bg-blue-400",
];

export const getStoryCover = (index: number) =>
  storiesColors[index % storiesColors.length];

export const getCourseBg = (index: number) =>
  courseBgColors[index % courseBgColors.length];

export const getCourseBgFull = (index: number) =>
  courseBgColorsFull[index % courseBgColorsFull.length];
