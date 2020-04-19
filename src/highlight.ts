import hljs from "@highlightjs/highlight.js/lib/core";
import protobuf from "@highlightjs/highlight.js/lib/languages/protobuf";

hljs.registerLanguage("protobuf", protobuf);

export default function highlight(source: string): string {
    return hljs.highlight("protobuf", source).value;
}