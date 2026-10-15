#!/usr/bin/env python3
"""Validate the published artifact, including project-path links and privacy guards."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / "public"
ORIGIN = "https://vonzen.github.io"
PREFIX = "/Glowboard/"
ROUTES = {
    "index.html": "",
    "privacypolicy/index.html": "privacypolicy/",
    "termsofservice/index.html": "termsofservice/",
}
EXPECTED_FILES = {
    *ROUTES, "404.html", "assets/site.css", "assets/app-icon.png",
    "assets/landing.css", "assets/landing.js",
    "assets/mascot-cream.png", "assets/mascot-peach.png", "assets/mascot-star.png",
    "assets/theme-cream.png", "assets/theme-peach.png", "assets/theme-star.png",
    "assets/scene-concert.png", "assets/scene-love.png", "assets/scene-birthday.png", "assets/scene-airport.png",
    "assets/pro-puppy.png",
    ".nojekyll", "robots.txt", "sitemap.xml",
}
errors = []


def check(condition, message):
    if not condition:
        errors.append(message)


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = set()
        self.links = []
        self.resources = []
        self.h1_count = 0
        self.canonical = None
        self.description = None
        self.lang = None
        self.viewport = None
        self.has_title = False
        self.time = None
        self.scripts = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            check(attrs["id"] not in self.ids, f"{self.path.name}: duplicate id {attrs['id']}")
            self.ids.add(attrs["id"])
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "title":
            self.has_title = True
        if tag == "h1":
            self.h1_count += 1
        if tag == "meta":
            if attrs.get("name") == "description":
                self.description = attrs.get("content")
            if attrs.get("name") == "viewport":
                self.viewport = attrs.get("content")
        if tag == "time":
            self.time = attrs.get("datetime")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if "href" in attrs:
            self.links.append(attrs["href"])
        if "src" in attrs:
            self.links.append(attrs["src"])
            self.resources.append(attrs["src"])
        if tag == "link" and attrs.get("rel") in {"stylesheet", "icon"}:
            self.resources.append(attrs.get("href", ""))
        if tag == "img":
            check("alt" in attrs, f"{self.path.name}: image without alt attribute")
        if tag == "script":
            self.scripts.append(attrs)
        check(not any(key.startswith("on") for key in attrs), f"{self.path.name}: inline script handler")


files = {path.relative_to(ROOT).as_posix() for path in ROOT.rglob("*")
         if path.is_file() and path.name != ".DS_Store"}
check(files == EXPECTED_FILES, f"Unexpected or missing published files: {files ^ EXPECTED_FILES}")
documents = {path.resolve(): Document(path) for path in ROOT.rglob("*.html")}

for path, document in documents.items():
    relative = path.relative_to(ROOT)
    label = relative.as_posix()
    check(document.lang == "en", f"{label}: English document language missing")
    check(document.h1_count == 1, f"{label}: expected one primary heading")
    check(document.has_title and document.description, f"{label}: page metadata missing")
    check(document.viewport and "width=device-width" in document.viewport, f"{label}: viewport missing")
    check("main" in document.ids, f"{label}: main landmark target missing")
    if label == "index.html":
        check(document.scripts == [{"src": "assets/landing.js", "defer": None}], f"{label}: unexpected script or tracker")
        check({"playground", "themes", "pro", "availability"}.issubset(document.ids), "Landing-page sections missing")
        check("https://apps.apple.com/app/id6822701782" in document.links, "App Store destination missing")
    else:
        check(not document.scripts, f"{label}: unexpected script or tracker")
    if label in ROUTES:
        check(document.canonical == ORIGIN + PREFIX + ROUTES[label], f"{label}: canonical mismatch")
    if "policy" in label or "termsofservice" in label:
        check(document.time == "2026-10-15", f"{label}: legal revision date missing")
    for resource in document.resources:
        parsed = urlparse(resource)
        check(not parsed.netloc or parsed.netloc == "vonzen.github.io", f"{label}: third-party resource {resource}")
    for link in document.links:
        parsed = urlparse(link)
        if parsed.scheme == "mailto":
            check(parsed.path == "vonzenappstudio@gmail.com", f"{label}: unexpected contact address")
            continue
        if parsed.netloc and parsed.netloc != "vonzen.github.io":
            check(parsed.scheme == "https", f"{label}: external link must use HTTPS")
            continue
        if parsed.netloc:
            check(parsed.path.startswith(PREFIX), f"{label}: wrong production base path")
            target = ROOT / unquote(parsed.path.removeprefix(PREFIX))
        else:
            check(not parsed.scheme, f"{label}: unexpected URI scheme {parsed.scheme}")
            target = path.parent / unquote(parsed.path) if parsed.path else path
        if target.is_dir():
            target = target / "index.html"
        target = target.resolve()
        check(target.is_relative_to(ROOT), f"{label}: link escapes public directory")
        check(target.is_file(), f"{label}: missing local target {link}")
        if parsed.fragment:
            check(target in documents and unquote(parsed.fragment) in documents[target].ids,
                  f"{label}: missing fragment {link}")

for path in ROOT.rglob("*"):
    if not path.is_file() or path.suffix == ".png" or path.name == ".DS_Store":
        continue
    content = path.read_text()
    check(not re.search(r"\b(?:phc_|appl_|ghp_|gho_|github_pat_)[A-Za-z0-9_]{12,}", content),
          f"{path.name}: configuration credential found")
    check(not any(term in content for term in ["Ting Radio", "TingRadio", "Radio Browser", "Google AdMob"]),
          f"{path.name}: unrelated reference-app content found")

namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
script = (ROOT / "assets/landing.js").read_text()
check(not re.search(r"\b(?:fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|eval\s*\()|document\.cookie", script),
      "Preview script must not transmit, persist or evaluate user text")
sitemap = ET.parse(ROOT / "sitemap.xml")
actual_urls = {node.text for node in sitemap.findall(".//s:loc", namespace)}
check(actual_urls == {ORIGIN + PREFIX + route for route in ROUTES.values()}, "Sitemap route mismatch")
check(ORIGIN + PREFIX + "sitemap.xml" in (ROOT / "robots.txt").read_text(), "Sitemap discovery missing")

if errors:
    print("Validation failed:\n" + "\n".join(f"- {error}" for error in errors))
    sys.exit(1)
print(f"Validated {len(documents)} pages, every local link and fragment, metadata, sitemap and published-file privacy guards.")
