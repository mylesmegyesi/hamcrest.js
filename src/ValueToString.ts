
export type Show<T> = (value: T) => string;

export const valueToString: Show<any> = (value: any) => {
  return `${value}`;
};
