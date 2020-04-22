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

        // uint32
        {
            assert("1", `syntax = "proto3";

message SomeMessage {
    uint32 first = 1;
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
    uint32 id = 1;
}`);

        assert(`{"id":1,"name":"json-top-proto"}`, `syntax = "proto3";

message SomeMessage {
    uint32 id = 1;
    string name = 2;
}`);

        assert(`{"id":1,"name":null}`, `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    uint32 id = 1;
    google.protobuf.Any name = 2;
}`);

        assert(`{"id":1,"name":"json-top-proto","license":{"name":"MIT"}}`, `syntax = "proto3";

message SomeMessage {

    message License {
        string name = 1;
    }

    uint32 id = 1;
    string name = 2;
    License license = 3;
}`);

        assert(`{"id":1,"name":"json-top-proto","license":{"name":"MIT"},"owner":{"id":1},"tags":["json","protobuf"]}`, `syntax = "proto3";

message SomeMessage {

    message License {
        string name = 1;
    }

    message Owner {
        uint32 id = 1;
    }

    uint32 id = 1;
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
        uint32 id = 1;
        Site site = 2;
    }

    uint32 id = 1;
    Project project = 2;
}`)
    }

    // array
    {

        assert("[]", `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    repeated google.protobuf.Any items = 1;
}`);

        {
            assert("[1]", `syntax = "proto3";

message SomeMessage {
    repeated uint32 items = 1;
}`);

            // biggest type
            assert("[1, 4294967296]", `syntax = "proto3";

message SomeMessage {
    repeated uint64 items = 1;
}`);
        }

        assert(`[{"id":1}]`, `syntax = "proto3";

message SomeMessage {

    message Nested {
        uint32 id = 1;
    }

    repeated Nested items = 1;
}`);
    }

    t.end();
});