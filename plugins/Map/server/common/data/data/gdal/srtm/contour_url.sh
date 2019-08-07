#!/bin/bash
for f in `ls *.hgt`; do gdal_contour -i 100 -snodata 32767 -a height $f ../ogr/shp/$f.c100.shp; done
