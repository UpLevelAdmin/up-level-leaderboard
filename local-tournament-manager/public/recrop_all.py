
import os
import glob
from PIL import Image

# Path Setup
base_path = "/Users/chawanutcharoenthammachoke/Documents/Cursor/up-level-leaderboard/local-tournament-manager/public/"
source_grid_path = os.path.join(base_path, "assets/uplevel-icons/source-grids/")

# Pattern to find all grid images
# Only target the new batches we generated (v7 - v21) plus old ones if needed.
# Let's do ALL of them to be safe.
grid_files = glob.glob(os.path.join(source_grid_path, "*.png"))

print(f"Found {len(grid_files)} source grids to verify/crop.")

def crop_grid(image_path):
    filename = os.path.basename(image_path)
    # The output folder name logic used previously:
    # "uplevel_meta_grid_9x9_v7_city_winners_final_1766058385610.png"
    # becomes "..._pieces"
    folder_name = filename.replace('.png', '_pieces')
    output_dir = os.path.join(source_grid_path, folder_name)
    
    print(f"Processing: {filename}")
    print(f"  Target Dir: {output_dir}")

    try:
        img = Image.open(image_path)
        
        # Resize to standard
        target_size = (1023, 1023)
        img = img.resize(target_size, Image.Resampling.LANCZOS)
        
        piece_width = target_size[0] // 3
        piece_height = target_size[1] // 3
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        count = 1
        for i in range(3): # Rows
            for j in range(3): # Cols
                left = j * piece_width
                upper = i * piece_height
                right = left + piece_width
                lower = upper + piece_height
                
                box = (left, upper, right, lower)
                piece = img.crop(box)
                
                output_path = os.path.join(output_dir, f"{count}.png")
                # Force Save
                piece.save(output_path)
                count += 1
        print("  Status: OK")
                
    except Exception as e:
        print(f"  Error: {e}")

# Run for ALL grids
for grid in grid_files:
    # Skip any files that are not the grid source (e.g. if they don't have 'uplevel' in name)
    if 'uplevel' in grid:
        crop_grid(grid)

print("Finished re-cropping ALL batches.")
