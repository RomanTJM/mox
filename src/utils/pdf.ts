import { PDFDocument, rgb } from 'pdf-lib';
import type { Venue } from '../types';
import fontkit from '@pdf-lib/fontkit';

export async function generateVenuePDF(venue: Venue) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);
  // Загружаем шрифт (пусть лежит в public/fonts/Roboto-Regular.ttf)
  const fontUrl = '/fonts/Roboto-Regular.ttf';
  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  const customFont = await pdfDoc.embedFont(fontBytes);
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
  const { width, height } = page.getSize();

  // Add title
  page.drawText('Информация о площадке', {
    x: 50,
    y: height - 50,
    size: 24,
    font: customFont,
    color: rgb(0, 0, 0),
  });

  // Add venue details
  const details = [
    `Название: ${venue.name}`,
    `Адрес: ${venue.address}`,
    `Вместимость: ${venue.capacity} человек`,
    `Дата создания: ${new Date(venue.created_at).toLocaleDateString()}`,
  ];

  details.forEach((detail, index) => {
    page.drawText(detail, {
      x: 50,
      y: height - 100 - (index * 30),
      size: 12,
      font: customFont,
      color: rgb(0, 0, 0),
    });
  });

  // If there's an image, add it
  if (venue.image_url) {
    try {
      const imageBytes = await fetch(venue.image_url).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedJpg(imageBytes);
      const imageDims = image.scale(0.5);
      
      page.drawImage(image, {
        x: 50,
        y: height - 300,
        width: imageDims.width,
        height: imageDims.height,
      });
    } catch (error) {
      console.error('Error embedding image:', error);
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
} 