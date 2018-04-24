#!/usr/bin/env node
"use strict";

const Tilda = require("tilda")
    , gitChangeAuthor = require("..")
    , spawn = require("spawno")
    ;

new Tilda(`${__dirname}/../package.json`, {
    options: [{
        name: "force",
        opts: ["f", "force"],
        desc: "Wheter to force the overwriting of the git backup.",
        type: Boolean
    }],
    args: [{
        name: "email"
      , desc: "The author email to set."
    }, {
        name: "name"
      , desc: "The author name to set."
    }]
}).main(action => {
    const email = action.args.email
    const name = action.args.name
    const proc = spawn("git", ["filter-branch", action.options.force.is_provided ? "-f" : null, "--env-filter", `
        CORRECT_NAME="${email}"
        CORRECT_EMAIL="${name}"
        export GIT_COMMITTER_NAME="$CORRECT_NAME"
        export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
        export GIT_AUTHOR_NAME="$CORRECT_NAME"
        export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
    `, "--tag-name-filter", "cat", "--", "--branches", "--tags"].filter(Boolean), {
        output: true
    })
});
