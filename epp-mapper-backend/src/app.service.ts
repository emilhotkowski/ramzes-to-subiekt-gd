import { Injectable } from '@nestjs/common';
import xlsx from 'node-xlsx';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';

@Injectable()
export class AppService {

  private header = `[NAGLOWEK]
"TOWARY"

[ZAWARTOSC]
`
  private header2 = `
[NAGLOWEK]
"CENNIK"

[ZAWARTOSC]
`

  private header3 = `
[NAGLOWEK]
"GRUPYTOWAROW"

[ZAWARTOSC]
`

  private header4 = `
[NAGLOWEK]
"CECHYTOWAROW"
[ZAWARTOSC]

[NAGLOWEK]
"DODATKOWETOWAROW"

[ZAWARTOSC]
`

  private header5 =`
[NAGLOWEK]
"TOWARYKODYCN"
  
[ZAWARTOSC]
`

  private header6 = `
[NAGLOWEK]
"TOWARYGRUPYJPKVAT"
  
[ZAWARTOSC]
`

  parseXlsxToEPP(bufferXlsx: Buffer): string {
    const xlsxFile = xlsx.parse(bufferXlsx)[0];
    const items: Item[] = this.parseXlsxFileToItems(xlsxFile.data);
    let result = this.header;
    result += this.mapItemsToTowary(items);
    result += this.header2;
    result += this.mapItemsToCennik(items);
    result += this.header3;
    result += this.mapItemsToGrupyTowarow(items);
    result += this.header4;
    result += this.mapItemsToDodatkowe(items);
    result += this.header5;
    result += this.mapItemsToKodCn(items);
    result += this.header6;
    result += this.mapItemsToVat(items);

    fs.appendFileSync('test2.epp', iconv.encode(result, 'windows-1250'));
    return result;
  }

  private parseXlsxFileToItems(xlsxData: any[]): Item[] {
    let number = 0;
    return xlsxData.map(item => {
      
    const itemNew = {
      symbol: number.toString().padStart(5, '0') + ' ' + item[0].trim().substring(0,14),
      name: item[0].trim(),
      vat: item[4].replace(/%/,''),
      quantity: item[8]
    }
    number++;
    return itemNew;
    }).splice(1);
  }

  private mapItemsToTowary(items: Item[]): string {
    let result = "";
    for(const item of items) {
      let singleItem = `1,"${item.symbol}",,,"${item.name}",,"${item.name}",,,"szt.","${item.vat}",${item.vat}.0000,"${item.vat}",${item.vat}.0000,0.0000,0.0000,,0,,,,0.0000,0,,,0,"szt.",0.0000,0.0000,,0,,0,0,,,,,,,,\n`
      result += singleItem;
    }
    return result;
  }

  private mapItemsToCennik(items: Item[]): string {
    let result = "";
    for(const item of items) {
      let singleItem = `"${item.symbol}","Detaliczna",0.0000,0.0000,10.0000,0.0000,0.0000\n"${item.symbol}","Hurtowa",0.0000,0.0000,5.0000,0.0000,0.0000\n"${item.symbol}","Specjalna",0.0000,0.0000,3.0000,0.0000,0.0000\n`
      result += singleItem;
    }
    return result;
  }

  private mapItemsToGrupyTowarow(items: Item[]): string {
    let result = "";
    for(const item of items) {
      let singleItem = `"${item.symbol}","Podstawowa",\n`
      result += singleItem;
    }
    return result;
  }

  private mapItemsToDodatkowe(items: Item[]): string {
    let result = "";
    for(const item of items) {
      let singleItem = `"${item.symbol}",0,0,0.0000,0,0,0\n`
      result += singleItem;
    }
    return result;
  }

  private mapItemsToKodCn(items: Item[]): string {
    let result = "";
    for(const item of items) {
      let singleItem = `"${item.symbol}",\n`
      result += singleItem;
    }
    return result;
  }

  private mapItemsToVat(items: Item[]): string {
    let result = "";
    for(const item of items) {
      let singleItem = `"${item.symbol}",0,0,0,0,0,0,0,0,0,0,0,0,0\n`
      result += singleItem;
    }
    return result;
  }
}

interface Item {
  symbol: string;
  name: string;
  quantity: number;
  vat: string
}

/*

[
  'nazwa',     'typ',
  'handlowy',  'katalogowy',
  'vat_sprz',  'vat_zak',
  'jed_miary', 'stan',
  'wartosc',   'cena_zak',
  'cena_a'
]

*/