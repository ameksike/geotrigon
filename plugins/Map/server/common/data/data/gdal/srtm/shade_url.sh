#!/bin/bash
for f in `ls *.hgt`; do ./gdaldem hillshade $f ../tif/$f.tif -s 55560 -az 315 -alt 60 -z 1; done
