import { MapInterface } from "@/@types/app/maps";
import { camelCase } from "lodash";


function regExpEscape(string: string): string {
  return string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

function cameliseKeys(obj: MapInterface): MapInterface {
  if (Array.isArray(obj)) {
    return obj.map(v => cameliseKeys(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: cameliseKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
}

function cameliseArrayOfObjects<T>(array: T[]): T[] {
  const copy: T[] = [];
  for (const obj of array) {
    // @ts-ignore
    copy.push(cameliseKeys(obj));
  }
  return copy;
}

function isObjectEmpty(object: MapInterface): boolean {
  return Object.keys(object).length === 0;
}

function objectWithoutKeys(object: MapInterface, ...keys: Array<string | number | symbol>): MapInterface {
  let copy = { ...object };
  for (const key of keys) delete copy[key];
  return copy;
}

export {
  regExpEscape,
  cameliseKeys,
  cameliseArrayOfObjects,
  isObjectEmpty,
  objectWithoutKeys
};
