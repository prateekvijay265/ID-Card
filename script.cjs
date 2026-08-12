const jimp = require('jimp'); jimp.read('public/pfp_bg_new.jpg').then(img => { console.log(img.bitmap.width + 'x' + img.bitmap.height); });
