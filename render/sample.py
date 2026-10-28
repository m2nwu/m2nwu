import bpy, sys
img = bpy.data.images.load(sys.argv[sys.argv.index("--") + 1])
w, h = img.size
px = img.pixels[:]
for (x, y) in ((40, h - 40), (w // 2, h - 40), (40, 40)):
    i = (y * w + x) * img.channels
    print("PX", x, y, "#%02x%02x%02x" % tuple(round(c * 255) for c in px[i:i + 3]))
