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
    repeated google.protobuf.Any some_key = 1;
}`);

    assert("[1]", `syntax = "proto3";

message SomeMessage {
    repeated int32 some_key = 1;
}`);

    assert(`[{"id":1}]`, `syntax = "proto3";

message SomeMessage {

    message SomeNestedMessage {
        int32 id = 1;
    }

    repeated SomeNestedMessage some_key = 1;
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

    assert(`{"id":1,"name":"json-top-proto","license":{"name":"MIT"},"owner":{"id":1}}`, `syntax = "proto3";

message SomeMessage {

    message License {
        string name = 1;
    }

    message Owner {
        int32 id = 1;
    }

    int32 id = 1;
    string name = 2;
    License license = 3;
    Owner owner = 4;
}`);

    t.end();
});