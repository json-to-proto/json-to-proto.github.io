import highlight from "./highlight";
import {convert} from "./convert";

const $input = document.getElementById("input");
const $output = document.getElementById("output");

$input.addEventListener("keyup", function () {
    const result = convert($input.innerText.trim());

    if (result.success) {
        $output.innerHTML = highlight(result.success);
    } else {
        $output.innerHTML = result.error;
    }
});