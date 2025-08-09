#!/usr/bin/env python3
"""
Simple script to create PNG icons for the Instagram Reels Counter extension.
This creates basic icons with a film reel design and counter numbers.
"""

import os
from PIL import Image, ImageDraw, ImageFont
import io

def create_icon(size, output_path):
    """Create a simple icon with film reel design and counter"""
    # Create image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    bg_color = (102, 126, 234)  # Purple gradient color
    accent_color = (118, 75, 162)  # Darker purple
    white = (255, 255, 255)
    
    # Draw background circle
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], 
                 fill=bg_color, outline=accent_color, width=2)
    
    # Draw film reel holes (simplified)
    hole_size = size // 12
    center = size // 2
    radius = size // 3
    
    # Draw 6 small circles around the center
    for i in range(6):
        angle = i * 60  # degrees
        import math
        x = center + radius * 0.6 * math.cos(math.radians(angle))
        y = center + radius * 0.6 * math.sin(math.radians(angle))
        
        draw.ellipse([x-hole_size//2, y-hole_size//2, 
                     x+hole_size//2, y+hole_size//2], 
                     fill=white, outline=accent_color, width=1)
    
    # Draw center circle with counter symbol
    center_size = size // 4
    draw.ellipse([center-center_size//2, center-center_size//2,
                 center+center_size//2, center+center_size//2],
                 fill=white, outline=accent_color, width=2)
    
    # Try to add a simple "123" text in center
    try:
        # For smaller icons, use a simpler design
        if size <= 16:
            # Just draw a simple dot
            dot_size = size // 6
            draw.ellipse([center-dot_size//2, center-dot_size//2,
                         center+dot_size//2, center+dot_size//2],
                         fill=accent_color)
        else:
            # Try to draw "123" or a simple counter symbol
            font_size = max(8, size // 6)
            try:
                font = ImageFont.load_default()
                text = "123" if size > 32 else "#"
                
                # Get text bounding box
                bbox = draw.textbbox((0, 0), text, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
                
                # Center the text
                text_x = center - text_width // 2
                text_y = center - text_height // 2
                
                draw.text((text_x, text_y), text, fill=accent_color, font=font)
            except:
                # Fallback: just draw a hash symbol manually
                line_width = max(1, size // 32)
                offset = size // 8
                # Draw # symbol
                draw.line([center-offset, center-offset//2, center+offset, center-offset//2], 
                         fill=accent_color, width=line_width)
                draw.line([center-offset, center+offset//2, center+offset, center+offset//2], 
                         fill=accent_color, width=line_width)
                draw.line([center-offset//2, center-offset, center-offset//2, center+offset], 
                         fill=accent_color, width=line_width)
                draw.line([center+offset//2, center-offset, center+offset//2, center+offset], 
                         fill=accent_color, width=line_width)
    except Exception as e:
        print(f"Warning: Could not add text to {size}x{size} icon: {e}")
    
    # Save the image
    img.save(output_path, 'PNG')
    print(f"Created icon: {output_path} ({size}x{size})")

def main():
    """Create all required icon sizes"""
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    # Create different sizes
    sizes = [16, 48, 128]
    
    for size in sizes:
        output_path = f'icon{size}.png'
        create_icon(size, output_path)
    
    print("\nIcon creation complete!")
    print("Note: If you have design software, consider creating more professional icons.")
    print("These are basic placeholder icons for development purposes.")

if __name__ == '__main__':
    try:
        main()
    except ImportError:
        print("PIL (Pillow) not found. Installing...")
        import subprocess
        subprocess.run(['pip3', 'install', 'Pillow'], check=True)
        main()
    except Exception as e:
        print(f"Error creating icons: {e}")
        print("Creating simple fallback icons...")
        
        # Create very basic icons without PIL
        for size in [16, 48, 128]:
            # Create a simple SVG that can be converted later
            svg_content = f'''<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="{size//2}" cy="{size//2}" r="{size//2-2}" fill="#667eea" stroke="#764ba2" stroke-width="2"/>
  <circle cx="{size//2}" cy="{size//2}" r="{size//4}" fill="white" stroke="#764ba2" stroke-width="1"/>
  <text x="{size//2}" y="{size//2+3}" text-anchor="middle" font-family="Arial" font-size="{size//4}" fill="#764ba2">123</text>
</svg>'''
            
            with open(f'icon{size}.svg', 'w') as f:
                f.write(svg_content)
            print(f"Created SVG icon: icon{size}.svg")
        
        print("\nSVG icons created. To convert to PNG:")
        print("1. Use online converter like convertio.co")
        print("2. Or install ImageMagick: brew install imagemagick")
        print("3. Then run: convert icon16.svg icon16.png")
