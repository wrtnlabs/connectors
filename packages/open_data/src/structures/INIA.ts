import { MyPick } from "@wrtnlabs/connector-shared";
import { IOpenDataService } from "./IOpenDataService";

/**
 * Korea Intelligence Information Society Agency Type
 */
export namespace INIA {
  /**
   * @title Parking lot search conditions
   * @description Search is possible only if the road name address or street address matches exactly
   */
  export type IGetParkingLotInput = IOpenDataService.ICommon.IPaginationInput &
    (MyPick<ParkingLot, "rdnmadr"> | MyPick<ParkingLot, "lnmadr">);

  export type ParkingLot = {
    /**
     * @title Parking lot management number
     */
    prkplceNo?: string;

    /**
     * @title Parking lot name
     */
    prkplceNm?: string;

    /**
     * @title Parking lot classification
     */
    prkplceSe?: string;

    /**
     * @title Parking lot type
     */
    prkplceType?: string;

    /**
     * @title road name address (read name address)
     */
    rdnmadr?: string;

    /**
     * @title Lot number address
     */
    lnmadr?: string;
    /**
     * @title Number of parking spaces
     */
    prkcmprt?: string;

    /**
     * @title Urgent Distinction
     */
    feedingSe?: string;

    /**
     * @title Subtitle enforcement classification
     */
    enforceSe?: string;

    /**
     * @title Operating days
     */
    operDay?: string;

    /**
     * @title Weekday operation start time
     */
    weekdayOperOpenHhmm?: string;

    /**
     * @title Weekday operating closing time
     */
    weekdayOperColseHhmm?: string;

    /**
     * @title Saturday operation start time
     */
    satOperOperOpenHhmm?: string;

    /**
     * @title Saturday closing time
     */
    satOperCloseHhmm?: string;

    /**
     * @title Holiday operation start time
     */
    holidayOperOpenHhmm?: string;

    /**
     * @title Holiday closing time
     */
    holidayCloseOpenHhmm?: string;

    /**
     * @title Rate information
     */
    parkingchrgeInfo?: string;

    /**
     * @title Basic parking time
     */
    basicTime?: string;

    /**
     * @title Basic parking fee
     */
    basicCharge?: string;

    /**
     * @title Additional unit time
     */
    addUnitTime?: string;

    /**
     * @title Additional unit fee
     */
    addUnitCharge?: string;

    /**
     * @title 1-day parking fee application time
     */
    dayCmmtktAdjTime?: string;

    /**
     * @title 1-day parking fee
     */
    dayCmmtkt?: string;

    /**
     * @title Monthly pass fee
     */
    monthCmmtkt?: string;

    /**
     * @title Payment method
     */
    metpay?: string;

    /**
     * @title Special Notes
     */
    spcmnt?: string;

    /**
     * @title Management Agency Name
     */
    institutionNm?: string;

    /**
     * @title phone number
     */
    phoneNumber?: string;

    /**
     * @title Latitude
     */
    latitude?: string;

    /**
     * @title Hardness
     */
    longitude?: string;

    /**
     * @title Whether there is a parking area for the disabled
     */
    pwdbsPpkZoneYn?: string;

    /**
     * @title Data reference date
     */
    referenceDate?: string;

    /**
     * @title Provider Code
     */
    instt_code?: string;

    /**
     * @title Provider Name of institution
     */
    instt_nm?: string;
  };

  /**
   * @title Parking lot inquiry response
   */
  export interface IGetParkingLotOutput
    extends IOpenDataService.ICommon.IPaginationOutput {
    /**
     * @title Parking lot information
     */
    parkingLots: ParkingLot[];
  }
}
