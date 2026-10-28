import bpy, sys
a = sys.argv[sys.argv.index("--") + 1:]
img = bpy.data.images.load(a[0])
s = bpy.context.scene
s.render.image_settings.file_format = "WEBP"
s.render.image_settings.color_mode = "RGBA"
s.render.image_settings.quality = 88
s.view_settings.view_transform = "Standard"
img.save_render(a[1], scene=s)
