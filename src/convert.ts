const defaultImport = "google/protobuf/any.proto";
const defaultAny = "google.protobuf.Any";

class Result {
    constructor(
        public readonly success: string,
        public readonly error: string,
    ) {
    }
}

class ProtoPrimitiveType {
    constructor(
        public readonly name: string,
        public readonly complex: boolean,
        public readonly merge: boolean,
    ) {
    }
}

const boolProtoPrimitiveType = new ProtoPrimitiveType("bool", false, false);
const stringProtoPrimitiveType = new ProtoPrimitiveType("string", false, false);
const int64ProtoPrimitiveType = new ProtoPrimitiveType("int64", false, true);
const complexProtoType = new ProtoPrimitiveType(defaultAny, true, false);

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

function analyze(json: object, options: Options): string {
    if (directType(json)) {
        return analyzeObject({"first": json}, options);
    }

    if (Array.isArray(json)) {
        return analyzeArray(json, options)
    }

    return analyzeObject(json, options);
}

function analyzeArray(array: Array<any>, options: Options): string {
    const inlineShift = addShift(options.inline);
    const collector = new Collector();
    const lines = [];

    const typeName = analyzeArrayProperty("nested", array, collector, inlineShift)

    lines.push(`    ${typeName} items = 1;`);

    return render(collector.getImports(), collector.getMessages(), lines, options);
}

function analyzeObject(json: object, options: Options): string {
    const inlineShift = addShift(options.inline);
    const collector = new Collector();
    const lines = [];
    let index = 1;

    for (const [key, value] of Object.entries(json)) {
        const typeName = analyzeProperty(key, value, collector, inlineShift)

        lines.push(`    ${typeName} ${key} = ${index};`);

        index += 1;
    }

    return render(collector.getImports(), collector.getMessages(), lines, options);
}

function analyzeArrayProperty(key: string, value: Array<any>, collector: Collector, inlineShift: string): string {
    // [] -> any
    const length = value.length;
    if (length === 0) {
        collector.addImport(defaultImport);

        return `repeated ${defaultAny}`;
    }

    // [[...], ...] -> any
    const first = value[0];
    if (Array.isArray(first)) {
        collector.addImport(defaultImport);

        return `repeated ${defaultAny}`;
    }

    if (length > 1) {
        const primitive = samePrimitiveType(value);

        if (primitive.complex === false) {
            return `repeated ${primitive.name}`;
        }
    }

    return `repeated ${analyzeObjectProperty(key, first, collector, inlineShift)}`;
}

function analyzeProperty(key: string, value: any, collector: Collector, inlineShift: string): string {
    if (Array.isArray(value)) {
        return analyzeArrayProperty(key, value, collector, inlineShift);
    }

    return analyzeObjectProperty(key, value, collector, inlineShift);
}

function analyzeObjectProperty(key: string, value: any, collector: Collector, inlineShift: string) {
    const typeName = analyzeType(value, collector);

    if (typeName === "object") {
        const messageName = collector.generateUniqueName(toMessageName(key));

        addNested(collector, messageName, value, inlineShift);

        return messageName;
    }

    return typeName;
}

function addNested(collector: Collector, messageName: string, source: object, inlineShift: string) {
    const lines = [];

    lines.push(`${inlineShift}message ${messageName} {`);

    let index = 1;

    for (const [key, value] of Object.entries(source)) {
        const typeName = analyzeProperty(key, value, collector, inlineShift)

        lines.push(`${inlineShift}    ${typeName} ${key} = ${index};`);

        index += 1;
    }

    lines.push(`${inlineShift}}`);

    collector.addMessage(lines);
}

function toMessageName(source: string): string {
    return source.charAt(0).toUpperCase() + source.substr(1).toLowerCase();
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

function directType(value: any): boolean {
    switch (typeof value) {
        case "string":
        case "number":
        case "boolean":
            return true;
        case "object":
            return value === null;
    }

    return false;
}

function samePrimitiveType(array: Array<any>): ProtoPrimitiveType {
    let current = toPrimitiveType(array[0]);
    if (current.complex) {
        return current;
    }

    for (let i = 1; i < array.length; i++) {
        const next = toPrimitiveType(array[i]);

        if (next.complex) {
            return next;
        }

        current = mergePrimitiveType(current, next);
        if (current.complex) {
            return current;
        }
    }

    return current;
}

function mergePrimitiveType(a: ProtoPrimitiveType, b: ProtoPrimitiveType): ProtoPrimitiveType {
    if (a.name === b.name) {
        return a;
    }

    if (a.merge && b.merge) {
        if (a.name === "double") {
            return a;
        }

        if (b.name === "double") {
            return b;
        }

        if (a.name === "int64") {
            return a;
        }

        if (b.name === "int64") {
            return b;
        }

        if (a.name === "uint64") {
            if (b.name === "uint32") {
                return a;
            }
        } else if (b.name === "uint64") {
            if (a.name === "uint32") {
                return b;
            }
        }

        return int64ProtoPrimitiveType;
    }

    return complexProtoType;
}

function toPrimitiveType(value: any): ProtoPrimitiveType {
    switch (typeof value) {
        case "string":
            return stringProtoPrimitiveType;
        case "number":
            return new ProtoPrimitiveType(numberType(value), false, true);
        case "boolean":
            return boolProtoPrimitiveType;
    }

    return complexProtoType;
}

function analyzeType(value: any, collector: Collector): string {
    switch (typeof value) {
        case "string":
            return "string";
        case "number":
            return numberType(value);
        case "boolean":
            return "bool";
        case "object":
            if (value === null) {
                collector.addImport(defaultImport);

                return defaultAny;
            }

            return "object";
    }

    collector.addImport(defaultImport);

    return defaultAny;
}

function numberType(value: number): string {
    if (value % 1 === 0) {
        if (value < 0) {
            if (value < -2147483648) {
                return "int64";
            }

            return "int32";
        }

        if (value > 4294967295) {
            return "uint64";
        }

        return "uint32";
    }

    return "double";
}