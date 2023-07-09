# Talkgunmai API

API for social media Talkgunmai where users can signup and post their story, status, and upload image

# Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a Mac / Linux Workstation.
- You have installed the following software:
  - Node (14.x or above)

# Running Local Development
```
cd node-restapi
npm install
npm start
```

# Environment Variables

- `MONGO_USERNAME`: mongoDB username
- `MONGO_PASSWORD`: mongoDB password

# Conventional commit
`<type>`(`<scope>`): `<description>`

Since our JIRA does not yet integrate with our GitHub, it is needless to prefix your commit with JIRA's ticket.

## Type

- _fix_: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in semantic versioning).

- _feat_: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in semantic
  versioning).

- _refactor_: a commit of the type refactor organizes a codebase without changing its logic.

- _chore_: a commit of the type chore is the change that does not affect the meaning of the code (white-space,
  formatting, missing semi-colons, comments, etc)

- _docs_: a commit of the type docs is for a documentation only changes i.e., update readme file.

- _ci_: a commit of type ci changes CI configuration files and scripts.

- _build_: a commit of the type build changes the build system or external dependencies (example scopes: gulp, broccoli,
  npm).

- _test_: a commit of the type test adds the missing tests or correct the existing tests.
