export class fuzzySearch {
  constructor(inputElement, optionsArray) {
    this.focus = -1;
    this.inputElement = inputElement;
    this.optionsArray = optionsArray;

    this.inputHandler = this.inputHandler.bind(this);
    this.keydownHandler = this.keydownHandler.bind(this);
    this.optionClickHandler = this.optionClickHandler.bind(this);

    // Add options list
    this.optionsList = document.createElement("DIV");
    this.optionsList.setAttribute("class", "autocomplete-items");
    this.inputElement.parentNode.appendChild(this.optionsList);

    inputElement.addEventListener("input", this.inputHandler);
    inputElement.addEventListener("keydown", this.keydownHandler);
    document.addEventListener("click", e => this.closeList());
  }
  get currentFocus() {
    return this.focus;
  }
  set currentFocus(index) {
    const options = this.optionsList.getElementsByTagName("div");
    if (!options || !options.length) return (this.focus = -1);

    this.focus = index >= options.length ? options.length - 1 : index < 0 ? 0 : index;
    const currentSelected = this.optionsList.querySelector(".autocomplete-active");
    if (currentSelected) currentSelected.classList.remove("autocomplete-active");

    options[this.focus].classList.add("autocomplete-active");
  }
  inputHandler(e) {
    const val = e.target.value;
    this.closeList();
    this.currentFocus = -1;
    if (!val) return;
    const results = fuzzysort.go(val, this.optionsArray);
    for (const result of results) {
      const option = document.createElement("DIV");
      option.innerHTML += fuzzysort.highlight(result, "<strong>", "</strong>");
      option.innerHTML += "<input type='hidden' value='" + result.target + "'>";
      option.addEventListener("click", this.optionClickHandler);
      this.optionsList.appendChild(option);
    }
    if (results.length) this.currentFocus = 0;
  }
  optionClickHandler(e) {
    e.preventDefault();
    this.inputElement.value = (e.target.tagName === "DIV"
      ? e.target
      : e.target.parentNode
    ).getElementsByTagName("input")[0].value;
    this.inputElement.focus();
    this.closeList();
    this.inputElement.form.querySelector("input[type=submit]").click();
  }
  keydownHandler(e) {
    if (![13, 38, 40].includes(e.keyCode)) return;
    e.preventDefault();
    if (e.keyCode == 13) {
      const options = this.optionsList.getElementsByTagName("div");
      if (options && options.length) options[Math.max(this.currentFocus, 0)].click();
      return;
    }
    this.currentFocus += e.keyCode == 40 ? 1 : -1;
  }
  closeList() {
    while (this.optionsList.lastElementChild) this.optionsList.lastElementChild.remove();
  }
}
