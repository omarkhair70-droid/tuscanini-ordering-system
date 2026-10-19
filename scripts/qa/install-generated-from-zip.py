#!/usr/bin/env python3
"""Verified no-network local installer for the owner's 100 AI menu image ZIP.

Only the 100 expected 720x720 WebP files in public/images/rebirth/generated
are admitted. Refuses duplicate names, zip-slip paths, corrupt PNG lookalikes,
mismatched item count, and oversize assets. Does not change catalog or price.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path
from zipfile import ZipFile
from io import BytesIO
from PIL import Image

def run() -> int:
    if len(sys.argv)!=2:
        raise SystemExit("Usage: python3 scripts/qa/install-generated-from-zip.py path/to/owner-100-images.zip")
    archive=Path(sys.argv[1])
    if not archive.is_file(): raise ValueError("Expected uploaded archive is missing")
    if archive.stat().st_size>35_000_000: raise ValueError("Too large; owner package should be ~9 MB")
    target=Path("public/images/rebirth/generated")
    expected={
        f"public/images/rebirth/generated/b{batch:02d}-{index:02d}.webp"
        for batch in range(1,11) for index in range(1,11)
    }
    with ZipFile(archive) as z:
        entries=z.infolist()
        by_name={}
        for info in entries:
            if info.is_dir():continue
            if info.filename in by_name: raise ValueError("Duplicated zip path: "+info.filename)
            by_name[info.filename]=info
        files={n for n in by_name if n.endswith(".webp")}
        if files!=expected:
            raise ValueError(f"Expected 100 exact source WebP paths; missing {sorted(expected-files)}, unexpected {sorted(files-expected)}")
        metadata=json.loads(z.read("generated-food-inventory.json"))
        if metadata.get("total")!=100 or len(metadata.get("assets",[]))!=100:
            raise ValueError("Archive is not owner-confirmed 100-image set")
        indexed={a.get("webPath") for a in metadata["assets"]}
        if indexed!={"/"+name for name in expected}:
            raise ValueError("Archive inventory does not match real source assets")
        prepared={}
        for name in sorted(expected):
            info=by_name[name]
            if info.file_size<20000 or info.file_size>600000:
                raise ValueError("Invalid output WebP size: "+name)
            data=z.read(name)
            if data[:4]!=b"RIFF" or data[8:12]!=b"WEBP":
                raise ValueError("No WebP file signature: "+name)
            with Image.open(BytesIO(data)) as im:
                if im.format!="WEBP" or im.size!=(720,720):
                    raise ValueError("Wrong decoded image type/dimensions: "+name)
                im.verify()
            prepared[Path(name).name]=data
    target.mkdir(parents=True,exist_ok=True)
    existing={p.name for p in target.glob("*.webp")}
    if existing and existing!=set(prepared):
        raise ValueError("Partial or unexpected image set already exists; refusing overwrite")
    for name,data in prepared.items():
        (target/name).write_bytes(data)
    count=len(list(target.glob("*.webp")))
    if count!=100:raise ValueError(f"Unexpected output count {count}")
    print(f"PASS — {count} real generated WebP image files extracted and validated from owner ZIP")
    print("Provenance: generated representative visual, never verified Tuscanini named-product photography")
    return 0

if __name__=="__main__":
    raise SystemExit(run())
