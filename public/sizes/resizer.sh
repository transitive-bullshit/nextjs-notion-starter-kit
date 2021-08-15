#!/bin/bash

# Usage: ./resize_many.sh <filename> <sizes...>
# e.g. ./resize_many.sh myasset.png 10x10 20x20 30x30
#      produces 3 files, myasset10x10.png myasset20x20.png myasset30x30.png

fullname=$1
shift;
sizes=$*
extension="${fullname##*.}"
filename="${fullname%.*}"

for size in $*
do
convert $fullname -resize $size $filename$size.$extension
done

# ./resizer.sh ob-000000.png 16x16 32x32 48x48 128x128
# ./resizer.sh ob-808080.png 16x16 32x32 48x48 128x128
# ./resizer.sh ob-ffffff.png 16x16 32x32 48x48 128x128