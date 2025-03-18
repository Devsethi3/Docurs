export interface FileData {
  ufsUrl: string;
  name: string;
}

export interface ServerData {
  userId: string;
  file: FileData;
}

export interface UploadResponse {
  serverData: ServerData;
}

export interface SummaryData {
  summary:
    | string
    | { summary?: string; text?: string; success?: boolean; error?: string };
  title: string;
  name: string;
}

export interface SummaryResponse {
  success: boolean;
  message: string;
  data: SummaryData | null;
}
