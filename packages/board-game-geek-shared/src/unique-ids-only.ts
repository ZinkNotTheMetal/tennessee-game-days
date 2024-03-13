export default function uniqueIdsOnly(value: number, index: number, array: number[]) : boolean {
  return array.indexOf(value) === index;
}