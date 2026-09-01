---
title: "Running Claude Code in Safehouse while keeping Superset agent status"
date: 2026-09-01T00:53:10-03:00
summary: "How to run Claude Code inside Safehouse while keeping Superset agent status"
tags: [safehouse, superset, claude-code, agent-status]
---

# Running Claude Code in Safehouse while keeping Superset agent status

I use [Superset](https://superset.sh) to orchestrate my AI coding sessions and Git worktrees, and [Agent Safehouse](https://agent-safehouse.dev) to sandbox the agents.

The setup works well, except for one problem: **Superset couldn't detect the agent status when Claude Code was running inside Safehouse.**

Superset uses lifecycle hooks and environment variables to track the agent status. Its hooks check for Superset-provided environment variables before reporting the agent state.

Safehouse, on the other hand, sanitizes the environment by default. It supports explicitly passing selected environment variables with `--env-pass`.

So the problem wasn't a missing filesystem permission or a Safehouse networking rule. **The `SUPERSET_*` environment variables simply weren't reaching Claude Code inside the sandbox.**

The fix was to pass all Superset variables through Safehouse:

```bash
safehouse \
  --enable=shell-init \
  --enable=docker \
  --env-pass="$(env | grep '^SUPERSET_' | sed 's/=.*//' | paste -sd, -)" \
  --add-dirs=~/my-ai-skills:~/.superset \
  -- \
  claude
```

The important part is:

```bash
--env-pass="$(env | grep '^SUPERSET_' | sed 's/=.*//' | paste -sd, -)"
```

This dynamically gets the names of all `SUPERSET_*` variables from the current environment and tells Safehouse to pass them into the sandbox.

I also use:

- `--enable=shell-init` because I want the normal shell initialization inside the sandbox.
- `--enable=docker` because Claude needs Docker access.
- `--add-dirs=~/my-ai-skills:~/.superset` to expose my AI skills and Superset's directory.
- `-- claude` to run Claude Code inside the Safehouse sandbox.

After passing the `SUPERSET_*` environment variables, **Superset agent status** works normally again while Claude remains sandboxed.

So if you're using Superset + Safehouse and agent status isn't working, check the environment first. You probably don't need to weaken the Safehouse sandbox — you just need to pass Superset's environment variables through it.