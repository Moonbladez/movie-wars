//debounce wrapper that sets to envoke data default of 1 second
const debounce = (func, delay = 1000) => {
    //variable setting ID of particular settimeout method
    let timeoutId;
    return (...arg) => {
        //is timeoutId defined
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func.apply(null, arg);
        }, delay);
    }
}