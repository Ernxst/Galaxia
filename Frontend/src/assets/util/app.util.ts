function regExpEscape(string: string): string {
  return string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

export {
  regExpEscape
}
