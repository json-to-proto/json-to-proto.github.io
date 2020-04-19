import hljs from "@highlightjs/highlight.js/lib/core";
import protobuf from "@highlightjs/highlight.js/lib/languages/protobuf";

hljs.registerLanguage("protobuf", protobuf);

export default function highlight(source: string): string {
    initOnce();

    return hljs.highlight("protobuf", source).value;
}

let initOnce = function() {
    css("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/styles/default.min.css");

    initOnce = function () {};
};

function css(url) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');

    link.rel = "stylesheet";
    link.href = url;

    head.appendChild(link);
}