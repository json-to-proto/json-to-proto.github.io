const $input = document.getElementById("input");
const $output = document.getElementById("output");

$input.addEventListener("keyup", function () {
    $output.innerHTML = $input.innerHTML;
})