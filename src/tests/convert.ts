import * as test from "tape";

import {convert, Options} from "../convert";

test("convert test", (t) => {
    const options = new Options(true, false, true, false);

    function assert(json: string, protobuf: string, overrideOptions?: Options) {
        t.equal(convert(json, overrideOptions ?? options).success, protobuf);
    }

    // primitives
    {
        // null
        {
            // language=JSON
            const json = "null";

            assert(json, `syntax = "proto3";

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
        // language=JSON
        let json = "{}";

        assert(json, `syntax = "proto3";

message SomeMessage {
}`);

        // language=JSON
        json = `{
          "id": 1
        }`

        assert(json, `syntax = "proto3";

message SomeMessage {
    uint32 id = 1;
}`);

        // language=JSON
        json = `{
          "person": {
            "firstName": "John",
            "lastName": "Doe"
          },
          "favoriteFood": "pizza"
        }`

        assert(json, `syntax = "proto3";

message SomeMessage {

    message Person {
        string firstName = 1;
        string lastName = 2;
    }

    Person person = 1;
    string favoriteFood = 2;
}`);


        // language=JSON
        json = `{
          "person": {
            "firstName": "John",
            "lastName": "Doe"
          },
          "favoriteFood": "pizza"
        }`

        assert(json, `syntax = "proto3";

message SomeMessage {

    message Person {
        string first_name = 1;
        string last_name = 2;
    }

    Person person = 1;
    string favorite_food = 2;
}`, new Options(true, false, true, true));

        // language=JSON
        json = `{
          "id": 1,
          "name": "json-top-proto"
        }`

        assert(json, `syntax = "proto3";

message SomeMessage {
    uint32 id = 1;
    string name = 2;
}`);

        // language=JSON
        json = `{
          "id": 1,
          "name": null
        }`

        assert(json, `syntax = "proto3";

import "google/protobuf/any.proto";

message SomeMessage {
    uint32 id = 1;
    google.protobuf.Any name = 2;
}`);

        // language=JSON
        json = `{
          "id": 1,
          "name": "json-top-proto",
          "license": {
            "name": "MIT"
          }
        }`

        assert(json, `syntax = "proto3";

message SomeMessage {

    message License {
        string name = 1;
    }

    uint32 id = 1;
    string name = 2;
    License license = 3;
}`);

        // language=JSON
        json = `{
          "id": 1,
          "name": "json-top-proto",
          "license": {
            "name": "MIT"
          },
          "owner": {
            "id": 1
          },
          "tags": [
            "json",
            "protobuf"
          ]
        }`;

        assert(json, `syntax = "proto3";

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

        // language=JSON
        json = `{
          "id": 1,
          "project": {
            "id": 2,
            "site": {
              "url": "https://json-to-proto.github.io/"
            }
          }
        }`;

        assert(json, `syntax = "proto3";

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
            // language=JSON
            let json = "[1]";

            assert(json, `syntax = "proto3";

message SomeMessage {
    repeated uint32 items = 1;
}`);

            // language=JSON
            json = "[1, 4294967296]";

            // biggest type
            assert(json, `syntax = "proto3";

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

        // merge
        {
            // language=JSON
            let json = `{
              "company": {
                "id": 1,
                "name": "ReadyToTouch"
              },
              "organization": {
                "id": 1,
                "name": "ReadyToTouch"
              }
            }`;

            assert(json, `syntax = "proto3";

message SomeMessage {

    message Company {
        uint32 id = 1;
        string name = 2;
    }

    Company company = 1;
    Company organization = 2;
}`);

            // language=JSON
            json = `{
              "company": {
                "id": 1,
                "name": "ReadyToTouch",
                "isPublic": true
              },
              "organization": {
                "id": 1,
                "name": "ReadyToTouch",
                "isPublic": false
              }
            }`;

            assert(json, `syntax = "proto3";

message SomeMessage {

    message Company {
        uint32 id = 1;
        string name = 2;
        bool is_public = 3;
    }

    Company company = 1;
    Company organization = 2;
}`, new Options(true, false, true, true));
        }
    }

    t.end();
});