// Points the download buttons at the visitor's system and fills in the current version, installer
// size and release date from the public releases API. The buttons are written for Windows with the
// version-less releases/latest/download link, so they work without this script.
(function () {
  "use strict";
  var API = "https://api.github.com/repos/mustafayevt/CineVault-releases/releases/latest";
  var DOWNLOAD = "https://github.com/mustafayevt/CineVault-releases/releases/latest/download/";
  var RELEASES = "https://github.com/mustafayevt/CineVault-releases/releases";
  var SETUP = "CineVault-setup-x64.exe";
  var DMG = "CineVault-universal.dmg";

  function megabytes(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function all(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function setAll(selector, text) {
    all(selector).forEach(function (node) {
      node.textContent = text;
    });
  }

  function isMac() {
    var platform =
      (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/mac/i.test(platform)) return true;
    // iPads report a Mac user agent; they cannot run the app, so they keep the default page.
    return /Macintosh|Mac OS X/i.test(navigator.userAgent) && navigator.maxTouchPoints < 2;
  }

  // A Mac visitor: the macOS download when a build exists, otherwise an honest "coming soon"
  // with the Windows installer one click away.
  function showMac(dmg, version) {
    all("[data-dl]").forEach(function (button) {
      var label = button.querySelector("[data-dl-label]");
      var note = button.querySelector("[data-dl-note]");
      if (dmg) {
        button.href = DOWNLOAD + DMG;
        if (label) label.textContent = "Download for macOS";
        if (note) note.textContent = "Version " + version + ", " + megabytes(dmg.size);
      } else {
        button.href = RELEASES;
        if (label) label.textContent = "macOS version coming soon";
        if (note) note.textContent = "See the releases page for news";
      }
    });
    setAll(
      "[data-dl-fine]",
      dmg
        ? "macOS 11 or later, Apple silicon and Intel. Free."
        : "CineVault runs on Windows 10 and 11 today. The macOS version is on its way."
    );
    all("[data-dl-alt]").forEach(function (alt) {
      alt.innerHTML = "";
      var link = document.createElement("a");
      link.className = "link";
      link.href = DOWNLOAD + SETUP;
      link.textContent = "Download for Windows instead";
      alt.appendChild(link);
    });
    all(".cta").forEach(function (cta) {
      if (cta.querySelector("[data-dl-alt]")) return;
      var alt = document.createElement("a");
      alt.className = "link";
      alt.href = DOWNLOAD + SETUP;
      alt.textContent = "Windows version";
      cta.appendChild(alt);
    });
  }

  var mac = isMac();
  if (!window.fetch) {
    if (mac) showMac(null, "");
    return;
  }
  fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (release) {
      var version = String(release.tag_name || "").replace(/^v/, "");
      if (/^\d+\.\d+\.\d+$/.test(version)) setAll("[data-version]", version);
      var assets = release.assets || [];
      var dmg = null;
      for (var i = 0; i < assets.length; i++) {
        if (assets[i].name === SETUP && assets[i].size > 0) setAll("[data-size]", megabytes(assets[i].size));
        if (assets[i].name === DMG && assets[i].size > 0) dmg = assets[i];
      }
      var released = document.getElementById("released");
      if (released && release.published_at) {
        var date = new Date(release.published_at);
        if (!isNaN(date.getTime())) {
          released.textContent =
            "Version " + version + " released " +
            date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
        }
      }
      if (mac) showMac(dmg, version);
    })
    .catch(function () {
      // Keep the version written into the page.
      if (mac) showMac(null, "");
    });
})();
