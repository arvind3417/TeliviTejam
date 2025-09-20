#!/usr/bin/env python3
"""
LearnFirst Icon Generator
Creates simple placeholder icons for the browser extension.
Run: python3 create-icons.py
"""

import os
from PIL import Image, ImageDraw, ImageFont
import sys

def create_icon(size, filename):
    # Create a new image with purple gradient background
    img = Image.new('RGB', (size, size), color='#667eea')
    draw = ImageDraw.Draw(img)
    
    # Create gradient effect
    for y in range(size):
        color_ratio = y / size
        r = int(102 + (118 - 102) * color_ratio)  # 667eea to 764ba2
        g = int(126 + (75 - 126) * color_ratio)
        b = int(234 + (162 - 234) * color_ratio)
        color = (r, g, b)
        draw.line([(0, y), (size, y)], fill=color)
    
    # Add target symbol (🎯) in the center
    center = size // 2
    
    # Outer circle (white)
    circle_size = size // 3
    draw.ellipse([
        center - circle_size,
        center - circle_size,
        center + circle_size,
        center + circle_size
    ], fill='white')
    
    # Inner circle (red)
    inner_circle = circle_size // 2
    draw.ellipse([
        center - inner_circle,
        center - inner_circle,
        center + inner_circle,
        center + inner_circle
    ], fill='#ff4444')
    
    # Center dot (white)
    dot_size = circle_size // 4
    draw.ellipse([
        center - dot_size,
        center - dot_size,
        center + dot_size,
        center + dot_size
    ], fill='white')
    
    # Save the icon
    icons_dir = 'icons'
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
    
    img.save(os.path.join(icons_dir, filename))
    print(f"Created {filename} ({size}x{size})")

def main():
    try:
        # Check if PIL is available
        from PIL import Image, ImageDraw
    except ImportError:
        print("Error: PIL (Python Imaging Library) is not installed.")
        print("Install it with: pip install Pillow")
        print("\nAlternatively, create your own PNG icons with these sizes:")
        print("- icon-16.png  (16x16)")
        print("- icon-32.png  (32x32)")  
        print("- icon-48.png  (48x48)")
        print("- icon-128.png (128x128)")
        return
    
    print("Creating LearnFirst extension icons...")
    
    # Create icons in different sizes
    create_icon(16, 'icon-16.png')
    create_icon(32, 'icon-32.png')
    create_icon(48, 'icon-48.png')
    create_icon(128, 'icon-128.png')
    
    print("\n✅ All icons created successfully!")
    print("🎯 Your LearnFirst extension is ready to install!")

if __name__ == "__main__":
    main()
