#!/bin/bash

# Usage: ./resize_many.sh <filename> <sizes...>
# e.g. ./resize_many.sh myasset.png 10x10 20x20 30x30
#      produces 3 files, myasset10x10.png myasset20x20.png myasset30x30.png

fullname=$1
shift
sizes=$*
extension="${fullname##*.}"
filename="${fullname%.*}"

for size in $*; do
    # convert "$fullname" -resize "$size" "$filename"-"$size"."$extension"

    convert "$fullname" -resize "$size" android-chrome-"$size"."$extension"
    convert "$fullname" -resize "$size" android-icon-"$size"."$extension"
    convert "$fullname" -resize "$size" apple-icon-"$size"."$extension"
    convert "$fullname" -resize "$size" favicon-"$size"."$extension"
    convert "$fullname" -resize "$size" ms-icon-"$size"."$extension"

done

# 512x512 310x310 192x192 180x180 152x152 150x150 144x144 120x120 114x114 96x96 76x76 72x72 70x70 60x60 57x57 48x48 36x36 32x32 16x16

# ./resizer.sh ob-000000.png 16x16 32x32 48x48 128x128
# ./resizer.sh ob-808080.png 16x16 32x32 48x48 128x128
# ./resizer.sh ob-ffffff.png 16x16 32x32 48x48 128x128
