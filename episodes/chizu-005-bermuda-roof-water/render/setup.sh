#!/bin/sh
# Relief base map for chizu-005 (same as chizu-002): shadedrelief.jpg (10800x5400) from the PyPI package basemap-data 2.0.0
# (matplotlib Basemap project; package README: files other than GSHHG/EPSG are under the MIT license;
#  Basemap's shadedrelief() docstring: original image from https://www.shadedrelief.com/).
set -e
cd "$(dirname "$0")"; mkdir -p vendor; cd vendor
pip download --no-deps -q basemap-data==2.0.0
python3 -I -c "import zipfile,glob;z=zipfile.ZipFile(glob.glob('basemap_data-2.0.0-*.whl')[0]);open('shadedrelief.jpg','wb').write(z.read('mpl_toolkits/basemap_data/shadedrelief.jpg'))"
rm -f basemap_data-2.0.0-*.whl
