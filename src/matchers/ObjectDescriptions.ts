import { ObjectPrinters, Print } from "../Printing";

export type ObjectDescriptions<T> = {
  [P in keyof T]: string;
};

const printDescription: Print<string> = (description: string) => description;

const printDescriptionsProxy = new Proxy({}, {
  get: () => {
    return printDescription;
  },
});

export function buildObjectDescriptionsPrinter<T>(): ObjectPrinters<Partial<ObjectDescriptions<T>>> {
  return printDescriptionsProxy as ObjectPrinters<Partial<ObjectDescriptions<T>>>;
}
