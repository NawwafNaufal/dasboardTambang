/** Hitung persentase perubahan antara nilai pertama dan terakhir array */
export function pctChange(arr: number[]): string {
  if (arr.length < 2) return "0";
  const first = arr[0];
  const last = arr[arr.length - 1];
  if (first === 0) return "0";
  return (((last - first) / first) * 100).toFixed(0);
}