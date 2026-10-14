# GitHub Manager Demo

A public, static showcase for the GitHub Manager local MVP.

**Watch:** https://nkaul.github.io/github-manager-demo/

**Deep dive:** https://nkaul.github.io/github-manager-demo/deep-dive/ — system design video overview and architecture podcast, both embedded from the owner’s public Google Drive links. No copy of either new recording is hosted in this repository. See the [deep-dive publication report](docs/deep-dive-publication.md).

The full Cedar walkthrough includes 32 chapters, English captions, a transcript, standalone audio and downloadable 1080p video. Narration is AI-generated. The recording uses a real account, with copy-only edits and resets; see the [recording notes](recordings/cedar-v2/recording-notes.html).

## Publishing

GitHub Pages publishes **main → /(root)**. The `.nojekyll` file keeps this buildless HTML/CSS/JavaScript site static. No dependency installation, environment variables or API keys are required. Use normal Git pushes for media; the MP4 is below GitHub’s 100 MiB file limit.

## Local preview

From the parent `repos` directory, run:

~~~bash
python3 -m http.server 8130 --bind 127.0.0.1
~~~

Then open http://127.0.0.1:8130/github-manager-demo/. Stop the server after preview; serve only this folder for a shared/public environment.

## Recording and verification

- [Readable transcript](recordings/cedar-v2/transcript.html)
- [Markdown transcript](recordings/cedar-v2/transcript.md)
- [Public verification data](recordings/cedar-v2/verification.json)
- [Media sizes and SHA-256 hashes](docs/media-manifest.json)
- [Publication report](docs/publication-report.md)

This repository contains the approved demo site and media. Application runtime hosting remains a later phase. Original recordings, benchmarks, provider accounting and readiness evidence are preserved in the source workspace.
