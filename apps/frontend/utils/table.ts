import { Row } from "@tanstack/react-table";

export const sortNumeric = <T>(rowA: Row<T>, rowB: Row<T>, columnId: string) => {
    const n1 = Number(rowA.getValue(columnId));
    const n2 = Number(rowB.getValue(columnId));
    if (n1 < n2) return -1;
    if (n2 < n1) return 1;
    return 0;
  };