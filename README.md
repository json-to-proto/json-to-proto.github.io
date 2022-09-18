# JSON to Protobuf online [![Mentioned in Awesome Go](https://awesome.re/mentioned-badge.svg)](https://github.com/avelino/awesome-go#json)

Translates [JSON into a Protobuf](https://json-to-proto.github.io/) type in your browser instantly

Inspired by [JSON to Go](https://mholt.github.io/json-to-go/)

# Example
### Input JSON:

```json
{
  "id": 23357588,
  "node_id": "MDEwOlJlcG9zaXRvcnkyMzM1NzU4OA==",
  "name": "protobuf",
  "full_name": "protocolbuffers/protobuf",
  "private": false,
  "owner": {
    "login": "protocolbuffers",
    "id": 26310541,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjI2MzEwNTQx",
    "avatar_url": "https://avatars1.githubusercontent.com/u/26310541?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/protocolbuffers",
    "html_url": "https://github.com/protocolbuffers",
    "followers_url": "https://api.github.com/users/protocolbuffers/followers",
    "following_url": "https://api.github.com/users/protocolbuffers/following{/other_user}",
    "gists_url": "https://api.github.com/users/protocolbuffers/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/protocolbuffers/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/protocolbuffers/subscriptions",
    "organizations_url": "https://api.github.com/users/protocolbuffers/orgs",
    "repos_url": "https://api.github.com/users/protocolbuffers/repos",
    "events_url": "https://api.github.com/users/protocolbuffers/events{/privacy}",
    "received_events_url": "https://api.github.com/users/protocolbuffers/received_events",
    "type": "Organization",
    "site_admin": false
  },
  "html_url": "https://github.com/protocolbuffers/protobuf",
  "description": "Protocol Buffers - Google's data interchange format",
  "fork": false,
  "url": "https://api.github.com/repos/protocolbuffers/protobuf",
  "forks_url": "https://api.github.com/repos/protocolbuffers/protobuf/forks",
  "keys_url": "https://api.github.com/repos/protocolbuffers/protobuf/keys{/key_id}",
  "collaborators_url": "https://api.github.com/repos/protocolbuffers/protobuf/collaborators{/collaborator}",
  "teams_url": "https://api.github.com/repos/protocolbuffers/protobuf/teams",
  "hooks_url": "https://api.github.com/repos/protocolbuffers/protobuf/hooks",
  "issue_events_url": "https://api.github.com/repos/protocolbuffers/protobuf/issues/events{/number}",
  "events_url": "https://api.github.com/repos/protocolbuffers/protobuf/events",
  "assignees_url": "https://api.github.com/repos/protocolbuffers/protobuf/assignees{/user}",
  "branches_url": "https://api.github.com/repos/protocolbuffers/protobuf/branches{/branch}",
  "tags_url": "https://api.github.com/repos/protocolbuffers/protobuf/tags",
  "blobs_url": "https://api.github.com/repos/protocolbuffers/protobuf/git/blobs{/sha}",
  "git_tags_url": "https://api.github.com/repos/protocolbuffers/protobuf/git/tags{/sha}",
  "git_refs_url": "https://api.github.com/repos/protocolbuffers/protobuf/git/refs{/sha}",
  "trees_url": "https://api.github.com/repos/protocolbuffers/protobuf/git/trees{/sha}",
  "statuses_url": "https://api.github.com/repos/protocolbuffers/protobuf/statuses/{sha}",
  "languages_url": "https://api.github.com/repos/protocolbuffers/protobuf/languages",
  "stargazers_url": "https://api.github.com/repos/protocolbuffers/protobuf/stargazers",
  "contributors_url": "https://api.github.com/repos/protocolbuffers/protobuf/contributors",
  "subscribers_url": "https://api.github.com/repos/protocolbuffers/protobuf/subscribers",
  "subscription_url": "https://api.github.com/repos/protocolbuffers/protobuf/subscription",
  "commits_url": "https://api.github.com/repos/protocolbuffers/protobuf/commits{/sha}",
  "git_commits_url": "https://api.github.com/repos/protocolbuffers/protobuf/git/commits{/sha}",
  "comments_url": "https://api.github.com/repos/protocolbuffers/protobuf/comments{/number}",
  "issue_comment_url": "https://api.github.com/repos/protocolbuffers/protobuf/issues/comments{/number}",
  "contents_url": "https://api.github.com/repos/protocolbuffers/protobuf/contents/{+path}",
  "compare_url": "https://api.github.com/repos/protocolbuffers/protobuf/compare/{base}...{head}",
  "merges_url": "https://api.github.com/repos/protocolbuffers/protobuf/merges",
  "archive_url": "https://api.github.com/repos/protocolbuffers/protobuf/{archive_format}{/ref}",
  "downloads_url": "https://api.github.com/repos/protocolbuffers/protobuf/downloads",
  "issues_url": "https://api.github.com/repos/protocolbuffers/protobuf/issues{/number}",
  "pulls_url": "https://api.github.com/repos/protocolbuffers/protobuf/pulls{/number}",
  "milestones_url": "https://api.github.com/repos/protocolbuffers/protobuf/milestones{/number}",
  "notifications_url": "https://api.github.com/repos/protocolbuffers/protobuf/notifications{?since,all,participating}",
  "labels_url": "https://api.github.com/repos/protocolbuffers/protobuf/labels{/name}",
  "releases_url": "https://api.github.com/repos/protocolbuffers/protobuf/releases{/id}",
  "deployments_url": "https://api.github.com/repos/protocolbuffers/protobuf/deployments",
  "created_at": "2014-08-26T15:52:15Z",
  "updated_at": "2020-04-21T23:33:50Z",
  "pushed_at": "2020-04-22T00:06:06Z",
  "git_url": "git://github.com/protocolbuffers/protobuf.git",
  "ssh_url": "git@github.com:protocolbuffers/protobuf.git",
  "clone_url": "https://github.com/protocolbuffers/protobuf.git",
  "svn_url": "https://github.com/protocolbuffers/protobuf",
  "homepage": "https://developers.google.com/protocol-buffers/",
  "size": 60901,
  "stargazers_count": 41099,
  "watchers_count": 41099,
  "language": "C++",
  "has_issues": true,
  "has_projects": true,
  "has_downloads": true,
  "has_wiki": true,
  "has_pages": true,
  "forks_count": 11124,
  "mirror_url": null,
  "archived": false,
  "disabled": false,
  "open_issues_count": 1009,
  "license": {
    "key": "other",
    "name": "Other",
    "spdx_id": "NOASSERTION",
    "url": null,
    "node_id": "MDc6TGljZW5zZTA="
  },
  "forks": 11124,
  "open_issues": 1009,
  "watchers": 41099,
  "default_branch": "master",
  "temp_clone_token": null,
  "organization": {
    "login": "protocolbuffers",
    "id": 26310541,
    "node_id": "MDEyOk9yZ2FuaXphdGlvbjI2MzEwNTQx",
    "avatar_url": "https://avatars1.githubusercontent.com/u/26310541?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/protocolbuffers",
    "html_url": "https://github.com/protocolbuffers",
    "followers_url": "https://api.github.com/users/protocolbuffers/followers",
    "following_url": "https://api.github.com/users/protocolbuffers/following{/other_user}",
    "gists_url": "https://api.github.com/users/protocolbuffers/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/protocolbuffers/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/protocolbuffers/subscriptions",
    "organizations_url": "https://api.github.com/users/protocolbuffers/orgs",
    "repos_url": "https://api.github.com/users/protocolbuffers/repos",
    "events_url": "https://api.github.com/users/protocolbuffers/events{/privacy}",
    "received_events_url": "https://api.github.com/users/protocolbuffers/received_events",
    "type": "Organization",
    "site_admin": false
  },
  "network_count": 11124,
  "subscribers_count": 2059
}
```

### Output Protobuf:

```protobuf
syntax = "proto3";

import "google/protobuf/any.proto";

message Owner {
    string login = 1;
    uint32 id = 2;
    string node_id = 3;
    string avatar_url = 4;
    string gravatar_id = 5;
    string url = 6;
    string html_url = 7;
    string followers_url = 8;
    string following_url = 9;
    string gists_url = 10;
    string starred_url = 11;
    string subscriptions_url = 12;
    string organizations_url = 13;
    string repos_url = 14;
    string events_url = 15;
    string received_events_url = 16;
    string type = 17;
    bool site_admin = 18;
}

message License {
    string key = 1;
    string name = 2;
    string spdx_id = 3;
    google.protobuf.Any url = 4;
    string node_id = 5;
}

message Organization {
    string login = 1;
    uint32 id = 2;
    string node_id = 3;
    string avatar_url = 4;
    string gravatar_id = 5;
    string url = 6;
    string html_url = 7;
    string followers_url = 8;
    string following_url = 9;
    string gists_url = 10;
    string starred_url = 11;
    string subscriptions_url = 12;
    string organizations_url = 13;
    string repos_url = 14;
    string events_url = 15;
    string received_events_url = 16;
    string type = 17;
    bool site_admin = 18;
}

message SomeMessage {
    uint32 id = 1;
    string node_id = 2;
    string name = 3;
    string full_name = 4;
    bool private = 5;
    Owner owner = 6;
    string html_url = 7;
    string description = 8;
    bool fork = 9;
    string url = 10;
    string forks_url = 11;
    string keys_url = 12;
    string collaborators_url = 13;
    string teams_url = 14;
    string hooks_url = 15;
    string issue_events_url = 16;
    string events_url = 17;
    string assignees_url = 18;
    string branches_url = 19;
    string tags_url = 20;
    string blobs_url = 21;
    string git_tags_url = 22;
    string git_refs_url = 23;
    string trees_url = 24;
    string statuses_url = 25;
    string languages_url = 26;
    string stargazers_url = 27;
    string contributors_url = 28;
    string subscribers_url = 29;
    string subscription_url = 30;
    string commits_url = 31;
    string git_commits_url = 32;
    string comments_url = 33;
    string issue_comment_url = 34;
    string contents_url = 35;
    string compare_url = 36;
    string merges_url = 37;
    string archive_url = 38;
    string downloads_url = 39;
    string issues_url = 40;
    string pulls_url = 41;
    string milestones_url = 42;
    string notifications_url = 43;
    string labels_url = 44;
    string releases_url = 45;
    string deployments_url = 46;
    string created_at = 47;
    string updated_at = 48;
    string pushed_at = 49;
    string git_url = 50;
    string ssh_url = 51;
    string clone_url = 52;
    string svn_url = 53;
    string homepage = 54;
    uint32 size = 55;
    uint32 stargazers_count = 56;
    uint32 watchers_count = 57;
    string language = 58;
    bool has_issues = 59;
    bool has_projects = 60;
    bool has_downloads = 61;
    bool has_wiki = 62;
    bool has_pages = 63;
    uint32 forks_count = 64;
    google.protobuf.Any mirror_url = 65;
    bool archived = 66;
    bool disabled = 67;
    uint32 open_issues_count = 68;
    License license = 69;
    uint32 forks = 70;
    uint32 open_issues = 71;
    uint32 watchers = 72;
    string default_branch = 73;
    google.protobuf.Any temp_clone_token = 74;
    Organization organization = 75;
    uint32 network_count = 76;
    uint32 subscribers_count = 77;
}
```
