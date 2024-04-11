const googleAnyImport = "google/protobuf/any.proto";
const googleTimestampImport = "google/protobuf/timestamp.proto";

const googleAny = "google.protobuf.Any";
const googleTimestamp = "google.protobuf.Timestamp";

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
const complexProtoType = new ProtoPrimitiveType(googleAny, true, false);
const timestampProtoType = new ProtoPrimitiveType(googleTimestamp, false, false);

export class Options {
    constructor(
        public inline: boolean,
        public googleProtobufTimestamp: boolean,
        public mergeSimilarObjects: boolean,
        public lowerSnakeCaseFieldNames: boolean,
    ) {
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

class Analyzer {
    private mergeSimilarObjectMap: { [index: string]: string } = {};

    constructor(private readonly options: Options) {

    }

    analyze(json: object): string {
        if (this.directType(json)) {
            return this.analyzeObject({"first": json});
        }

        if (Array.isArray(json)) {
            return this.analyzeArray(json)
        }

        return this.analyzeObject(json);
    }

    directType(value: any): boolean {
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

    analyzeArray(array: Array<any>): string {
        const inlineShift = this.addShift();
        const collector = new Collector();
        const lines = [];

        const typeName = this.analyzeArrayProperty("nested", array, collector, inlineShift)

        lines.push(`    ${typeName} items = 1;`);

        return render(collector.getImports(), collector.getMessages(), lines, this.options);
    }

    analyzeObject(json: object): string {
        const inlineShift = this.addShift();
        const collector = new Collector();
        const lines = [];
        let index = 1;

        for (const [key, value] of Object.entries(json)) {
            // It is assumed that the key is either in camelCase or snake_case (see https://jsonapi.org/recommendations/).
            const formattedKey = this.options.lowerSnakeCaseFieldNames ? key.replace(/([A-Z])/g, "_$1").toLowerCase() : key;
            const typeName = this.analyzeProperty(formattedKey, value, collector, inlineShift)

            lines.push(`    ${typeName} ${formattedKey} = ${index};`);

            index += 1;
        }

        return render(collector.getImports(), collector.getMessages(), lines, this.options);
    }

    analyzeArrayProperty(key: string, value: Array<any>, collector: Collector, inlineShift: string): string {
        // [] -> any
        const length = value.length;
        if (length === 0) {
            collector.addImport(googleAnyImport);

            return `repeated ${googleAny}`;
        }

        // [[...], ...] -> any
        const first = value[0];
        if (Array.isArray(first)) {
            collector.addImport(googleAnyImport);

            return `repeated ${googleAny}`;
        }

        if (length > 1) {
            const primitive = this.samePrimitiveType(value);

            if (primitive.complex === false) {
                return `repeated ${primitive.name}`;
            }
        }

        return `repeated ${this.analyzeObjectProperty(key, first, collector, inlineShift)}`;
    }

    analyzeProperty(key: string, value: any, collector: Collector, inlineShift: string): string {
        if (Array.isArray(value)) {
            return this.analyzeArrayProperty(key, value, collector, inlineShift);
        }

        return this.analyzeObjectProperty(key, value, collector, inlineShift);
    }

    analyzeObjectProperty(key: string, value: any, collector: Collector, inlineShift: string) {
        const typeName = this.analyzeType(value, collector);

        if (typeName === "object") {
            if (this.options.mergeSimilarObjects) {
                const [mergeSimilarObjectKey, canMerge] = this.mergeSimilarObjectKey(value);

                if (canMerge) {
                    if (this.mergeSimilarObjectMap.hasOwnProperty(mergeSimilarObjectKey)) {
                        return this.mergeSimilarObjectMap[mergeSimilarObjectKey];
                    }

                    const messageName = collector.generateUniqueName(toMessageName(key));

                    this.mergeSimilarObjectMap[mergeSimilarObjectKey] = messageName;

                    this.addNested(collector, messageName, value, inlineShift);

                    return messageName;
                }
            }

            const messageName = collector.generateUniqueName(toMessageName(key));

            this.addNested(collector, messageName, value, inlineShift);

            return messageName;
        }

        return typeName;
    }

    mergeSimilarObjectKey(source: object): [string, boolean] {
        const lines = [];

        for (const [key, value] of Object.entries(source)) {
            const [typeName, canMerge] = this.mergeSimilarObjectType(value);

            if (canMerge) {
                lines.push([key, typeName])
            } else {
                return ["", false];
            }
        }

        return [JSON.stringify(lines), true]
    }

    mergeSimilarObjectType(value: any): [string, boolean] {
        if (Array.isArray(value)) {
            return ["", false];
        }

        switch (typeof value) {
            case "string":
                if (this.options.googleProtobufTimestamp && /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(\+\d\d:\d\d|Z)/.test(value)) {
                    return [googleTimestamp, true];
                } else {
                    return ["string", true];
                }
            case "number":
                return [numberType(value), true];
            case "boolean":
                return ["bool", true];
        }

        return ["", false];
    }

    analyzeType(value: any, collector: Collector): string {
        switch (typeof value) {
            case "string":
                if (this.options.googleProtobufTimestamp && /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(\+\d\d:\d\d|Z)/.test(value)) {
                    collector.addImport(googleTimestampImport);

                    return googleTimestamp;
                } else {
                    return "string";
                }
            case "number":
                return numberType(value);
            case "boolean":
                return "bool";
            case "object":
                if (value === null) {
                    collector.addImport(googleAnyImport);

                    return googleAny;
                }

                return "object";
        }

        collector.addImport(googleAnyImport);

        return googleAny;
    }

    toPrimitiveType(value: any): ProtoPrimitiveType {
        switch (typeof value) {
            case "string":
                if (this.options.googleProtobufTimestamp && /\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(\+\d\d:\d\d|Z)/.test(value)) {
                    return timestampProtoType;
                } else {
                    return stringProtoPrimitiveType;
                }
            case "number":
                return new ProtoPrimitiveType(numberType(value), false, true);
            case "boolean":
                return boolProtoPrimitiveType;
        }

        return complexProtoType;
    }

    samePrimitiveType(array: Array<any>): ProtoPrimitiveType {
        let current = this.toPrimitiveType(array[0]);
        if (current.complex) {
            return current;
        }

        for (let i = 1; i < array.length; i++) {
            const next = this.toPrimitiveType(array[i]);

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

    addNested(collector: Collector, messageName: string, source: object, inlineShift: string) {
        const lines = [];

        lines.push(`${inlineShift}message ${messageName} {`);

        let index = 1;

        for (const [key, value] of Object.entries(source)) {
            // It is assumed that the key is either in camelCase or snake_case (see https://jsonapi.org/recommendations/).
            const formattedKey = this.options.lowerSnakeCaseFieldNames ? key.replace(/([A-Z])/g, "_$1").toLowerCase() : key; 
            const typeName = this.analyzeProperty(formattedKey, value, collector, inlineShift)

            lines.push(`${inlineShift}    ${typeName} ${formattedKey} = ${index};`);

            index += 1;
        }

        lines.push(`${inlineShift}}`);

        collector.addMessage(lines);
    }

    addShift(): string {
        if (this.options.inline) {
            return `    `;
        }

        return "";
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

        const analyzer = new Analyzer(options);

        return new Result(analyzer.analyze(json), "");
    } catch (e) {
        return new Result("", e.message);
    }
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