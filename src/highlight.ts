import hljs from "highlight.js/lib/core";
import protobuf from "highlight.js/lib/languages/protobuf";

hljs.registerLanguage("protobuf", protobuf);

export default function highlight(source: string): string {
    return hljs.highlight(source, {language: "protobuf"}).value;
}
