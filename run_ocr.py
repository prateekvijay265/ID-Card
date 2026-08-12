import cv2
import easyocr
from pyzbar.pyzbar import decode
import json

img_path = r'C:\Users\prate\Desktop\hhgoa\public\assets\hhgoa-2026-clean-template.png'
img = cv2.imread(img_path)

reader = easyocr.Reader(['en'])
results = reader.readtext(img)

out = []
for i, (bbox, text, prob) in enumerate(results):
    pts = [[int(pt[0]), int(pt[1])] for pt in bbox]
    out.append({"index": i, "text": text, "bbox": pts})

barcodes = []
decoded_objects = decode(img)
for i, obj in enumerate(decoded_objects):
    pts = [[int(pt.x), int(pt.y)] for pt in obj.polygon]
    barcodes.append({"index": i, "data": obj.data.decode('utf-8'), "type": obj.type, "bbox": pts})

with open("ocr_results.json", "w") as f:
    json.dump({"text": out, "barcodes": barcodes, "image_shape": img.shape}, f, indent=2)

print("OCR complete")
