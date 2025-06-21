export const CALENDAR_NAME: string = "MakeApp Calendar";
export const CALENDAR_DEFAULT_TIMEZONE: string =
  "America/Argentina/Buenos_Aires";

export const apiUrlsByService = {
  calendar: "https://www.googleapis.com/",
  sheets: "https://sheets.googleapis.com/",
  drive: "https://www.googleapis.com/drive/",
};

type MakeApiCallProps = {
  url: string;
  accessToken: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  service?: keyof typeof apiUrlsByService;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  params?: Record<string, string>;
};

export const makeApiCall = (props: MakeApiCallProps): Promise<Response> => {
  const {
    url,
    accessToken,
    method = "GET",
    data,
    service = "calendar",
  } = props;
  const apiUrl = apiUrlsByService[service];

  const qs = new URLSearchParams(props.params || {}).toString();

  return fetch(`${apiUrl}${url}?${qs}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};
