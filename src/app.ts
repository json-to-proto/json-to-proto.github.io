const $input = document.getElementById("input");
const $output = document.getElementById("output");

$input.addEventListener("keyup", function () {
    $output.innerHTML = convert($input.innerHTML.trim());
})

function convert(source: string): string {
    if (source === "{}") {
        return `syntax = "proto3";

message SomeMessage {}`;
    }

    return source;
}