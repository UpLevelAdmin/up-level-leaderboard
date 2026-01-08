
import os
import requests
from PIL import Image

def setup_logos():
    output_dir = "public/assets/tournament-logos"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 1. Download Gym Battle Logo
    gym_url = "https://i.postimg.cc/500Wj9WP/gym-thiy-ch-d.png"
    print("Downloading Gym Battle logo...")
    try:
        response = requests.get(gym_url)
        if response.status_code == 200:
            with open(f"{output_dir}/gym_battle.png", 'wb') as f:
                f.write(response.content)
            print("  Saved gym_battle.png")
        else:
            print("  Failed to download Gym Battle logo")
    except Exception as e:
        print(f"  Error downloading Gym logo: {e}")

    # 2. Process PACS Logos from Upload
    uploaded_path = "/Users/chawanutcharoenthammachoke/.gemini/antigravity/brain/8fce0f1e-ac23-41bf-bfd7-1390a769f4a4/uploaded_image_1766120605732.png"
    
    if os.path.exists(uploaded_path):
        print("Processing PACS logos...")
        try:
            img = Image.open(uploaded_path)
            # Resize wide image to a manageable height if needed, keeping aspect ratio? 
            # Or just crop directly. Assuming 4 logos side by side.
            width, height = img.size
            logo_width = width // 4
            
            names = ["great_ball", "ultra_ball", "premier_ball", "master_ball"]
            
            for i, name in enumerate(names):
                left = i * logo_width
                right = left + logo_width
                # Add some padding crop if needed? strict split for now.
                box = (left, 0, right, height)
                logo = img.crop(box)
                
                # Trim empty transparent space?
                if logo.mode != 'RGBA':
                    logo = logo.convert('RGBA')
                
                # Simple trim logic
                bbox = logo.getbbox()
                if bbox:
                    logo = logo.crop(bbox)

                logo.save(f"{output_dir}/{name}.png")
                print(f"  Saved {name}.png")
                
        except Exception as e:
            print(f"  Error processing PACS logos: {e}")
    else:
        print("  Uploaded image not found! Skipping PACS logos.")

setup_logos()
