export function arraysHaveCommonElements(
  array1: string[],
  array2: string[]
): boolean {
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  return false;
}
