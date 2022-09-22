# Roadmap

## Phase 1

- [x] Selectors seem hardcoded to one label only. Need to generalize.
- [x] Options for JSON or markdown.
- [x] Options to capture card URLs (it may take longer since we have to click each card and close it in order to get the URL. Also, we need to use a setTimeout and most likely a Promise to return all of the data once completed.
- [x] Can we make it a CLI tool that prompts the user to perform the manual actions and then click to proceed?
- [x] Save generated files with timestamp of last edited date and time in Google Keep.

## Phase 2

- [x] Refactoring
- [x] Documentation and instructions
- [x] Publish to NPM as v0.0.1 release

## Phase 3

- [ ] Mocha unit tests
- [ ] Automate publishing process to NPM if tests succeed.
- [x] Can we automate the scrolling?
- [ ] Make it an executable binary (./keep.js instead of npm start) with options to specify output folder.
- [ ] Allow it to work with checked items. Currently, it only works with unchecked boxes.
- [ ] Can we automate selecting labels?
- [ ] Automate detecting page load. This may enable us to eliminate the prompt and hide the browser (running headlessly).
- [ ] Could we make it run headlessly so it appears seamless?  How would we deal with the session issue?
- [ ] If user isn't logged in, close the session and reopen headfully.  Ask them to login. After they login, close the session and re-open it headlessly. This gives a more seamless user experience by hiding the browser and only showing it when needed or requested.

## Phase 4

- [ ] Run it in GitHub Actions with the user-data-dir. How do we send to the action without committing this profile? Repo dispatch only takes up to 25MB of data. Possibly user-data-dir could be uploaded as an artifact with github-releases? The releases workflow trigger can then prompt to download the artifact to the workflow. How big can a base64 secret be? 64KB. Will the user-data-dir folder even be portable between machines? (Assumes user-data-dir is portable across machines and that Google won't force reauthentication).
