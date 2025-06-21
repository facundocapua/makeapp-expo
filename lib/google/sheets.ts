import { makeApiCall } from "./utils";

export type SpreadsheetType = {
  spreadsheetId: string;
  properties: {
    title: string;
    timeZone: string;
  };
  sheets: {
    properties: {
      sheetId: number;
      title: string;
    };
  }[];
};

export const SPREADSHEET_NAME = "MakeApp Payments";

export type DriveFileType = {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
};

export const listSpreadsheets = async (
  accessToken: string,
): Promise<DriveFileType[]> => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,mimeType,createdTime,modifiedTime)&orderBy=modifiedTime desc",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("Error listing spreadsheets:", error);
    return [];
  }
};

export const getSpreadsheetByName = async (
  name: string,
  accessToken: string,
): Promise<SpreadsheetType | null> => {
  try {
    const spreadsheets = await listSpreadsheets(accessToken);
    const found = spreadsheets.find((sheet) => sheet.name === name);

    if (found) {
      return await getSpreadsheet(found.id, accessToken);
    }

    return null;
  } catch (error) {
    console.error("Error getting spreadsheet:", error);
    return null;
  }
};

export const createSpreadsheet = async (
  name: string,
  accessToken: string,
): Promise<SpreadsheetType> => {
  const response = await makeApiCall({
    url: "/v4/spreadsheets",
    accessToken,
    method: "POST",
    service: "sheets",
    data: {
      properties: {
        title: name,
      },
      sheets: [
        {
          properties: {
            title: "Payments",
          },
        },
      ],
    },
  });

  return response.json();
};

export const getSpreadsheet = async (
  spreadsheetId: string,
  accessToken: string,
): Promise<SpreadsheetType> => {
  const response = await makeApiCall({
    url: `/v4/spreadsheets/${spreadsheetId}`,
    accessToken,
    service: "sheets",
  });

  return response.json();
};

export const appendToSpreadsheet = async (
  spreadsheetId: string,
  range: string,
  values: string[][],
  accessToken: string,
): Promise<void> => {
  await makeApiCall({
    url: `/v4/spreadsheets/${spreadsheetId}/values/${range}:append`,
    accessToken,
    method: "POST",
    service: "sheets",
    data: {
      range,
      majorDimension: "ROWS",
      values,
    },
  });
};

export const createPaymentsSheet = async (
  spreadsheetId: string,
  accessToken: string,
): Promise<void> => {
  await makeApiCall({
    url: `/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    accessToken,
    method: "POST",
    service: "sheets",
    data: {
      requests: [
        {
          addSheet: {
            properties: {
              title: "Payments",
            },
          },
        },
      ],
    },
  });
};

export const initializeSpreadsheetHeaders = async (
  spreadsheetId: string,
  accessToken: string,
): Promise<void> => {
  const headers = [
    [
      "Fecha",
      "Método de Pago",
      "Descripción",
      "Monto",
      "Servicio",
      "Cliente ID",
    ],
  ];

  // First, try to create the Payments sheet if it doesn't exist
  try {
    await createPaymentsSheet(spreadsheetId, accessToken);
  } catch {
    // Sheet might already exist, that's fine
    console.log("Payments sheet might already exist");
  }

  await makeApiCall({
    url: `/v4/spreadsheets/${spreadsheetId}/values/Payments!A1:F1`,
    accessToken,
    method: "PUT",
    service: "sheets",
    data: {
      range: "Payments!A1:F1",
      majorDimension: "ROWS",
      values: headers,
    },
  });
};
