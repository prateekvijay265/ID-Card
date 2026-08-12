import cv2
import numpy as np
import json

img_path = r'C:\Users\prate\Desktop\hhgoa\public\assets\hhgoa-2026-clean-template.png'
img = cv2.imread(img_path)

# QR Code Detector
qr_decoder = cv2.QRCodeDetector()
val, pts, qr_code = qr_decoder.detectAndDecode(img)
qr_bbox = pts.tolist() if pts is not None else None

# Let's find barcodes. A barcode is a dense area of vertical lines.
# We can use Scharr or Sobel operator to find it.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gradX = cv2.Sobel(gray, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
gradY = cv2.Sobel(gray, ddepth=cv2.CV_32F, dx=0, dy=1, ksize=-1)
gradient = cv2.subtract(gradX, gradY)
gradient = cv2.convertScaleAbs(gradient)
blurred = cv2.blur(gradient, (9, 9))
(_, thresh) = cv2.threshold(blurred, 225, 255, cv2.THRESH_BINARY)
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (21, 7))
closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
closed = cv2.erode(closed, None, iterations=4)
closed = cv2.dilate(closed, None, iterations=4)
contours, _ = cv2.findContours(closed.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

barcode_bboxes = []
for c in contours:
    x, y, w, h = cv2.boundingRect(c)
    # barcode is usually wide and not too tall, but let's just log large ones
    if w > 50 and h > 20 and y > 100:
        barcode_bboxes.append([x, y, w, h])

out = {
    "qr": qr_bbox,
    "barcodes_candidates": barcode_bboxes
}
with open("qr_barcode.json", "w") as f:
    json.dump(out, f, indent=2)

print("Detection complete")
