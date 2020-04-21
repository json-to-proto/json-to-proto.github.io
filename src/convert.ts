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

class Collector {
    private imports: Set<string>;
    private messages: Array<Array<string>>;
    private messageNameSuffixCounter: { [key: string]: number; };

    constructor() {
        this.imports = new Set<string>()
        this.messages = [];
        this.messageNameSuffixCounter = {};
    }

    addImport(importPath: string) {
        this.imports.add(importPath);
    }

    generateUniqueName(source: string): string {
        if (this.messageNameSuffixCounter.hasOwnProperty(source)) {
            const suffix = this.messageNameSuffixCounter[source];

            this.messageNameSuffixCounter[source] = suffix + 1;

            return `${source}${suffix}`
        }

        this.messageNameSuffixCounter[source] = 1;

        return source;
    }

    addMessage(lines: Array<string>) {
        this.messages.push(lines);
    }

    getImports(): Set<string> {
        return this.imports;
    }

    getMessages(): Array<Array<string>> {
        return this.messages;
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

        return new Result(analyze(json, options), "");
    } catch (e) {
        return new Result("", e.message);
    }
}

function addShift(inline: boolean): string {
    if (inline) {
        return `    `;
    }

    return "";
}

function analyze(json: Object, options: Options): string {
    const shift = addShift(options.inline);

    const collector = new Collector();

    const lines = [];

    if (Array.isArray(json)) {
        const array = json;

        if (array.length === 0) {
            collector.addImport("google/protobuf/any.proto");

            lines.push(`    repeated google.protobuf.Any items = 1;`);

            return render(collector.getImports(), [], lines, options);
        }

        const value = array[0];
        let typeName = analyzeType(value, collector);

        if (typeName === "object") {
            typeName = "SomeNestedMessage";

            addNested(collector, typeName, value, shift);
        }

        lines.push(`    repeated ${typeName} items = 1;`);

        return render(collector.getImports(), collector.getMessages(), lines, options);
    }

    {
        let index = 1;

        for (const [key, value] of Object.entries(json)) {
            let typeName = analyzeType(value, collector);

            if (typeName === "object") {
                typeName = collector.generateUniqueName(toMessageName(key));

                addNested(collector, typeName, value, shift);
            }

            lines.push(`    ${typeName} ${key} = ${index};`);

            index += 1;
        }
    }

    return render(collector.getImports(), collector.getMessages(), lines, options);
}

function addNested(collector: Collector, messageName: string, source: object, shift: string) {
    const lines = [];

    lines.push(`${shift}message ${messageName} {`);

    let index = 1;

    for (const [key, value] of Object.entries(source)) {
        let typeName = analyzeType(value, collector);

        if (typeName === "object") {
            typeName = collector.generateUniqueName(toMessageName(key));

            addNested(collector, typeName, value, shift);
        }

        lines.push(`${shift}    ${typeName} ${key} = ${index};`);

        index += 1;
    }

    lines.push(`${shift}}`);

    collector.addMessage(lines);
}

function toMessageName(source: string): string {
    return source.charAt(0).toUpperCase() + source.substr(1).toLowerCase();
}

function wrap(source: Array<string>): Array<Array<string>> {
    if (source.length === 0) {
        return [];
    }

    return [source];
}

function render(imports: Set<string>, messages: Array<Array<string>>, lines: Array<string>, options: Options): string {
    const result = [];

    result.push(`syntax = "proto3";`);

    if (imports.size > 0) {
        result.push("");

        for (const importName of imports) {
            result.push(`import "${importName}";`);
        }
    }

    result.push("");
    if (options.inline) {
        result.push("message SomeMessage {");
        if (messages.length > 0) {
            result.push("");
            for (const message of messages) {
                result.push(...message);
                result.push("");
            }
        }
        result.push(...lines);
        result.push("}");
    } else {
        for (const message of messages) {
            result.push(...message);
            result.push("");
        }

        result.push("message SomeMessage {");
        result.push(...lines);
        result.push("}");
    }

    return result.join("\n");
}

function analyzeType(value: any, collector: Collector): string {
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
                collector.addImport("google/protobuf/any.proto");

                return "google.protobuf.Any";
            }

            return "object";
    }

    collector.addImport("google/protobuf/any.proto");

    return "google.protobuf.Any"
}