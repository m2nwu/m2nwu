# MacBook Pro 16" (Mac15,11, M3 Max, Space Black) built from primitives and
# rendered with Cycles. Units are centimetres. Run:
#   Blender -b -P macbook.py -- <out_dir> [preview]
# Writes macbook.png (RGBA, shadow in alpha) and screen.json, the four corners
# of the display's active area in image pixels, for the web page to map onto.

import bpy, bmesh, json, math, sys, os
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else os.path.dirname(__file__)
PREVIEW = "preview" in argv

# Real dimensions, 16" MacBook Pro (2023): 35.57 x 24.81 x 1.68 cm.
W, D = 35.57, 24.81
BASE_H, LID_T = 1.10, 0.58
CORNER = 1.05
LID_TILT = 16          # degrees back from vertical
SCREEN_W, SCREEN_H = 34.56, 22.34   # 3456 x 2234 active area
BEZEL_TOP, BEZEL_SIDE = 0.72, 0.50
ELEVATION = 15         # camera, degrees above horizontal
RES = (3200, 2000)

scene = bpy.context.scene
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)


# ---------- helpers ----------
def mat(name, color, metal=0.0, rough=0.4, coat=0.0, emit=None, spec=None):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except Exception:
        pass
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Metallic"].default_value = metal
    p.inputs["Roughness"].default_value = rough
    if coat:
        p.inputs["Coat Weight"].default_value = coat
        p.inputs["Coat Roughness"].default_value = 0.03
    if spec is not None:
        p.inputs["Specular IOR Level"].default_value = spec
    if emit:
        p.inputs["Emission Color"].default_value = (*emit[0], 1)
        p.inputs["Emission Strength"].default_value = emit[1]
    return m


def rrect(name, w, d, h, r, bevel=0.0, seg=10, z0=0.0, material=None, y0=None):
    """Rounded-rectangle prism, centred on x, from z0 to z0+h.
    y spans [-d/2, d/2] unless y0 is given (then [y0, y0+d])."""
    r = min(r, w / 2 - 1e-3, d / 2 - 1e-3)
    cy = 0 if y0 is None else y0 + d / 2
    pts = []
    for cx_, cy_, a0 in ((w/2 - r, d/2 - r, 0), (-w/2 + r, d/2 - r, 90),
                         (-w/2 + r, -d/2 + r, 180), (w/2 - r, -d/2 + r, 270)):
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg)
            pts.append((cx_ + r * math.cos(a), cy + cy_ + r * math.sin(a)))
    bm = bmesh.new()
    bot = [bm.verts.new((x, y, z0)) for x, y in pts]
    top = [bm.verts.new((x, y, z0 + h)) for x, y in pts]
    bm.faces.new(list(reversed(bot)))
    bm.faces.new(top)
    n = len(pts)
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((bot[i], bot[j], top[j], top[i]))
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for i, p in enumerate(me.polygons):
        p.use_smooth = i >= 2          # caps flat, rounded sides smooth
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    if bevel:
        b = ob.modifiers.new("bevel", "BEVEL")
        b.width = bevel
        b.segments = 4
        b.limit_method = "ANGLE"
        b.angle_limit = math.radians(50)
        b.harden_normals = True
    if material:
        ob.data.materials.append(material)
    return ob


# ---------- materials ----------
SPACE_BLACK = mat("space_black", (0.028, 0.029, 0.031), metal=1.0, rough=0.34)
KEY = mat("key", (0.006, 0.006, 0.0065), rough=0.6, spec=0.12)
WELL = mat("well", (0.003, 0.003, 0.0035), rough=0.85, spec=0.1)
GRILLE = mat("grille", (0.004, 0.004, 0.005), rough=0.85, spec=0.1)
PAD = mat("trackpad", (0.034, 0.035, 0.037), metal=0.85, rough=0.22)
GLASS = mat("bezel_glass", (0.002, 0.002, 0.002), rough=0.04, coat=1.0)
SCREEN = mat("screen", (0.0, 0.0, 0.0), rough=1.0, spec=0.0)
HINGE = mat("hinge", (0.012, 0.012, 0.013), metal=0.6, rough=0.5)

# ---------- base ----------
base = rrect("base", W, D, BASE_H, CORNER, bevel=0.22, material=SPACE_BLACK)
deck = BASE_H

# Keyboard: 6 rows, 14.5 units wide, function row half height.
U = 1.86
KEY_GAP = 0.22
kb_w = 14.5 * U
rows = [
    [1.5] + [1.0] * 12 + [1.0],                      # esc, F1-F12, Touch ID
    [1.0] * 13 + [1.5],
    [1.5] + [1.0] * 13,
    [1.75] + [1.0] * 11 + [1.75],
    [2.25] + [1.0] * 10 + [2.25],
    [1.0, 1.0, 1.0, 1.25, 5.0, 1.25, 1.0, "arrows"],
]
row_h = [0.55, 1, 1, 1, 1, 1]
kb_back = D / 2 - 2.05          # y of the back edge of the function row
well_pad = 0.35
kb_depth = sum(row_h) * U
rrect("kb_well", kb_w + well_pad * 2, kb_depth + well_pad * 2, 0.02, 0.5,
      z0=deck - 0.005, y0=kb_back - kb_depth - well_pad, material=WELL)

