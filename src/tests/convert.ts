import * as test from "tape";

import {convert, Options} from "../convert";

test("convert test", (t) => {
    const options = new Options(true);

    function assert(json: string, protobuf: string) {
        t.equal(convert(json, options).success, protobuf);
    }

    assert("{}", `syntax = "proto3";

message SomeMessage {
}`);

    assert(`{"id":1}`, `syntax = "proto3";

message SomeMessage {
    int32 id = 1;
}`);

    assert("[]", `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    repeated google.protobuf.Any = 1;
}`);

    assert(`{"id":1,"name":"json-top-proto"}`, `syntax = "proto3";

message SomeMessage {
    int32 id = 1;
    string name = 2;
}`);

    assert(`{"id":1,"name":null}`, `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    int32 id = 1;
    google.protobuf.Any name = 2;
}`);

    assert(`{"id":1,"name":"json-top-proto","license":{"name":"MIT"}}`, `syntax = "proto3";

message SomeMessage {

    message License {
        string name = 1;
    }

    int32 id = 1;
    string name = 2;
    License license = 3;
}`);

    t.end();
});