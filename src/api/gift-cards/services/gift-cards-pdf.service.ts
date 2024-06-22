import puppeteer from 'puppeteer';
import jsPDF from 'jspdf';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v1 as uuidv1 } from 'uuid';
import { GiftCardEntity } from '../entities/gift-card.entity';

const JSZip = require('jszip');

@Injectable()
export class GiftCardsPdfService {
  private generatePDFPage = async (cardElements: any) => {
    const browser = await puppeteer
      .launch
      //   {
      //   headless: true,
      //   ignoreDefaultArgs: ['--disable-extensions'],
      //   args: ['--no-sandbox', '--use-gl=egl', '--disable-setuid-sandbox'],
      //   ignoreHTTPSErrors: true,
      // }
      ();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 3 });
    // await page.setUserAgent(
    //   'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    // );

    const htmlContent = `
      <html>
      <head>
          <style>
              .grid { display: grid; grid-template-columns: repeat(2, 0.1fr); grid-template-rows: repeat(4, 0.1fr); width: 8.5in; height: 11in; padding: 0.3in; }
          </style>
           <style>
            @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
        </style>
      </head>
      <body>
          <div class="grid">
              ${cardElements.join('')}
          </div>
      </body>
      </html>
  `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const elementHandle = await page.$('.grid');

    if (!elementHandle) {
      await browser.close();
      throw new Error('Element not found');
    }

    const screenshotBuffer = await elementHandle.screenshot({ type: 'png' });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const data = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;

    pdf.addImage(data, 'PNG', 0, 0, 595.28, 841.89);

    await browser.close();
    return pdf.output('arraybuffer');
  };

  private getCardHTML = (cardData: GiftCardEntity, isFront: any) => {
    if (isFront) {
      return `
            <div style="width: 3.375in; height: 2.125in; background-color: #F4A261; padding: 0.05in; color: #F4A261; gap: 0.1in;">
                <div style="background-color: #264653; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; position: relative;">
                    <div style="position: absolute; right: 0.1in; top: 0.12in; width: 100%; font-weight: 600; display: flex; justify-content: flex-end; align-items: flex-start; font-size: 0.19in; ">
                        <div>${cardData.variant.tickets} | Tickets</div>
                    </div>
                    <div style="font-size: 0.65in; font-family: 'Bangers';">Eventure</div>
                </div>
            </div>
        `;
    } else {
      return `
            <div style="width: 3.375in; height: 2.125in; background-color: #F4A261; padding: 0.05in; color: #F4A261; font-family: 'Bubblegum Sans';">
                <div style="background-color: #264653; width: 100%; height: 100%;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-left: 0.2in; padding-right: 0.2in; padding-top: 0.1in; space-y: 0.1in;">
                        <div style="display: flex; flex-direction: column; gap: 0;">
                            <div style="font-size: 0.23in; font-family: 'Bangers';">Eventure</div>
                            <div>Gift Card</div>
                        </div>
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0;">
                            <div>www.eventure.com</div>
                            <div>support@eventure.com</div>
                        </div>
                    </div>
                    <div style="font-size: 0.14in;">
                        <ul>
                            <li>Scratch below to reveal your unique ticket code.</li>
                            <li>This gift card is redeemable for ONE time only on Eventure!</li>
                            <li>Don't share your code with others.</li>
                            <li>Find your next adventure!</li>
                        </ul>
                    </div>
                    <div style="background-color: #E9C46A; font-size: 0.175in; width: 3.375in; height: 0.3in; display: flex; justify-content: center; align-items: center; color: #264653;">
                        AL23B-HJK4D-F879Z-XCV12
                    </div>
                </div>
            </div>
        `;
    }
  };

  downloadCardsAsPDF = async (
    onProgressChange: (progress: number, fileName: string, ack: string) => void,
    cards: GiftCardEntity[],
  ) => {
    onProgressChange(0, '', 'In Progress');
    const numberOfCardsInPage = 10;

    const zip = new JSZip();
    const numPages = Math.ceil(cards.length / numberOfCardsInPage);

    for (let page = 0; page < numPages; page++) {
      const startIndex = page * numberOfCardsInPage;
      const endIndex = Math.min((page + 1) * numberOfCardsInPage, cards.length);
      const cardData = cards.slice(startIndex, endIndex);

      const backPromises = cardData.map((card: any) =>
        this.getCardHTML(card, false),
      );
      const frontPromises = cardData.map((card: any) =>
        this.getCardHTML(card, true),
      );

      const backBlob = await this.generatePDFPage(backPromises);

      const progressAfterBackPDFGeneration =
        ((page * 2 + 1) / (numPages * 2)) * 100;
      onProgressChange(
        Math.ceil(progressAfterBackPDFGeneration),
        '',
        'In Progress',
      );

      const frontBlob = await this.generatePDFPage(frontPromises);

      const zipPage = new JSZip();
      zipPage.file(`patch_${page + 1}_back.pdf`, backBlob);
      zipPage.file(`patch_${page + 1}_front.pdf`, frontBlob);

      zip.file(
        `patch_${page + 1}.zip`,
        await zipPage.generateAsync({ type: 'arraybuffer' }),
      );

      const progressAfterZipping = ((page + 1) / numPages) * 100;
      onProgressChange(Math.ceil(progressAfterZipping), '', 'In Progress');
    }

    const id = uuidv1();

    zip
      .generateAsync({ type: 'uint8array' })
      .then(async (content: Uint8Array) => {
        // const zipBlob = new Blob([content]);
        // const zipUrl = URL.createObjectURL(zipBlob);
        fs.appendFile(`uploads/cards-${id}.zip`, content, (error) => {
          if (error) console.log(error);
          else {
            onProgressChange(100, `cards-${id}.zip`, 'Completed');
          }
        });
      });
  };
}
