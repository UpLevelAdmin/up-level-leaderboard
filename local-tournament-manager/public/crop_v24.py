
import os
from PIL import Image

def crop_grid(image_path):
    print(f"Processing V24: {image_path}")
    base_name = os.path.basename(image_path)
    folder_name = base_name.replace('.png', '_pieces')
    output_dir = os.path.join(os.path.dirname(image_path), folder_name)
    
    try:
        img = Image.open(image_path)
        print(f" Original Size: {img.size}")
        
        target_size = (1023, 1023)
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        piece_width = target_size[0] // 3
        piece_height = target_size[1] // 3
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        count = 1
        for i in range(3):
            for j in range(3):
                left = j * piece_width
                upper = i * piece_height
                right = left + piece_width
                lower = upper + piece_height
                
                box = (left, upper, right, lower)
                piece = img.crop(box)
                
                output_path = os.path.join(output_dir, f"{count}.png")
                piece.save(output_path)
                print(f"  Saved {output_path}")
                count += 1
        print("Done V24.")
    except Exception as e:
        print(f"Error: {e}")

target_file = "/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/local-tournament-manager/public/assets/uplevel-icons/source-grids/uplevel_meta_grid_9x9_v24_missing_support_legends_1766116351619.png"
crop_grid(target_file)
