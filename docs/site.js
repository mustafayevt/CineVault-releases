// Fills in the current version, installer size and release date from the public releases API.
// The download buttons use the version-less releases/latest/download link, so they work without it.
(function () {
  "use strict";
  var API = "https://api.github.com/repos/mustafayevt/CineVault-releases/releases/latest";
  var SETUP = "CineVault-setup-x64.exe";

  function megabytes(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function setAll(selector, text) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = text;
  }

  if (!window.fetch) return;
  fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (release) {
      var version = String(release.tag_name || "").replace(/^v/, "");
      if (/^\d+\.\d+\.\d+$/.test(version)) setAll("[data-version]", version);
      var assets = release.assets || [];
      for (var i = 0; i < assets.length; i++) {
        if (assets[i].name === SETUP && assets[i].size > 0) setAll("[data-size]", megabytes(assets[i].size));
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
    })
    .catch(function () {
      // Keep the version written into the page.
    });
})();
