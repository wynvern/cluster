from PIL import Image
import os

def resize_image(input_image_path, output_image_path, size):
    original_image = Image.open(input_image_path)
    width, height = original_image.size
    print(f"The original image size is {width} wide x {height} tall")

    resized_image = original_image.resize(size)
    width, height = resized_image.size
    print(f"The resized image size is {width} wide x {height} tall")
    resized_image.show()
    resized_image.save(output_image_path)

# Define the source icon and its directory
src_dir = "/home/wynvern/Documents/code/orion/scripts"
src_icon = "original.png"

# Define the target sizes
sizes = [(48,48), (72,72), (96,96), (128,128), (144,144), (152,152), (192,192), (384,384), (512,512)]

# Loop over the sizes and resize the source icon to the target icon
for size in sizes:
    resize_image(os.path.join(src_dir, src_icon), os.path.join(src_dir, f"icon-{size[0]}x{size[1]}.png"), size)