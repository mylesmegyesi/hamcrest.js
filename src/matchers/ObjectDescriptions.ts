import { ObjectPrinters, Print } from "../Printing";

export type ObjectDescriptions<T> = {
  [P in keyof T]: string;
};

const printDescription: Print<string> = (description: string): string => description;
const printDescriptionsProxy = new Proxy({}, { get: (): Print<string> => printDescription });
export const buildObjectDescriptionsPrinter = <T>(): ObjectPrinters<Partial<ObjectDescriptions<T>>> => printDescriptionsProxy as ObjectPrinters<Partial<ObjectDescriptions<T>>>;
