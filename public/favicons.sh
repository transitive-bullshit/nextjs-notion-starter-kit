#!/bin/bash

# from
# http://bergamini.org/computers/creating-favicon.ico-icon-files-with-imagemagick-convert.html

convert /Users/Pavlovcik/Downloads/help_outline-black-48dp/2x/baseline_help_outline_black_48dp.png -resize 256x256 -transparent white favicon-256x256.png
convert favicon-256x256.png -resize 16x16 favicon-16x16.png
convert favicon-256x256.png -resize 32x32 favicon-32x32.png
convert favicon-256x256.png -resize 64x64 favicon-64x64.png
convert favicon-256x256.png -resize 128x128 favicon-128x128.png
convert favicon-16x16.png favicon-32x32.png favicon-64x64.png favicon-128x128.png favicon-256x256.png -colors 256 favicon.ico