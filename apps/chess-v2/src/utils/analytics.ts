export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GA_STREAM_ID = process.env.NEXT_PUBLIC_GA_STREAM_ID ?? "";

export const pageview = (url: URL | string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url
  });
};

export const event = (
  action: Gtag.EventNames,
  {
    event_category,
    event_label,
    value,
    search_term,
    ...props
  }: Gtag.EventParams
) => {
  window?.gtag("event", action, {
    event_category,
    event_label,
    value,
    search_term,
    ...props
  });
};

export const logException = (
  url: URL,
  { description, fatal, ...rest }: Gtag.EventParams
) => {
  pageview(url);
  if (description) {
    window.gtag("event", "exception", {
      description,
      fatal,
      ...rest
    });
  }
};