y = kb_back
for row, rh in zip(rows, row_h):
    h = rh * U
    x = -kb_w / 2
    for k in row:
        if k == "arrows":
            # left, up/down (half height), right
            aw = (kb_w / 2 - x) / 3
            for i in range(3):
                kx = x + aw * i + aw / 2
                if i == 1:
                    for half in (0, 1):
                        rrect("key", aw - KEY_GAP, h / 2 - KEY_GAP, 0.09, 0.14, bevel=0.025,
                              seg=4, z0=deck, y0=y - h + half * h / 2 + KEY_GAP / 2,
                              material=KEY).location.x = kx
                else:
                    rrect("key", aw - KEY_GAP, h / 2 - KEY_GAP, 0.09, 0.14, bevel=0.025,
                          seg=4, z0=deck, y0=y - h + KEY_GAP / 2, material=KEY).location.x = kx
            break
        kw = k * U
        ob = rrect("key", kw - KEY_GAP, h - KEY_GAP, 0.09, 0.14, bevel=0.025, seg=4,
                   z0=deck, y0=y - h + KEY_GAP / 2, material=KEY)
        ob.location.x = x + kw / 2
        x += kw
    y -= h

# Perforated grille: a dot grid in object space, 1.4 mm pitch.
def perforate(m, pitch=0.14, r=0.3):
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sep.inputs[0])
    comb = nt.nodes.new("ShaderNodeCombineXYZ")
    for i, ax in enumerate("XY"):
        mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"; mul.inputs[1].default_value = 1 / pitch
        fr = nt.nodes.new("ShaderNodeMath"); fr.operation = "FRACT"
        sub = nt.nodes.new("ShaderNodeMath"); sub.operation = "SUBTRACT"; sub.inputs[1].default_value = .5
        nt.links.new(sep.outputs[ax], mul.inputs[0]); nt.links.new(mul.outputs[0], fr.inputs[0])
        nt.links.new(fr.outputs[0], sub.inputs[0]); nt.links.new(sub.outputs[0], comb.inputs[i])
    ln = nt.nodes.new("ShaderNodeVectorMath"); ln.operation = "LENGTH"
    nt.links.new(comb.outputs[0], ln.inputs[0])
    lt = nt.nodes.new("ShaderNodeMath"); lt.operation = "LESS_THAN"; lt.inputs[1].default_value = r
    nt.links.new(ln.outputs["Value"], lt.inputs[0])
    mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = "RGBA"
    mix.inputs["A"].default_value = (0.028, 0.029, 0.031, 1)
    mix.inputs["B"].default_value = (0, 0, 0, 1)
    nt.links.new(lt.outputs[0], mix.inputs["Factor"])
    p = nt.nodes.get("Principled BSDF")
    nt.links.new(mix.outputs["Result"], p.inputs["Base Color"])
    rm = nt.nodes.new("ShaderNodeMapRange")
    rm.inputs["To Min"].default_value = 0.34; rm.inputs["To Max"].default_value = 1.0
    nt.links.new(lt.outputs[0], rm.inputs["Value"])
    nt.links.new(rm.outputs["Result"], p.inputs["Roughness"])
    p.inputs["Metallic"].default_value = 0.9

GRILLE = mat("grille_perf", (0.03, 0.03, 0.03), metal=0.9, rough=0.34)
perforate(GRILLE)

# Speaker grilles either side of the keyboard.
for s in (-1, 1):
    g = rrect("grille", 2.3, kb_depth + 0.4, 0.01, 0.3, z0=deck - 0.002,
              y0=kb_back - kb_depth - 0.2, material=GRILLE)
    g.location.x = s * (kb_w / 2 + well_pad + 1.75)

# Trackpad.
rrect("trackpad", 16.0, 9.9, 0.012, 0.55, z0=deck - 0.004,
      y0=-D / 2 + 1.25, material=PAD)

# ---------- lid ----------
L = D - 0.05
hinge_pos = Vector((0, D / 2 - 0.35, deck + 0.12))
pivot = bpy.data.objects.new("lid_pivot", None)
scene.collection.objects.link(pivot)
pivot.location = hinge_pos
pivot.rotation_euler = (math.radians(90 - LID_TILT), 0, 0)

lid = rrect("lid", W, L, LID_T, CORNER, bevel=0.2, z0=-LID_T, y0=0, material=SPACE_BLACK)
lid.parent = pivot
glass = rrect("bezel", W - 0.30, L - 0.30, 0.004, CORNER - 0.15, z0=0.0, y0=0.15,
              material=GLASS)
glass.parent = pivot
scr_y0 = L - BEZEL_TOP - SCREEN_H
screen = rrect("screen", SCREEN_W, SCREEN_H, 0.004, 0.55, z0=0.002, y0=scr_y0,
               material=SCREEN)
screen.parent = pivot

