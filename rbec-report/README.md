# RBEC interactive research report

Unpublished draft for the existing GitHub Pages repository. This directory is self-contained and intended to live under `rbec-report/`. No deployment workflow is included. Do not merge into the published branch until publication is explicitly requested.

## Preview locally

Run `Start-preview.cmd` on the author's Windows computer, then open http://127.0.0.1:8765. Keep its terminal open while using the report. Alternatively, from this folder run `python -m http.server 8765 --bind 127.0.0.1` with Python 3 installed. Open the address in a modern browser. Opening index.html directly from the filesystem is not supported because the site loads encrypted files with fetch.

Use the password supplied separately by the report owner. The password is case-sensitive and is not stored in this repository. Refreshing or locking the page discards the session; the password is not saved in browser storage.

## Contents and protection

The report includes a narrative overview, development chapter, interactive mobility explorer, searchable figure atlas, complete reading views, and a source download library. Plotly is vendored locally; the report does not depend on external chart, font, or analytics services. Its license notice is included in plotly.min.js.

The report manifest, application narrative, numeric data, original documents, images, scripts and data downloads are encrypted using AES-256-GCM with random per-file nonces. The key is derived in the browser with PBKDF2-HMAC-SHA-256, a random salt and 600,000 iterations. Filenames within the encrypted collection are exposed only after unlocking. The generic landing page and styling are public source.

This is password-based encryption, not a server-managed access-control service. A person with the files can attempt offline password guesses; a short dictionary password does not provide strong protection against a determined attacker. Anyone who knows the password can read or save the contents. There is no per-user revocation or server-side rate limiting. GitHub Pages does not add such controls. Keep the draft unpublished unless the owner explicitly requests publication.

## Data fidelity

Data are read from the supplied Stata result files; no statistical models were re-estimated. Chart definitions, cohort ranges and sample thresholds follow the supplied graph code. Missing values remain missing. Plotted values and figures are downloadable, as are all supplied source files. The original report documents remain the authoritative layout versions.

Underlying HDI/HDR/GDL time-series datasets were not present in the supplied folder. Those sections use the report's original figures, text and classification table. They do not invent country-level series. The separate GDIM development paper and ESS probability measures have different definitions, explained in the report.

## Future editing

The application source is encrypted in `vault/application.bin`, and data/document metadata in `vault/report.bin`. Decryption requires the owner's password. Do not commit decrypted source or data, password-containing build scripts, or unencrypted exports. The local authoring and extraction scripts are intentionally kept outside this publishing directory.
