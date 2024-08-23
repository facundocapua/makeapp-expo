export const CALENDAR_NAME: string = "MakeApp Calendar";
export const CALENDAR_DEFAULT_TIMEZONE: string =
  "America/Argentina/Buenos_Aires";

export const apiUrlsByService = {
  calendar: "https://www.googleapis.com/",
  sheets: "https://sheets.googleapis.com/",
};

type MakeApiCallProps = {
  url: string;
  accessToken: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  service?: keyof typeof apiUrlsByService;
  data?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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

  return fetch(`${apiUrl}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
};
