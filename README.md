# CineVault releases

Installers for CineVault, a fast desktop movie and TV library manager for Windows (macOS is coming soon).

**Website and download: <https://mustafayevt.github.io/CineVault-releases/>**

Direct link to the newest Windows installer: [CineVault-setup-x64.exe](https://github.com/mustafayevt/CineVault-releases/releases/latest/download/CineVault-setup-x64.exe). Every version is on the [Releases](https://github.com/mustafayevt/CineVault-releases/releases) page, with the MSI installer and a portable zip.

## Getting started

1. **Download and run the installer.** It isn't code-signed yet, so Windows SmartScreen may stop it the first time: choose *Windows protected your PC* → *More info* → *Run anyway*.
2. **Add a free TMDB key.** Request an API key at [themoviedb.org](https://www.themoviedb.org/settings/api) and paste it in when CineVault first starts. OMDb and MDBList keys are optional and add more ratings.
3. **Add your movie and TV folders.** CineVault scans them, and you Scrape and Rename from there.

Requires Windows 10 or 11, 64-bit, with Microsoft Edge WebView2 (built into Windows 11; the installer downloads it on Windows 10 when it is missing).

## Updates

Installed copies update themselves from here: each release carries a `manifest.json` signed with the project key, and the app installs only builds that match it.

The website lives in [`docs/`](docs/) and is served by GitHub Pages.

This product uses the TMDB API but is not endorsed or certified by TMDB.
