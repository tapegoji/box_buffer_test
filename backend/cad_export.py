import cadquery as cq

# Create a simple box
box = cq.Workplane().box(10, 10, 10)

# Export the box to STEP format
cq.exporters.export(box, "box.stp", exportType="STEP")