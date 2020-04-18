const $input = document.getElementById("input");
const $output = document.getElementById("output");

$input.addEventListener("keyup", function () {
    $output.innerHTML = convert($input.innerHTML);
})

function convert(source: string): string {
    return source;
}