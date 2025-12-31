
from PIL import Image
import os

input_image_path = "C:/Users/15512/.gemini/antigravity/brain/e358a917-a229-4d5a-953f-688e6fa1a5fa/uploaded_image_1767145708042.png"
output_dir = "images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

try:
    img = Image.open(input_image_path)
    width, height = img.size
    
    # Calculate width of each part (assuming 3 equal vertical strips)
    part_width = width // 3
    
    for i in range(3):
        left = i * part_width
        upper = 0
        right = (i + 1) * part_width
        lower = height
        
        # Crop the image
        box = (left, upper, right, lower)
        part_img = img.crop(box)
        
        # Save the part
        output_path = os.path.join(output_dir, f"map_step_{i+1}.png")
        part_img.save(output_path)
        print(f"Saved {output_path}")
        
except Exception as e:
    print(f"Error: {e}")