hinge = bpy.data.objects.new("hinge", bpy.data.meshes.new("hinge"))
bm = bmesh.new()
bmesh.ops.create_cone(bm, cap_ends=True, segments=32, radius1=0.42, radius2=0.42, depth=W - 6)
bm.to_mesh(hinge.data)
bm.free()
for p in hinge.data.polygons:
    p.use_smooth = True
hinge.data.materials.append(HINGE)
scene.collection.objects.link(hinge)
hinge.rotation_euler = (0, math.radians(90), 0)
hinge.location = hinge_pos + Vector((0, 0.05, -0.05))

# ---------- desk and wall ----------
DESK = mat("desk", (0.33, 0.318, 0.298), rough=0.5, spec=0.45)
DESK_EDGE = mat("desk_edge", (0.55, 0.53, 0.50), rough=0.5, spec=0.4)
WALL = mat("wall", (0.80, 0.80, 0.79), rough=0.95, spec=0.1, emit=((1, 1, 1), 0.62))
desk_front, desk_back = -30.0, 46.0
top = rrect("desk_top", 260, desk_back - desk_front, 3.2, 0.6, bevel=0.35, z0=-3.2,
            y0=desk_front, material=DESK)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, desk_back + 0.5, 60))
wall = bpy.context.active_object
wall.scale = (600, 200, 1)
wall.rotation_euler = (math.radians(90), 0, 0)
wall.data.materials.append(WALL)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, -90))
floor = bpy.context.active_object
floor.scale = (600, 400, 1)
floor.data.materials.append(WALL)

# ---------- lights ----------
def area(name, loc, rot, size, energy, shape="RECTANGLE", size_y=None):
    l = bpy.data.lights.new(name, "AREA")
    l.shape = shape
    l.size = size
    if size_y:
        l.size_y = size_y
    l.energy = energy
    ob = bpy.data.objects.new(name, l)
    scene.collection.objects.link(ob)
    ob.location = loc
    ob.rotation_euler = [math.radians(a) for a in rot]
    return ob

area("key", (-20, -30, 130), (14, -8, 0), 34, 3.2e5, size_y=26)
area("window", (-160, -20, 70), (65, 0, -75), 120, 5.0e5, size_y=90)
area("rim_l", (-95, 40, 45), (70, 0, -115), 18, 2.6e5, size_y=140)
area("rim_r", (95, 40, 45), (70, 0, 115), 18, 2.6e5, size_y=140)
area("front_strip", (0, -110, 18), (90, 0, 0), 160, 1.8e5, size_y=8)
area("top_back", (0, 60, 90), (-35, 0, 0), 120, 1.2e5, size_y=10)

world = bpy.data.worlds.new("w")
scene.world = world
try:
    world.use_nodes = True
except Exception:
    pass
bg = world.node_tree.nodes.get("Background")
bg.inputs[0].default_value = (0.5, 0.5, 0.52, 1)
bg.inputs[1].default_value = 0.6

# ---------- camera ----------
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 85
cam_data.sensor_width = 36
cam_data.sensor_fit = "AUTO"
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
target = Vector((0, -1.0, 7.6))
el = math.radians(ELEVATION)
dist = 185
cam.location = target + Vector((0, -math.cos(el), math.sin(el))) * dist
cam.rotation_euler = (Vector(target) - cam.location).to_track_quat("-Z", "Y").to_euler()

# ---------- render ----------
r = scene.render
r.engine = "CYCLES"
r.resolution_x, r.resolution_y = RES
r.resolution_percentage = 30 if PREVIEW else 100
r.film_transparent = False
r.image_settings.file_format = "PNG"
r.image_settings.color_mode = "RGB"
r.image_settings.compression = 90
try:
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
except Exception:
    pass
cy = scene.cycles
cy.samples = 48 if PREVIEW else 256
cy.use_denoising = True
try:
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    cy.device = "GPU"
except Exception as e:
    print("GPU unavailable:", e)

bpy.context.view_layer.update()
r.filepath = os.path.join(OUT, "macbook-preview.png" if PREVIEW else "macbook.png")
bpy.ops.render.render(write_still=True)

# ---------- screen corners in image pixels ----------
mw = screen.matrix_world
x0, x1 = -SCREEN_W / 2, SCREEN_W / 2
ya, yb = scr_y0, scr_y0 + SCREEN_H
z = 0.006
corners = {"tl": (x0, yb), "tr": (x1, yb), "br": (x1, ya), "bl": (x0, ya)}
rx = r.resolution_x * r.resolution_percentage // 100
ry = r.resolution_y * r.resolution_percentage // 100
out = {"image": [rx, ry]}
for k, (cx_, cy_) in corners.items():
    p = world_to_camera_view(scene, cam, mw @ Vector((cx_, cy_, z)))
    out[k] = [round(p.x * rx, 2), round((1 - p.y) * ry, 2)]
with open(os.path.join(OUT, "screen-preview.json" if PREVIEW else "screen.json"), "w") as f:
    json.dump(out, f, indent=1)
print("SCREEN", out)
