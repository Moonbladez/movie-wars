const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData,
}) => {
    //render contents to root class in html
    root.innerHTML = `
    <label><b>Search: </b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
      </div>
    </div>
  `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');


    const onInput = async event => {
        const items = await fetchData(event.target.value);

        //no results are brought back, close drop down and return early with nothing
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        //clear search result
        resultsWrapper.innerHTML = ""

        //when we get results add them to dropdown and expand dropdown with class
        dropdown.classList.add("is-active")

        for (let item of items) {
            //generate option
            const option = document.createElement("a");

            option.classList.add("dropdown-item")
            //make it tabable for a11y
            option.setAttribute("tabindex", "0")
            option.innerHTML = renderOption(item)

            //once selection has been made. Close dropdown and add exact text into input
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active")
                input.value = inputValue(item)
                onOptionSelect(item)
            })


            resultsWrapper.appendChild(option)
        }
    }

    input.addEventListener("input", debounce(onInput))

    //global even listener (bubbles up DOM)
    document.addEventListener("click", event => {
        //if click event is anywhere but the root, close the autocomplete
        if (!root.contains(event.target)) {
            dropdown.classList.remove("is-active")
        }
    })
}