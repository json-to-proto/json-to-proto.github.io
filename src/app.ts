import highlight from "./highlight";
import {convert, Options} from "./convert";

const $input = document.getElementById("input");
const $output = document.getElementById("output");
const $sample = document.getElementById("sample");
const $inline = document.getElementById("inline") as HTMLInputElement;

const options = new Options($inline.checked);

function doConversion() {
    const result = convert($input.innerText.trim(), options);

    if (result.success) {
        $output.innerHTML = highlight(result.success);
    } else {
        $output.innerHTML = result.error;
    }
}

$input.addEventListener("keyup", doConversion);

$inline.addEventListener("change", function () {
    options.inline = $inline.checked;

    doConversion();
});

$sample.addEventListener("click", function () {
    $input.innerHTML = sample;

    doConversion();
});

const sample = `{
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
}`;