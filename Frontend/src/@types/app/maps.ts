export interface StringAnyMap {
  [key: string]: any;
}

export interface StringStringMap extends StringAnyMap {
  [key: string]: string;
}

export interface StringArrayMap extends StringAnyMap {
  [key: string]: string[];
}
