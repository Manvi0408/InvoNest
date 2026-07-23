import { Controller, Post, Body } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('upload')
  async uploadInvoice(
    @Body() body: { base64Data: string; fileName: string; orgId: string },
  ) {
    return this.ocrService.extractInvoiceFromDocument(
      body.base64Data,
      body.fileName,
      body.orgId,
    );
  }
}
