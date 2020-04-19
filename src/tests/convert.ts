import * as test from "tape";

import {convert} from "../convert";

test("convert test", (t) => {
    {
        const expected = `syntax = "proto3";

message SomeMessage {
}`;

        t.equal(convert("{}").success, expected);
    }

    {
        const expected = `syntax = "proto3";

message SomeMessage {
    int32 id = 1;
}`;

        t.equal(convert(`{"id":1}`).success, expected);
    }

    t.end();
});