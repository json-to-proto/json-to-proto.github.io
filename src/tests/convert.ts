import * as test from "tape";

import {convert, Options} from "../convert";

test("convert test", (t) => {
    const options = new Options(true);

    function assert(json: string, protobuf: string) {
        t.equal(convert(json, options).success, protobuf);
    }

    // primitives
    {
        // null
        {
            assert("null", `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    google.protobuf.Any first = 1;
}`)
        }

        // int32
        {
            assert("1", `syntax = "proto3";

message SomeMessage {
    int32 first = 1;
}`)
        }

        // bool
        {
            assert("true", `syntax = "proto3";

message SomeMessage {
    bool first = 1;
}`)
        }

        // string
        {
            assert(`"text"`, `syntax = "proto3";

message SomeMessage {
    string first = 1;
}`)
        }

    }


    // object
    {
        assert("{}", `syntax = "proto3";

message SomeMessage {
}`);

        assert(`{"id":1}`, `syntax = "proto3";

message SomeMessage {
    int32 id = 1;
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

        assert(`{"id":1,"name":"json-top-proto","license":{"name":"MIT"},"owner":{"id":1},"tags":["json","protobuf"]}`, `syntax = "proto3";

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
    repeated string tags = 5;
}`);

        assert(`{"id":1,"project":{"id":2,"site":{"url":"https://json-to-proto.github.io/"}}}`, `syntax = "proto3";

message SomeMessage {

    message Site {
        string url = 1;
    }

    message Project {
        int32 id = 1;
        Site site = 2;
    }

    int32 id = 1;
    Project project = 2;
}`)
    }

    {

        assert("[]", `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    repeated google.protobuf.Any items = 1;
}`);

        assert("[1]", `syntax = "proto3";

message SomeMessage {
    repeated int32 items = 1;
}`);

        assert(`[{"id":1}]`, `syntax = "proto3";

message SomeMessage {

    message Nested {
        int32 id = 1;
    }

    repeated Nested items = 1;
}`);
    }

    t.end();
});