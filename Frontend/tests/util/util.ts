function addDivContainer(): HTMLDivElement {
  const div = document.createElement("div");
  div.id = "app";
  document.body.appendChild(div);
  return div;
}

function fillArray<T>(object: T, length: number): T[] {
  const array: T[] = [];
  for (let i = 0; i < length; i++)
    array[i] = object;
  return array;
}

export {
  addDivContainer,
  fillArray
}
