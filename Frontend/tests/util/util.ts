function addDivContainer(): HTMLDivElement {
  const div = document.createElement("div");
  div.id = "app";
  document.body.appendChild(div);
  return div;
}

export {
  addDivContainer
}
