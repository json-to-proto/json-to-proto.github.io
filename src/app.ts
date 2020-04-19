import highlight from "./highlight";
import {convert, Options} from "./convert";

const $input = document.getElementById("input");
const $output = document.getElementById("output");
const $inline = document.getElementById("inline") as HTMLInputElement;

const options = new Options($inline.checked);

function doConversion() {
    const result = convert($input.innerText.trim(), options);

    if (result.success) {
        $output.innerHTML = highlight(result.success);
    } else {
        $output.innerHTML = result.error;
    }
}

$input.addEventListener("keyup", doConversion);

$inline.addEventListener("change", function () {
    options.inline = $inline.checked;

    doConversion();
});