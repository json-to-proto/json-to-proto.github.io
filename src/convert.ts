class Result {
    constructor(
        public readonly success: string,
        public readonly error: string,
    ) {
    }
}

export class Options {
    constructor(public inline: boolean) {
    }
}

export function convert(source: string, options: Options): Result {
    if (source === "") {
        return new Result("", "");
    }

    // hack that forces floats to stay as floats
    const text = source.replace(/\.0/g, ".1");

    try {
        const json = JSON.parse(text);

        return new Result(analyze(json), "");
    } catch (e) {
        return new Result("", e.message);
    }
}

function analyze(json: Object): string {
    const lines = [];
    const imports = new Set<string>();
    const messages = [];

    if (Array.isArray(json)) {
        const array = json;

        if (array.length === 0) {
            imports.add("google/protobuf/any.proto");

            lines.push(`    repeated google.protobuf.Any some_key = 1;`);

            return render(imports, messages, lines);
        }

        const value = array[0];
        let typeName = analyzeType(value, imports, 0);

        if (typeName === "object") {
            typeName = "SomeNestedMessage";

            messages.push("");
            messages.push(`    message ${typeName} {`);

            let nestedIndex = 1;

            for (const [key, nestedValue] of Object.entries(value)) {

                let nestedTypeName = analyzeType(nestedValue, imports, 1);

                messages.push(`        ${nestedTypeName} ${key} = ${nestedIndex};`);

                nestedIndex += 1;
            }

            messages.push(`    }`);
            messages.push("");
        }

        lines.push(`    repeated ${typeName} some_key = 1;`);

        return render(imports, messages, lines);
    }

    {
        let index = 1;

        for (const [key, value] of Object.entries(json)) {
            let typeName = analyzeType(value, imports, 0);

            if (typeName === "object") {
                typeName = key.charAt(0).toUpperCase() + key.substr(1).toLowerCase()

                messages.push("");
                messages.push(`    message ${typeName} {`);

                let nestedIndex = 1;

                for (const [key, nestedValue] of Object.entries(value)) {

                    let nestedTypeName = analyzeType(nestedValue, imports, 1);

                    messages.push(`        ${nestedTypeName} ${key} = ${nestedIndex};`);

                    nestedIndex += 1;
                }

                messages.push(`    }`);
                messages.push("");
            }

            lines.push(`    ${typeName} ${key} = ${index};`);

            index += 1;
        }
    }

    return render(imports, messages, lines);
}

function render(imports: Set<string>, messages: Array<string>, lines: Array<string>): string {
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
    result.push(...messages);
    result.push(...lines);
    result.push("}");

    return result.join("\n");
}

function analyzeType(value: any, imports: Set<string>, depth: number): string {
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
        case "object":
            if (value === null) {
                imports.add("google/protobuf/any.proto");

                return "google.protobuf.Any";
            }

            if (depth === 0) {
                return "object";
            }
    }

    imports.add("google/protobuf/any.proto");

    return "google.protobuf.Any"
}