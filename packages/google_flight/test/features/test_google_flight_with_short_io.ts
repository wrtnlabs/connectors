import {
  GoogleFlightService,
  IGoogleFlightService,
} from "@wrtnlabs/connector-google-flight";
import { TestGlobal } from "../TestGlobal";
import { ShortIoService } from "@wrtnlabs/connector-short-io";
import typia from "typia";

export const test_google_flight_with_short_io = async () => {
  const googleFlightService = new GoogleFlightService({
    serpApiKey: TestGlobal.env.SERP_API_KEY,
    linkShortener: new ShortIoService({
      shortIoApiKey: TestGlobal.env.SHORT_IO_API_KEY,
      domain: "test-wrtnlabs.short.gy",
    }),
  });

  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);

  const formatDate = (date: Date) => date.toISOString().split("T")[0]!;
  const params: IGoogleFlightService.IRequest = {
    departure_id: "ICN",
    arrival_id: "KIX",
    type: "1",
    outbound_date: formatDate(today),
    travel_class: "1",
    adults: 1,
    children: 0,
    stop: "1",
  };

  const oneWayResult = await googleFlightService.searchOneWay(params);
  typia.assert<IGoogleFlightService.IFinalResponse>(oneWayResult);

  const roundTripResult = await googleFlightService.searchRoundTrip({
    ...params,
    return_date: formatDate(oneWeekLater),
  });
  typia.assert<IGoogleFlightService.IFinalResponse>(roundTripResult);
};
