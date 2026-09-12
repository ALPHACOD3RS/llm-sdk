# Releasing

This package uses [Changesets](https://github.com/changesets/changesets) for versioning and
changelogs, and stays on `0.x` for now.

## Everyday change (stable release)

1. On your PR branch, run `npm run changeset` and describe the change. Pick `patch` or `minor`
   (this repo stays pre-1.0, so treat `minor` as "notable/breaking" and `patch` as "fix/internal").
2. Commit the generated `.changeset/*.md` file with your PR.
3. Merge to `main`. The `release` workflow (`.github/workflows/release.yml`) either:
   - opens/updates a **"Version Packages"** PR that bumps `package.json` and `CHANGELOG.md`, or
   - if that PR was just merged, publishes the new version to npm under the `latest` tag.

Nothing publishes to npm until the "Version Packages" PR is merged.

## Canary builds

Push (or merge a PR) to the `canary` branch with at least one pending changeset, and
`.github/workflows/canary.yml` publishes a snapshot build under the `canary` npm dist-tag —
version like `0.1.1-canary-<timestamp>`, never a version anyone would land on by accident via a
normal semver range.

```bash
npm install llm-sdk-js@canary
```

`canary` is for trying unreleased changes; it does not move `main` or the `latest` tag.

## One-time setup (repo/npm admin)

- Add an npm **automation token** as the `NPM_TOKEN` secret in the GitHub repo settings — both
  workflows expect it.
- Confirm the `llm-sdk-js` name/scope is available and owned by the account that token belongs to
  before the first publish.
