import cadquery as cq

# Create a sample assembly
assy = cq.Assembly()
body = cq.Workplane().box(10, 10, 10)
assy.add(body, color=cq.Color(1, 0, 0), name="body")
pin = cq.Workplane().center(2, 2).cylinder(radius=2, height=20)
assy.add(pin, color=cq.Color(0, 1, 0), name="pin")

# Save the assembly to GLTF
assy.export("out.gltf")