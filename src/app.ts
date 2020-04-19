import highlight from "./highlight";

const $input = document.getElementById("input");
const $output = document.getElementById("output");

$input.addEventListener("keyup", function () {
    $output.innerHTML = exec($input.innerText.trim());
})

function exec(source: string): string {
    // hack that forces floats to stay as floats
    const text = source.replace(/\.0/g, ".1");

    try {
        const json = JSON.parse(text);

        return highlight(convert(json));
    } catch (e) {
        return e.message;
    }
}

function convert(json: Object): string {
    const lines = [];
    const imports = new Set<string>();

    {
        let index = 1;

        for (const [key, value] of Object.entries(json)) {
            const typeName = analyzeType(value, imports);

            lines.push(`\t ${typeName} ${key} = ${index};`);

            index += 1;
        }
    }

    const result = [];

    result.push(`syntax = "proto3";`);
    result.push("");

    if (imports.size > 0) {
        for (const importName of imports) {
            result.push(`import "${importName}";`);
        }

        result.push("");
    }

    result.push("message SomeMessage {");
    result.push(...lines);
    result.push("}");

    return result.join("\n");
}

function analyzeType(value: any, imports: Set<string>): string {
    switch (typeof value) {
        case "string":
            return "string";
        case "number":
            if (value % 1 === 0) {
                if (value > -2147483648 && value < 2147483647) {
                    return "int32";
                }

                return "int64";
            }

            return "double";
        case "boolean":
            return "bool";
    }

    imports.add("google/protobuf/any.proto");

    return "google.protobuf.Any"
}