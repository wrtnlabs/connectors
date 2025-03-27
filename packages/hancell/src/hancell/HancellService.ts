import xlsx from "xlsx";
import { IHancellService } from "../structures/IHancellService";
import { base64ToBuffer, bufferToBase64 } from "@wrtnlabs/connector-shared";

export class HancellService {
  /**
   * Hancell Service.
   *
   * Modify a Hansel sheet
   *
   * If the sheet already exists, modify it, or add it if it did not exist before.
   */
  async upsertSheet(
    input: IHancellService.IUpsertSheetInput,
  ): Promise<IHancellService.IUpsertSheetOutput> {
    try {
      const workbook = await this.getWorkboot(input);
      const sheet = workbook.Sheets[input.sheetName]!;

      /**
       * 이미 시트가 존재할 경우 해당 시트를 지우고 셀 정보를 대치한다.
       */
      if (workbook.SheetNames.includes(input.sheetName)) {
        workbook.SheetNames = workbook.SheetNames.filter(
          (name) => name !== input.sheetName,
        );
      }

      const updatedSheet = this.insertCells({
        sheet,
        cells: input.cells,
      });

      xlsx.utils.book_append_sheet(workbook, updatedSheet, input.sheetName);
      const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

      return { fileBase64: bufferToBase64(buffer) };
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  /**
   * Hancell Service.
   *
   * Read a Hansel file
   */
  async getHancellData(
    input: IHancellService.IReadHancellInput,
  ): Promise<IHancellService.IReadHancellOutput> {
    try {
      const workbook = await this.getWorkboot(input);

      const data = Object.entries(workbook.Sheets)
        .map(([sheetName, sheet]) => {
          const cells = Object.entries(sheet)
            .filter(([key]) => {
              const cellReferenceRegex = /^[A-Z]+[1-9][0-9]*$/;
              return cellReferenceRegex.test(key);
            })
            .map(([key, value]: [string, { v: any }]) => {
              return { [key]: value.v };
            })
            .reduce<Record<string, any>>((acc, cur) => {
              return Object.assign(acc, cur);
            }, {});

          return { [sheetName]: cells };
        })
        .reduce((acc, cur) => {
          return Object.assign(acc, cur);
        }, {});

      return data;
    } catch (error) {
      console.error(JSON.stringify(error));
      throw error;
    }
  }

  private async getWorkboot(input: IHancellService.IReadHancellInput) {
    const buffer = base64ToBuffer(input.fileBase64);

    const workbook = xlsx.read(buffer, { type: "buffer" });

    return workbook;
  }

  /**
   * 시트의 각 셀에 데이터를 덮어씁니다.
   *
   * @param sheet 시트
   * @param cells 시트에 덮어쓰기 할 셀 정보
   * @returns 인자로 받은 `sheet`를 덮어 쓴 결과물
   */
  private insertCells(input: {
    sheet: xlsx.WorkSheet;
    cells: IHancellService.Cells;
  }) {
    const { sheet, cells } = input;
    Object.entries(cells).forEach(([key, value]) => {
      sheet[key] = {
        t: typeof value === "number" ? "n" : "s",
        v: value,
        w: String(value),
      };
    });

    /**
     * sheet의 범위 밖에 글을 쓰려는 경우, 필요한 최소한의 영역으로 시트 범위를 확장합니다.
     */
    if (sheet["!ref"]) {
      const original = xlsx.utils.decode_range(sheet["!ref"]);
      Object.entries(cells)
        .map(([key]) => xlsx.utils.decode_cell(key))
        .forEach((newRange) => {
          original.s.r = Math.min(original.s.r, newRange.r);
          original.s.c = Math.min(original.s.c, newRange.c);

          original.e.r = Math.max(original.e.r, newRange.r);
          original.e.c = Math.max(original.e.c, newRange.c);
        });

      sheet["!ref"] = xlsx.utils.encode_range(original);
    }

    return sheet;
  }
}
