import { tags } from "typia";
import {
  MyPartial,
  MyPick,
  NTpule,
  StrictOmit,
} from "@wrtnlabs/connector-shared";

type OneOf<T extends object, K extends keyof T = keyof T> = K extends any
  ? Record<K, T[K]>
  : never;

export namespace IGoogleSlidesService {
  export interface IProps {
    /**
     * Google Client ID.
     */
    clientId: string;

    /**
     * Google Client Secret.
     */
    clientSecret: string;

    /**
     * Google Refresh Token.
     */
    refreshToken: string;
  }

  export type ISimplePresentationIdOutput = MyPick<
    Presentation,
    "presentationId" | "pageSize" | "title"
  >;

  export interface IExportHanshowOutput {
    /**
     * @title Base64 encoded Hanshow file
     */
    hanshowBase64: string;
  }

  export interface IExportPresentationOutput {
    /**
     * @title Base64 encoded PowerPoint file
     */
    powerPointBase64: string;
  }

  export interface AppendQuarterDivisionSlideInput {
    /**
     * As a slide to add, this template arrangement consists of the same type of template.
     * Templates have unconditional text except for the Entire type, and the image and text are paired.
     * When the user creates a storyline, the text may be concise, but if it means a fairy tale book, a cartoon, or a speech bubble,
     * it is better to substitute a text of sufficient length to grasp the context of the story even if viewed again later.
     *
     * @title templates
     */
    templates: StrictOmit<
      IGoogleSlidesService.Template.QuarterDivision,
      "type"
    >[];
  }

  export interface AppendEntireSlideInput {
    /**
     * As a slide to add, this template arrangement consists of the same type of template.
     * Templates have unconditional text except for the Entire type, and the image and text are paired.
     * When the user creates a storyline, the text may be concise, but if it means a fairy tale book, a cartoon, or a speech bubble,
     * it is better to substitute a text of sufficient length to grasp the context of the story even if viewed again later.
     *
     * @title templates
     */
    templates: StrictOmit<IGoogleSlidesService.Template.Entire, "type">[];
  }

  export interface AppendLandscapeSlideInput {
    /**
     * As a slide to add, this template arrangement consists of the same type of template.
     * Templates have unconditional text except for the Entire type, and the image and text are paired.
     * When the user creates a storyline, the text may be concise, but if it means a fairy tale book, a cartoon, or a speech bubble,
     * it is better to substitute a text of sufficient length to grasp the context of the story even if viewed again later.
     *
     * @title templates
     */
    templates: StrictOmit<IGoogleSlidesService.Template.Landscape, "type">[];
  }

  export interface AppendVerticalSlideInput {
    /**
     * As a slide to add, this template arrangement consists of the same type of template.
     * Templates have unconditional text except for the Entire type, and the image and text are paired.
     * When the user creates a storyline, the text may be concise, but if it means a fairy tale book, a cartoon, or a speech bubble,
     * it is better to substitute a text of sufficient length to grasp the context of the story even if viewed again later.
     *
     * @title templates
     */
    templates: StrictOmit<IGoogleSlidesService.Template.Vertical, "type">[];
  }

  export interface AppendSquareSlideInput {
    /**
     * As a slide to add, this template arrangement consists of the same type of template.
     * Templates have unconditional text except for the Entire type, and the image and text are paired.
     * When the user creates a storyline, the text may be concise, but if it means a fairy tale book, a cartoon, or a speech bubble,
     * it is better to substitute a text of sufficient length to grasp the context of the story even if viewed again later.
     *
     * @title templates
     */
    templates: StrictOmit<IGoogleSlidesService.Template.Square, "type">[];
  }

  /**
   * @title Request DTO for pasting slides
   */
  export interface AppendSlideInput {
    /**
     * @title Presentation ID
     */
    id: string;

    /**
     * When creating a story or picture book, please use only squares.
     *
     * @title A list of templates to create at once
     */
    templates: IGoogleSlidesService.Template[];
  }

  /**
   * @title A template for limiting the input form to fit the user's use case
   *
   * The name of the type was determined based on the location of the image.
   */
  export type Template =
    | Template.Vertical
    | Template.Square
    | Template.Landscape
    | Template.Entire
    | Template.QuarterDivision;
  // | Template.SixthDivision
  // | Template.Exhibition
  // | Template.Corner
  // | Template.CornerHalf;

  export namespace Template {
    /**
     * @title vertical
     */
    export type Vertical = {
      /**
       * @title The type of the template
       *
       * type must be "Vertical"
       */
      type: "Vertical";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;

        /**
         * @title Text corresponding to the image
         */
        text: InsertText;
      };
    };

    /**
     * When creating a story or picture book, please use only squares.
     *
     * @title Square
     */
    export type Square = {
      /**
       * @title The type of the template
       *
       * type must be "Square".
       */
      type: "Square";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;

        /**
         * @title Text corresponding to the image
         */
        text: InsertText;
      };
    };

    /**
     * @title Horizontal
     */
    export type Landscape = {
      /**
       * @title The type of the template
       *
       * type must be "Landscape".
       */
      type: "Landscape";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;

        /**
         * @title Text corresponding to the image
         */
        text: InsertText;
      };
    };

    /**
     * @title View all Horizontal (16:9)
     */
    export type Entire = {
      /**
       * @title The type of the template
       *
       * type must be "Entire".
       */
      type: "Entire";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;
      };
    };

    /**
     * @title 4-part square (cut cartoon type)
     */
    export type QuarterDivision = {
      /**
       * @title The type of the template
       *
       * type must be "QuarterDivision".
       */
      type: "QuarterDivision";

      /**
       * Here, like a four-cut cartoon, four images and four texts must be put in, so the length of the arrangement must be 4.
       * Therefore, you must prepare in advance by receiving or generating four images.
       *
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;

        /**
         * @title Text corresponding to the image
         */
        text: InsertText;
      }[] &
        tags.MinItems<4> &
        tags.MaxItems<4>;
    };

    /**
     * @title 6-part square (cut cartoon type)
     */
    export type SixthDivision = {
      /**
       * @title The type of the template
       *
       * type must be "SixthDivision".
       */
      type: "SixthDivision";

      /**
       * @title Contents of the slide
       */
      contents: NTpule<
        6,
        {
          /**
           * If there is a problem with the image, the message below may appear.
           * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
           * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
           *
           * 1. The provided image was not found.
           * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
           *
           * @title URL of the image
           */
          url: string & tags.Format<"iri">;

          /**
           * @title Text corresponding to the image
           */
          text: InsertText;
        }
      >;
    };

    /**
     * @title Vertical 1-split (6:8)
     */
    export type Exhibition = {
      /**
       * @title The type of the template
       *
       * type must be "Exhibition".
       */
      type: "Exhibition";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;

        /**
         * @title The title part of the text corresponding to the image
         */
        header: InsertText;

        /**
         * @title The body part of the text corresponding to the image
         */
        body: InsertText;
      };
    };

    /**
     * Title (width 100%: height 20%)
     * Body (width 60%: height 80%)
     * Image (width 40%: height 80%)
     *
     * @title Horizontal 1-split
     */
    export type Corner = {
      /**
       * @title The type of the template
       *
       * type must be "Corner".
       */
      type: "Corner";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: string & tags.Format<"iri">;

        /**
         * @title The title part of the text corresponding to the image
         */
        header: InsertText;

        /**
         * @title The body part of the text corresponding to the image
         */
        body: InsertText;
      };
    };

    /**
     * Title (width 100%: height 20%)
     * Body (width 70%: height 80%)
     * Image (width 30%: height 40%)
     *
     * @title Horizontal 2-split
     */
    export type CornerHalf = {
      /**
       * @title The type of the template
       *
       * type must be "CornerHalf".
       */
      type: "CornerHalf";

      /**
       * @title Contents of the slide
       */
      contents: {
        /**
         * If there is a problem with the image, the message below may appear.
         * You must insert only existing images, and if the image is too small, you can spit out errors, so insert an image of the appropriate size or create it yourself to insert the image.
         * The first error below is when the image does not exist, and the second is when the size or format of the image is not valid. The image must be in jpg, jpeg, and png formats.
         *
         * 1. The provided image was not found.
         * 2. There was a problem retrieving the image. The provided image should be publicly accessible, within size limit, and in supported formats.
         *
         * @title URL of the image
         */
        url: NTpule<2, string & tags.Format<"iri">>;

        /**
         * @title The title part of the text corresponding to the image
         */
        header: InsertText;

        /**
         * @title The body part of the text corresponding to the image
         */
        body: InsertText;
      };
    };
  }

  /**
   * @title Condition DTO of the presentation to be modified
   */
  export interface IUpdatePresentationInput {
    /**
     * @title The ID of the presentation to be modified
     */
    requests: BatchUpdateInput[];
  }

  export type BatchUpdateInput =
    | {
        /**
         * @title Information about the new slide to be created
         */
        createSlide: CreateSlideRequest;
      }
    | {
        createImage: CreateImageRequest;
      }
    | {
        insertText: InsertText;
      }
    | {
        createShape: CreateShape;
      }
    | {
        replaceAllText: ReplaceAllText;
      }
    | {
        updateTextStyle: UpdateTextStyle;
      }
    | {
        updateShapeProperties: UpdateShapeProperties;
      };

  export interface UpdateShapeProperties {
    /**
     * The fields that should be updated. At least one field must be specified. The root `shapeProperties` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example to update the shape background solid fill color, set `fields` to `"shapeBackgroundFill.solidFill.color"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset.
     */
    fields: string;
    /**
     * The object ID of the shape the updates are applied to.
     */
    objectId: string;
    /**
     * The shape properties to update.
     */
    shapeProperties: ShapeProperties;
  }

  export interface UpdateTextStyle {
    /**
     * The fields that should be updated. At least one field must be specified. The root `style` is implied and should not be specified. A single `"*"` can be used as short-hand for listing every field. For example, to update the text style to bold, set `fields` to `"bold"`. To reset a property to its default value, include its field name in the field mask but leave the field itself unset.
     */
    fields?: (string | null) & tags.Default<"*">;

    /**
     * The object ID of the shape or table with the text to be styled.
     */
    objectId: string;

    /**
     * The style(s) to set on the text. If the value for a particular style matches that of the parent, that style will be set to inherit. Certain text style changes may cause other changes meant to mirror the behavior of the Slides editor. See the documentation of TextStyle for more information.
     */
    style: TextStyle;
  }

  export interface ReplaceAllText {
    /**
     * If non-empty, limits the matches to page elements only on the given pages. Returns a 400 bad request error if given the page object ID of a notes master, or if a page with that object ID doesn't exist in the presentation.
     */
    pageObjectIds?: string[] | null;
    /**
     * The text that will replace the matched text.
     */
    replaceText?: string | null;
  }

  export interface CreateShape {
    /**
     * The element properties for the shape.
     */
    elementProperties?: PageElementProperties;

    /**
     * A user-supplied object ID. If you specify an ID, it must be unique among all pages and page elements in the presentation. The ID must start with an alphanumeric character or an underscore (matches regex `[a-zA-Z0-9_]`); remaining characters may include those as well as a hyphen or colon (matches regex `[a-zA-Z0-9_-:]`). The length of the ID must not be less than 5 or greater than 50. If empty, a unique identifier will be generated.
     */
    objectId?: string | null;

    /**
     * The shape type.
     */
    shapeType?: Shape.Type;
  }

  export interface InsertText {
    /**
     * @title Text to add
     */
    text?: (string & tags.MinLength<1>) | null;

    /**
     * @title ID
     */
    objectId?: string | null;
  }

  export interface CreateImageRequest {
    /**
     * The element properties for the image. When the aspect ratio of the provided size does not match the image aspect ratio, the image is scaled and centered with respect to the size in order to maintain the aspect ratio. The provided transform is applied after this operation. The PageElementProperties.size property is optional. If you don't specify the size, the default size of the image is used. The PageElementProperties.transform property is optional. If you don't specify a transform, the image will be placed at the top-left corner of the page.
     */
    elementProperties?: PageElementProperties;

    /**
     * A user-supplied object ID. If you specify an ID, it must be unique among all pages and page elements in the presentation. The ID must start with an alphanumeric character or an underscore (matches regex `[a-zA-Z0-9_]`); remaining characters may include those as well as a hyphen or colon (matches regex `[a-zA-Z0-9_-:]`). The length of the ID must not be less than 5 or greater than 50. If you don't specify an ID, a unique one is generated.
     */
    objectId?: string | null;

    /**
     * The image URL. The image is fetched once at insertion time and a copy is stored for display inside the presentation. Images must be less than 50 MB in size, can't exceed 25 megapixels, and must be in one of PNG, JPEG, or GIF formats. The provided URL must be publicly accessible and up to 2 KB in length. The URL is saved with the image, and exposed through the Image.source_url field.
     */
    url?: (string & tags.Format<"iri">) | null;
  }

  /**
   * Common properties for a page element. Note: When you initially create a PageElement, the API may modify the values of both `size` and `transform`, but the visual size will be unchanged.
   */
  export interface PageElementProperties {
    /**
     * The object ID of the page where the element is located.
     */
    pageObjectId?: string | null;

    /**
     * The size of the element.
     */
    size?: Size;

    /**
     * The transform for the element.
     */
    transform?: Transform;
  }

  export interface CreateSlideRequest {
    /**
     * The optional zero-based index indicating where to insert the slides. If you don't specify an index, the slide is created at the end.
     */
    insertionIndex?: number | null;

    /**
     * A user-supplied object ID. If you specify an ID, it must be unique among all pages and page elements in the presentation. The ID must start with an alphanumeric character or an underscore (matches regex `[a-zA-Z0-9_]`)
     * remaining characters may include those as well as a hyphen or colon (matches regex `[a-zA-Z0-9_-:]`). The ID length must be between 5 and 50 characters, inclusive. If you don't specify an ID, a unique one is generated.
     */
    objectId?: string | null;

    /**
     * An optional list of object ID mappings from the placeholder(s) on the layout to the placeholders that are created on the slide from the specified layout. Can only be used when `slide_layout_reference` is specified.
     */
    placeholderIdMappings?: LayoutPlaceholderIdMapping[];

    /**
     * Layout reference of the slide to be inserted, based on the *current master*, which is one of the following: - The master of the previous slide index. - The master of the first slide, if the insertion_index is zero. - The first master in the presentation, if there are no slides. If the LayoutReference is not found in the current master, a 400 bad request error is returned. If you don't specify a layout reference, the slide uses the predefined `BLANK` layout.
     */
    slideLayoutReference?: LayoutReference;
  }

  export interface LayoutReference {
    /**
     * Layout ID: the object ID of one of the layouts in the presentation.
     */
    layoutId?: string | null;

    /**
     * Predefined layout.
     */
    predefinedLayout?: string | null;
  }

  /**
   * The user-specified ID mapping for a placeholder that will be created on a slide from a specified layout.
   */
  export interface LayoutPlaceholderIdMapping {
    /**
     * The placeholder on a layout that will be applied to a slide. Only type and index are needed. For example, a predefined `TITLE_AND_BODY` layout may usually have a TITLE placeholder with index 0 and a BODY placeholder with index 0.
     */
    layoutPlaceholder?: Placeholder;
    /**
     * The object ID of the placeholder on a layout that will be applied to a slide.
     */
    layoutPlaceholderObjectId?: string | null;
    /**
     * A user-supplied object ID for the placeholder identified above that to be created onto a slide. If you specify an ID, it must be unique among all pages and page elements in the presentation. The ID must start with an alphanumeric character or an underscore (matches regex `[a-zA-Z0-9_]`); remaining characters may include those as well as a hyphen or colon (matches regex `[a-zA-Z0-9_-:]`). The length of the ID must not be less than 5 or greater than 50. If you don't specify an ID, a unique one is generated.
     */
    objectId?: string | null;
  }

  /**
   * @title Condition DTO for presentation search
   */
  export interface IGetPresentationInput {
    /**
     * @title The presentation ID to search for
     */
    presentationId: string;
  }

  /**
   * @title Request DTO for generating a presentation in Google Slides
   */
  export type ICreatePresentationInput = MyPick<Presentation, "title">;

  /**
   * @title Google Slides의 Presentation resource
   */
  export interface Presentation {
    /**
     * @title Presentation ID
     */
    presentationId?: string | null;

    /**
     * @title The page size of the presentation
     */
    pageSize?: Size;

    /**
     * @@title A slide in a presentation
     *
     * Slides inherit properties from the slide layout.
     */
    slides?: Page[];

    /**
     * @title The title of the presentation
     */
    title?: string | null;

    /**
     * The slide master contains all the common page elements and common properties for a set of layouts. It serves three purposes:
     *
     * - The placeholder shapes on the master contain the default text styles and shape properties for all placeholder shapes on pages that use that master.
     * - The master page properties define general page properties that are inherited by the layout.
     * - All other shapes on the master slide appear on all slides that use that master, regardless of the layout.
     *
     * @title The slide master of a presentation
     */
    masters?: Page[];

    /**
     * @title A template that aligns and styles content
     *
     * A layout in a presentation is a template that determines how content is aligned and styled on slides inherited from that layout.
     */
    layouts?: Page[];

    /**
     * @title Language of the presentation
     *
     * IETF BCP 47 language tag format.
     */
    locale?:
      | tags.Constant<"eu", { title: "미국 영어" }>
      | tags.Constant<"ko", { title: "한국어" }>
      | null;

    /**
     * Can be used in update requests to assert that the presentation version has not changed since the last read operation.
     *
     * Only populated if the user has edit access to the presentation.
     *
     * The version ID is not a sequential number, but an opaque string.
     *
     * The format of the version ID may change over time, so it should be treated as opaque.
     *
     * The returned version ID is only valid for 24 hours after it is returned, and cannot be shared between users.
     *
     * If the version ID does not change between calls, then the presentation has not changed.
     *
     * Conversely, a changed ID (same presentation and user) usually means that the presentation has been updated.
     *
     * However, the ID may have changed due to internal factors, such as a change in the ID format.
     *
     * @title ID of the presentation version for printing only
     */
    revisionId?: string | null;

    /**
     * @title Note Master for Presentation
     */
    notesMaster?: Page;
  }

  export interface Size {
    /**
     * @title Width of the object
     */
    width?: Dimension;

    /**
     * @title The height of the object
     */
    height?: Dimension;
  }

  export interface Dimension {
    /**
     * @title scale
     */
    magnitude?: number | null;

    /**
     * @title Size units
     */
    unit?: Unit | null;
  }

  /**
   * @title Unit of measurement
   */
  export type Unit =
    | tags.Constant<"UNIT_UNSPECIFIED", { title: "알 수 없는 단위" }>
    | tags.Constant<
        "EMU",
        {
          title: "영국식 단위 (EMU)";
          description: "는 1센티미터의 1/360,000으로 정의되므로 인치당 914,400 EMU 및 포인트당 12,700 EMU가 있습니다.";
        }
      >
    | tags.Constant<"PT", { title: "포인트"; description: "1/72인치입니다." }>;

  export type Page =
    | SlidePage
    | LayoutPage
    | NotesPage
    | MasterPage
    | NoteMasterPage;

  export interface SlidePage extends PageBase {
    pageType?: "SLIDE";

    /**
     * @title Slides a specific property
     */
    slideProperties: SlideProperties;
  }

  export interface LayoutPage extends PageBase {
    pageType?: "LAYOUT";

    /**
     * @title layout property
     */
    layoutProperties: LayoutProperties;
  }

  export interface NotesPage extends PageBase {
    pageType?: "NOTES";

    /**
     * @title memo attribute
     */
    notesProperties: NotesProperties;
  }

  export interface MasterPage extends PageBase {
    pageType?: "MASTER";
    /**
     * @title Master specific attributes
     */
    masterProperties: MasterProperties;
  }
  export interface NoteMasterPage extends PageBase {
    pageType: "NOTES_MASTER";
  }

  export type PageBase = {
    /**
     * @title The object ID of this page
     *
     * The object IDs used by `Page` and `PageElement` share the same namespace.
     */
    objectId?: string | null;

    /**
     * @title Page type
     */
    pageType?: PageType | null;

    /**
     * @title The page element rendered on the page
     */
    pageElements?: PageElement[];

    /**
     * @title Attributes of the page
     */
    pageProperties?: PageProperties;
  };

  export interface MasterProperties {
    /**
     * @title Human-readable master name
     */
    displayName?: string | null;
  }

  /**
   * @title pageType A Page property that is relevant only to pages that have NOTES
   */
  export interface NotesProperties {
    /**
     * @title The object ID of the shape on this notes page that contains the presenter notes for that slide
     */
    speakerNotesObjectId?: string | null;
  }

  export interface LayoutProperties {
    /**
     * @title The object ID of the master on which this layout is based
     */
    masterObjectId?: string | null;

    /**
     * @title The name of the layout
     */
    name?: string | null;

    /**
     * @title The human-readable name of the layout
     */
    displayName?: string | null;
  }

  export interface SlideProperties {
    /**
     * @title The object ID of the layout that this slide is based on
     */
    readonly layoutObjectId?: string | null;

    /**
     * This is the master object ID that this slide is based on.
     */
    readonly masterObjectId?: string | null;

    /**
     * Defines the visual appearance of the notes page when printing or exporting slides that contain speaker notes.
     *
     * The notes page inherits properties from the notes master.
     *
     * A placeholder shape of type BODY on the notes page contains the speaker notes for this slide.
     *
     * The ID of this shape is identified by the speakerNotesObjectId field.
     *
     * @title This is the notes page associated with this slide
     * @todo Removed for now due to recursion issues
     */
    // readonly notesPage?: Page;

    /**
     * @title Whether to skip slides in presentation mode
     */
    isSkipped?: (boolean & tags.Default<false>) | null;
  }

  export interface PageProperties {
    /**
     * The background fill for the page.
     *
     * If not set, the background fill will be inherited from the parent page (if any).
     *
     * If the page has no parent element, the background fill will default to the corresponding fill in the Slides editor.
     */
    pageBackgroundFill?: PageBackgroundFill;

    /**
     * @title Color scheme of the page
     */
    colorScheme?: ColorScheme;
  }

  /**
   * @title Predefined color palette for the page
   */
  export interface ColorScheme {
    /**
     * @title ThemeColorType and its corresponding concrete color pair
     */
    colors?: ThemeColorPair[];
  }

  export interface ThemeColorPair {
    /**
     * @title is the theme color type
     */
    type?: ThemeColorType | null;

    /**
     * @title A specific color corresponding to the theme color type above
     */
    color?: RgbColor;
  }

  /**
   * @title Theme Color Types
   *
   * PageProperties contains a ColorScheme that maps these theme color types to specific colors.
   */
  export type ThemeColorType =
    | tags.Constant<
        "THEME_COLOR_TYPE_UNSPECIFIED",
        { title: "지정되지 않은 테마 색상 이 값은 사용해서는 안 됩니다." }
      >
    | tags.Constant<"DARK1", { title: "첫 번째 어두운 색상을 나타냅니다." }>
    | tags.Constant<"LIGHT1", { title: "첫 번째 밝은 색상을 나타냅니다." }>
    | tags.Constant<"DARK2", { title: "두 번째 어두운 색상을 나타냅니다." }>
    | tags.Constant<"LIGHT2", { title: "두 번째 밝은 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT1", { title: "첫 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT2", { title: "두 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT3", { title: "세 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT4", { title: "네 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT5", { title: "다섯 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT6", { title: "6번째 강조 색상을 나타냅니다." }>
    | tags.Constant<
        "HYPERLINK",
        { title: "하이퍼링크에 사용할 색상을 나타냅니다." }
      >
    | tags.Constant<
        "FOLLOWED_HYPERLINK",
        { title: "방문한 하이퍼링크에 사용할 색상을 나타냅니다." }
      >
    | tags.Constant<"TEXT1", { title: "첫 번째 텍스트 색상을 나타냅니다." }>
    | tags.Constant<"BACKGROUND1", { title: "첫 번째 배경 색상을 나타냅니다." }>
    | tags.Constant<"TEXT2", { title: "두 번째 텍스트 색상을 나타냅니다." }>
    | tags.Constant<
        "BACKGROUND2",
        { title: "두 번째 배경 색상을 나타냅니다." }
      >;

  export type PageBackgroundFill = {
    /**
     * @title Background fill property status
     */
    propertyState?: PropertyState | null;
  } & MyPartial<FillOption>;

  type FillOption = OneOf<{
    /**
     * @title Solid color fill
     */
    solidFill?: SolidFill;

    /**
     * @title Fill in the enlarged photo
     */
    stretchedPictureFill?: StretchedPictureFill;
  }>;

  /**
   * Fills a stretched image.
   *
   * The page or page element is completely filled with the specified image.
   *
   * The image is stretched to fit the container.
   *
   * @title Fill stretched image
   */
  export interface StretchedPictureFill {
    /**
     * This URL is tagged with the requester account.
     *
     * Anyone with the URL will have effective access to the photo as the original requester.
     *
     * If the sharing settings of the presentation change, the photo may become inaccessible.
     *
     * When you insert, the photo is imported once and a copy is saved for display in the presentation.
     *
     * The photo must be less than 50 MB, no larger than 25 megapixels, and in PNG, JPEG, or GIF format.
     *
     * The maximum length of the URL provided is 2 KB.
     *
     * @title The URL of a photo with a default lifetime of 30 minutes
     */
    contentUrl?: (string & tags.Format<"iri">) | null;

    /**
     * @title Original size of the photo fill
     */
    readonly size?: Size;
  }

  /**
   * @title Page type
   */
  export type PageType =
    | tags.Constant<"SLIDE", { title: "슬라이드 페이지" }>
    | tags.Constant<"MASTER", { title: "마스터 슬라이드 페이지" }>
    | tags.Constant<"LAYOUT", { title: "레이아웃 페이지" }>
    | tags.Constant<"NOTES", { title: "메모 페이지" }>
    | tags.Constant<"NOTES_MASTER", { title: "메모 마스터 페이지" }>;

  /**
   * @title The page element rendered on the page
   */
  export type PageElementBase = {
    /**
     * @title The object ID of this page element
     *
     * The object IDs used by `Page` and `PageElement` share the same namespace.
     */
    objectId?: string | null;

    /**
     * @ttitle The size of the page element.
     */
    size?: Size;

    /**
     * The visual appearance of the page element is determined by its absolute transformation.
     *
     * To calculate the absolute transformation, the transformation of the page element is concatenated with the transformations of all its parent groups.
     *
     * If the page element is not in a group, the absolute transformation is equal to the value of this field.
     *
     * The initial transformation of a newly created Group is always the ID transformation.
     *
     * @title The transformation of the page element
     */
    transform?: Transform;

    /**
     * @title The title of the page element
     *
     * Combined with the description, displays alternative text.
     */
    title?: string;

    /**
     * @title Description of the page element
     *
     * Combined with the title, displays alternative text.
     */
    description?: string;
  };

  export type PageElement =
    | ShapePageElement
    | ImagePageElement
    | LinePageElement;

  export interface ShapePageElement extends PageElementBase {
    /**
     * @title General shape
     */
    shape: Shape;
  }

  export interface ImagePageElement extends PageElementBase {
    /**
     * @title image page element
     */
    image: Image;
  }

  export interface LinePageElement extends PageElementBase {
    /**
     * @title line page element
     */
    line: Line;
  }

  export interface Shape {
    /**
     * @title Type of shape
     */
    shapeType?: Shape.Type;

    /**
     * @title Text content of the shape
     */
    text?: TextContent;

    /**
     * @title Shape properties
     */
    shapeProperties?: ShapeProperties;

    /**
     * @title Placeholder is a page element that inherits from its placeholder in the layout and master
     *
     * If set, the shape is a placeholder shape and the inherited properties can be determined by checking the parent placeholder identified by the Placeholder.parent_object_id field.
     */
    placeholder?: Placeholder;
  }

  export interface Placeholder {
    /**
     * @title Type of placeholder
     */
    type:
      | tags.Constant<
          "NONE",
          { title: "기본값은 자리표시자가 아니라는 의미입니다." }
        >
      | tags.Constant<"BODY", { title: "본문 텍스트." }>
      | tags.Constant<"CHART", { title: "차트 또는 그래프" }>
      | tags.Constant<"CLIP_ART", { title: "클립 아트 이미지" }>
      | tags.Constant<
          "CENTERED_TITLE",
          { title: "제목이 가운데에 표시됩니다." }
        >
      | tags.Constant<"DIAGRAM", { title: "다이어그램" }>
      | tags.Constant<"DATE_AND_TIME", { title: "날짜 및 시간" }>
      | tags.Constant<"FOOTER", { title: "바닥글 텍스트" }>
      | tags.Constant<"HEADER", { title: "헤더 텍스트" }>
      | tags.Constant<"MEDIA", { title: "멀티미디어" }>
      | tags.Constant<"OBJECT", { title: "모든 콘텐츠 유형" }>
      | tags.Constant<"PICTURE", { title: "사진." }>
      | tags.Constant<"SLIDE_NUMBER", { title: "슬라이드의 번호입니다." }>
      | tags.Constant<"SUBTITLE", { title: "부제" }>
      | tags.Constant<"TABLE", { title: "표를 클릭합니다." }>
      | tags.Constant<"TITLE", { title: "슬라이드 제목" }>
      | tags.Constant<"SLIDE_IMAGE", { title: "슬라이드 이미지입니다." }>;

    /**
     * @title The index of the placeholder
     *
     * If there are the same placeholder type on the same page, the index values are different.
     */
    index?: number & tags.Type<"int64">;

    /**
     * @title The object ID of the parent placeholder of this shape
     *
     * If not set, the shape will not inherit properties from other shapes since there is no parent placeholder shape.
     */
    parentObjectId?: string;
  }

  /**
   * If the shape is a placeholder shape determined by the placeholder field, these properties may be inherited from the parent placeholder shape.
   *
   * The rendered value of the property depends on the corresponding propertyState field value.
   *
   * Auto-fitting text on shapes is automatically disabled by request, which may affect how text is applied to the shape.
   *
   * @title Shape properties
   */
  export interface ShapeProperties {
    /**
     * If the background fill for the shape is not set, the parent placeholder inherits the background fill.
     *
     * If the shape has no parent, the default background fill depends on the shape type and matches the default for new shapes created in the Slides editor.
     *
     * @title Background fill for the shape
     */
    shapeBackgroundFill?: ShapeBackgroundFill;

    /**
     * If not set, the outline is inherited from the parent placeholder.
     *
     * If the shape has no parent, the default outline depends on the shape type and matches the default for new shapes created in the Slides editor.
     *
     * @title The outline of the shape
     */
    outline?: Outline;

    /**
     * If not set, the shadow is inherited from the parent placeholder.
     *
     * If the shape has no parent, the default shadow matches the default for new shapes created in the Slides editor.
     *
     * @title Shadow property of the shape
     */
    readonly shadow?: Shadow;

    /**
     * If not set, the link will not be displayed.
     *
     * The link is not inherited from the parent placeholder.
     *
     * @title The hyperlink target of the shape
     */
    link?: Link;

    /**
     * If unspecified, alignment is inherited if there is a parent placeholder.
     *
     * If a shape has no parent, the default alignment matches the alignment of new shapes created in the Slides editor.
     *
     * @title Alignment of content within a shape
     */
    contentAlignment?: ContentAlignment | null;

    /**
     * @title Autofit property of the shape
     *
     * This property is only set on shapes that accept text.
     */
    autofit?: AutoFit;
  }

  /**
   * @title Autofit property of `Shape`
   */
  export interface AutoFit {
    /**
     * The autofit type of the shape.
     *
     * If the autofit type is AUTOFIT_TYPE_UNSPECIFIED, the parent placeholder inherits the autofit type.
     *
     * If there is a request that can affect the text alignment within the bounding text box, this field is automatically set to NONE.
     *
     * In this case, fontScale applies to fontSize and lineSpacingReduction applies to lineSpacing.
     *
     * Both properties are reset to their default values.
     */
    autofitType?: AutofitType | null;

    /**
     * @title Font scale applied to the shape
     */
    readonly fontScale?: number | null;

    /**
     * @title Reduce line spacing applied to shapes
     */
    readonly lineSpacingReduction?: number | null;
  }

  /**
   * @title Auto-fit type
   */
  export type AutofitType =
    | tags.Constant<
        "AUTOFIT_TYPE_UNSPECIFIED",
        { title: "자동 맞춤 유형이 지정되지 않았습니다." }
      >
    | tags.Constant<"NONE", { title: "자동 맞춤 안함" }>
    | tags.Constant<
        "TEXT_AUTOFIT",
        { title: "오버플로우 시 텍스트를 도형에 맞게 축소합니다." }
      >
    | tags.Constant<
        "SHAPE_AUTOFIT",
        { title: "텍스트에 맞게 도형의 크기를 조정합니다." }
      >;

  /**
   * Content Anchoring Type
   *
   * Derived from a subset of the 'ST_TextAnchoringType' simple type values in ECMA-376 4th Edition Part 1, Section 20.1.10.59 of the 'Office Open XML File Format - Fundamentals and Markup Language Reference'.
   *
   * @title Content Anchoring Type
   */
  export type ContentAlignment =
    | tags.Constant<
        "CONTENT_ALIGNMENT_UNSPECIFIED",
        {
          title: `지정되지 않은 콘텐츠 정렬 콘텐츠 정렬이 상위 요소(있는 경우)에서 상속됩니다.`;
        }
      >
    | tags.Constant<
        "CONTENT_ALIGNMENT_UNSUPPORTED",
        { title: `지원되지 않는 콘텐츠 정렬입니다.` }
      >
    | tags.Constant<
        "TOP",
        {
          title: `콘텐츠 홀더 상단에 콘텐츠를 정렬하는 정렬입니다.`;
          description: `ECMA-376 ST_TextAnchoringType 't'에 해당합니다.`;
        }
      >
    | tags.Constant<
        "MIDDLE",
        {
          title: `콘텐츠를 콘텐츠 홀더의 중앙에 정렬한 것입니다.`;
          description: `ECMA-376 ST_TextAnchoringType 'ctr'에 해당합니다.`;
        }
      >
    | tags.Constant<
        "BOTTOM",
        {
          title: `콘텐츠를 콘텐츠 홀더 하단에 정렬한 정렬입니다.`;
          description: `ECMA-376 ST_TextAnchoringType 'b'에 해당합니다.`;
        }
      >;

  /**
   * @title Hypertext link
   */
  export type Link = OneOf<{
    /**
     * If set, indicates that this URL is a link to an external web page.
     */
    url?: (string & tags.Format<"iri">) | null;

    /**
     * If this value is set, the link will be directed to the slide's location in this presentation.
     */
    relativeLink?: RelativeSlideLink | null;

    /**
     * If set, indicates that the link is to a specific page in the presentation with this ID.
     *
     * The page with this ID may not exist.
     */
    pageObjectId?: string | null;

    /**
     * If set, indicates that this is a slide link starting from this 0-based index in the presentation.
     *
     * There may be no slides at this index.
     */
    slideIndex?: (number & tags.Type<"int64">) | null;
  }>;

  /**
   * @title Type of relative link
   */
  export type RelativeSlideLink =
    | tags.Constant<
        "RELATIVE_SLIDE_LINK_UNSPECIFIED",
        { title: "지정되지 않은 상대 슬라이드 링크" }
      >
    | tags.Constant<"NEXT_SLIDE", { title: "다음 슬라이드 링크" }>
    | tags.Constant<"PREVIOUS_SLIDE", { title: "이전 슬라이드 링크" }>
    | tags.Constant<
        "FIRST_SLIDE",
        { title: "프레젠테이션의 첫 번째 슬라이드 링크입니다." }
      >
    | tags.Constant<
        "LAST_SLIDE",
        { title: "프레젠테이션의 마지막 슬라이드 링크입니다." }
      >;

  /**
   * @title Shadow
   */
  export interface Shadow {
    readonly type?:
      | tags.Constant<
          "SHADOW_TYPE_UNSPECIFIED",
          { title: "지정되지 않은 그림자 유형" }
        >
      | tags.Constant<"OUTER", { title: "외부 그림자" }>
      | null;

    /**
     * A transform that encodes the translation, scale, and distortion of a shadow based on its alignment position.
     */
    transform?: AffineTransform;

    /**
     * The alignment point of the shadow, which sets the shadow's transformation point, scale, and distortion direction.
     */
    readonly alignment?: RectanglePosition | null;

    /**
     * @title Radius of the shadow blur
     *
     * The larger the radius, the more diffuse the shadow.
     */
    blurRadius?: Dimension;

    /**
     * @title Shadow color value
     */
    color?: OpaqueColor;

    /**
     * @title Alpha of the shadow color
     */
    alpha?: (number & tags.Minimum<0> & tags.Maximum<1>) | null;

    /**
     * @title Whether the shape should rotate along with the shape
     */
    readonly rotateWithShape?: boolean | null;

    /**
     * Updating a shadow on a page element implicitly updates this field to RENDERED unless a different value is specified in the same request.
     *
     * To prevent a shadow on a page element, set this field to NOT_RENDERED.
     *
     * In this case, any other shadow fields set on the same request will be ignored.
     *
     * @title Shadow property status
     */
    propertyState?: PropertyState | null;
  }

  export type RectanglePosition =
    | tags.Constant<
        "RECTANGLE_POSITION_UNSPECIFIED",
        { title: "지정되지 않았습니다." }
      >
    | tags.Constant<"TOP_LEFT", { title: "왼쪽 상단" }>
    | tags.Constant<"TOP_CENTER", { title: "상단 중앙" }>
    | tags.Constant<"TOP_RIGHT", { title: "오른쪽 상단" }>
    | tags.Constant<"LEFT_CENTER", { title: "왼쪽 가운데입니다." }>
    | tags.Constant<"CENTER", { title: "중앙" }>
    | tags.Constant<"RIGHT_CENTER", { title: "오른쪽 가운데" }>
    | tags.Constant<"BOTTOM_LEFT", { title: "왼쪽 하단" }>
    | tags.Constant<"BOTTOM_CENTER", { title: "하단 중앙" }>
    | tags.Constant<"BOTTOM_RIGHT", { title: "오른쪽 하단" }>;

  export type AffineTransform = Transform;

  export interface Outline {
    /**
     * @title Outline property status
     */
    propertyState?: PropertyState | null;

    /**
     * @title Fill in the outline
     */
    outlineFill?: OutlineFill;

    /**
     * @title Thickness of the outline
     */
    weight?: Dimension;

    /**
     * @title Dash style for outline
     */
    dashStyle?: DashStyle | null;
  }

  /**
   * @title Fill in the outline
   */
  export interface OutlineFill {
    /**
     * @title Solid fill
     */
    solidFill?: SolidFill;
  }

  /**
   * Solid Fill The page or page element is completely filled with the specified color value.
   *
   * The value of an unset field can inherit its value from a parent placeholder if it exists.
   *
   * @title Solid Fill
   */
  export interface SolidFill {
    /**
     * @title Color value of a single color
     */
    color?: OpaqueColor;

    /**
     * The final pixel color is defined by the equation:
     *
     * `Pixel color = (alpha * color) + (1.0 - alpha) * (background color)`
     *
     * That is, a value of 1.0 corresponds to a solid color, while a value of 0.0 corresponds to a completely transparent color.
     *
     * @title The percentage value of the color to be applied to the pixel
     */
    alpha?: (number & tags.Minimum<0> & tags.Maximum<1>) | null;
  }

  /**
   * @title A solid color value with a theme
   */
  export type OpaqueColor = RgbColorMap | ThemeColorMap;

  export interface ThemeColorMap {
    /**
     * @title Theme color type
     */
    themeColor?: ThemeColor;
  }

  export interface RgbColorMap {
    /**
     * @title RGB color type
     */
    rgbColor?: RgbColor;
  }

  type ThemeColor =
    | tags.Constant<
        "THEME_COLOR_TYPE_UNSPECIFIED",
        { title: "지정되지 않은 테마 색상 이 값은 사용해서는 안 됩니다." }
      >
    | tags.Constant<"DARK1", { title: "첫 번째 어두운 색상을 나타냅니다." }>
    | tags.Constant<"LIGHT1", { title: "첫 번째 밝은 색상을 나타냅니다." }>
    | tags.Constant<"DARK2", { title: "두 번째 어두운 색상을 나타냅니다." }>
    | tags.Constant<"LIGHT2", { title: "두 번째 밝은 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT1", { title: "첫 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT2", { title: "두 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT3", { title: "세 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT4", { title: "네 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT5", { title: "다섯 번째 강조 색상을 나타냅니다." }>
    | tags.Constant<"ACCENT6", { title: "6번째 강조 색상을 나타냅니다." }>
    | tags.Constant<
        "HYPERLINK",
        { title: "하이퍼링크에 사용할 색상을 나타냅니다." }
      >
    | tags.Constant<
        "FOLLOWED_HYPERLINK",
        { title: "방문한 하이퍼링크에 사용할 색상을 나타냅니다." }
      >
    | tags.Constant<"TEXT1", { title: "첫 번째 텍스트 색상을 나타냅니다." }>
    | tags.Constant<"BACKGROUND1", { title: "첫 번째 배경 색상을 나타냅니다." }>
    | tags.Constant<"TEXT2", { title: "두 번째 텍스트 색상을 나타냅니다." }>
    | tags.Constant<
        "BACKGROUND2",
        { title: "두 번째 배경 색상을 나타냅니다." }
      >;

  export interface RgbColor {
    /**
     * @title The red component of the color
     */
    red?: (number & tags.Minimum<0> & tags.Maximum<1>) | null;

    /**
     * @title The green component of the color
     */
    green?: (number & tags.Minimum<0> & tags.Maximum<1>) | null;

    /**
     * @title The blue component of the color
     */
    blue?: (number & tags.Minimum<0> & tags.Maximum<1>) | null;
  }

  /**
   * @title Fill shape background
   */
  export interface ShapeBackgroundFill {
    /**
     * Possible states of the `@title` property
     */
    propertyState?: PropertyState | null;

    /**
     * @title Solid fill
     */
    solidFill?: SolidFill;
  }

  export type PropertyState = (
    | tags.Constant<
        "RENDERED",
        {
          title: "RENDERED";
          description: `속성의 상태가 RENDERED인 경우 페이지에서 렌더링될 때 요소에 상응하는 속성이 포함됩니다. 요소가 placeholder 필드에 의해 결정된 자리표시자 도형이고 자리표시자 도형에서 상속되는 경우 해당하는 필드는 설정되지 않을 수 있습니다. 즉, 속성 값이 상위 자리표시자에서 상속됩니다. 요소가 상속되지 않는 경우 필드에는 렌더링된 값이 포함됩니다. 기본값입니다.`;
        }
      >
    | tags.Constant<
        "NOT_RENDERED",
        {
          title: "NOT_RENDERED";
          description: `속성 상태가 NOT_RENDERED인 경우 페이지에서 렌더링될 때 요소에 상응하는 속성이 없는 것입니다. 하지만 하위 도형에 상속될 수 있도록 이 필드는 계속 설정될 수 있습니다. 렌더링된 요소에서 속성을 삭제하려면 propertyState를 NOT_RENDERED로 설정합니다.`;
        }
      >
    | tags.Constant<
        "INHERIT",
        {
          title: "INHERIT";
          description: `속성의 상태가 INHERIT인 경우 속성 상태는 상위 도형의 propertyState 필드에 있는 값을 사용합니다. 상속되지 않는 요소에는 INHERIT 속성 상태가 없습니다.`;
        }
      >
  ) &
    tags.Default<"RENDERED">;

  export interface TextContent {
    /**
     * @title Text content categorized as a component, including styling information
     */
    readonly textElements?: TextElement[];

    /**
     * @title A list of bullets contained in the text
     *
     * Keyed by list ID.
     */
    lists?: {
      [Key: string]: List;
    } | null;
  }

  /**
   * @title A type that describes the design of a bullet in a paragraph associated with a list
   *
   * A paragraph that is part of a list has an implicit reference to the ID of that list.
   */
  export interface List {
    /**
     * @title The ID of the list
     */
    listId?: string | null;

    /**
     * The maximum nesting level of a list is 9, so the available keys are 0 through 8.
     *
     * Contains properties that describe the design of the list bullets at the specified nesting level.
     *
     * @title A map of nesting levels for bullet properties at the relevant level
     */
    nestingLevel?:
      | {
          [Key in 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8]: {
            bulletStyle: TextStyle;
          };
        }
      | null;
  }

  export type TextElement = {
    /**
     * @title The zero-based starting index of this text element (in Unicode code units)
     */
    startIndex?: (number & tags.Type<"int64">) | null;

    /**
     * @title The zero-based ending index of this text element (excluding Unicode code units)
     */
    endIndex?: (number & tags.Type<"int64">) | null;
  } & OneOf<{
    /**
     * @title Paragraph Marker
     *
     * A kind of TextElement that indicates the start of a new paragraph.
     */
    paragraphMarker?: ParagraphMarker;

    /**
     * The startIndex and endIndex of a TextRun are always entirely within the index range of a single paragraphMarker TextElement.
     *
     * That is, a TextRun does not span multiple paragraphs.
     *
     * @title A TextElement representing a text run where all characters in the run have the same TextStyle
     */
    textRun?: TextRun;

    /**
     * @title A TextElement representing a point of text that can be dynamically replaced with content that can change over time
     */
    autoText?: AutoText;
  }>;

  export interface AutoText {
    /**
     * @title The type of this autotext
     */
    type:
      | tags.Constant<
          "TYPE_UNSPECIFIED",
          { title: "지정되지 않은 자동 텍스트 유형" }
        >
      | tags.Constant<
          "SLIDE_NUMBER",
          { title: "현재 슬라이드 번호를 나타내는 자동 텍스트." }
        >;

    /**
     * @title The rendered content of this autotext (if any)
     */
    content: string;

    /**
     * @title Style applied to this autotext
     */
    style?: TextStyle;
  }

  /**
   * @title Text execution
   *
   * A kind of TextElement that represents a RON with all styles identical.
   */
  export interface TextRun {
    /**
     * @title The text of this execution
     */
    content?: string | null;

    /**
     * @title Specifies the style applied to this run
     */
    style?: TextStyle;
  }

  export interface AutoText {
    /**
     * @title The type of this autotext
     */
    type:
      | tags.Constant<
          "TYPE_UNSPECIFIED",
          { title: "지정되지 않은 자동 텍스트 유형" }
        >
      | tags.Constant<
          "SLIDE_NUMBER",
          { title: "현재 슬라이드 번호를 나타내는 자동 텍스트." }
        >;

    /**
     * @title The rendered content of this autotext (if any)
     */
    content: string;

    /**
     * @title Style applied to this autotext
     */
    style?: TextStyle;
  }

  export interface ParagraphMarker {
    /**
     * @title Paragraph style
     */
    style?: ParagraphStyle;

    /**
     * @title The bullet point for this paragraph
     *
     * If not present, the paragraph does not belong in the list.
     */
    bullet?: Bullet;
  }

  /**
   * @title The bullets in the paragraph
   */
  export interface Bullet {
    /**
     * @title The ID of the list this paragraph belongs to
     */
    listId: string;

    /**
     * @title The nesting level of this paragraph in the list
     */
    nestingLevel?: number & tags.Type<"int64">;

    /**
     * @title The bullet glyph rendered for this paragraph
     */
    glyph: string;

    /**
     * @title Paragraph text style applied to this bullet
     */
    bulletStyle: TextStyle;
  }

  /**
   * Indicates a style that can be applied to the TextRun.
   *
   * If this text is contained in a shape with a parent placeholder, this text style can be inherited from the parent element.
   *
   * The text style that is inherited depends on the nesting level of the list.
   *
   * - Text that runs in a paragraph that is not in the list inherits the text style from the paragraph's line break character at nesting level 0 in the list within the parent placeholder.
   * - Text that runs in a paragraph that is in the list inherits the text style from the paragraph's line break character at that nesting level in the list within the parent placeholder.
   *
   * Inherited text styles are indicated by the unset field in this message.
   *
   * If the text is contained in a shape without a parent placeholder, unsetting this field causes the style to revert to a value that matches the default in the Slides editor.
   */
  export interface TextStyle {
    /**
     * @title The background color of the text
     *
     * Setting this property will make the color opaque or transparent, depending on whether the opaqueColor field of the color is set.
     */
    backgroundColor?: OptionalColor;

    /**
     * @title The color of the text itself
     *
     * Setting this property will make the color opaque or transparent, depending on whether the opaqueColor field of the color is set.
     */
    foregroundColor?: OptionalColor;

    /**
     * @title Whether the text is rendered bold
     */
    bold?: boolean | null;

    /**
     * @title Whether to italicize the text
     */
    italic?: boolean | null;

    /**
     * The font of the `@title` text.
     *
     * The font family can be from the font menu in Slides or from Google Fonts.
     *
     * If the font name is not recognized, the text is rendered in `Arial`.
     *
     * Some fonts can affect the weight of the text.
     *
     * If both fonrtFamily and bold values are specified in an update request, the explicitly set bold value is used.
     */
    fontFamily?: string | null;

    /**
     * @title Text font size
     *
     * When reading, `fontSize` is specified in points.
     */
    fontSize?: Dimension;

    /**
     * If not set, the link will not be displayed.
     *
     * The link is not inherited from the parent text.
     *
     * When you change a link in an update request, the text style of the range will change in some ways.
     *
     * When you set a link, the text foreground color is set to ThemeColorType.HYPERLINK and the text is underlined.
     *
     * If these fields are modified in the same request, those values will be used instead of the link defaults.
     *
     * If you set a link to a range of text that overlaps an existing link, the existing link will also be updated to point to the new URL.
     *
     * You cannot set a link to a line break character.
     *
     * So if you set a link to a range of text that crosses a paragraph boundary (e.g., "ABC\n123"), the line break character will be split into its own run of text.
     *
     * The link applies separately to the runs before and after the line break.
     *
     * If you delete a link, the text style of the range will be updated to match the style of the previous text (or the default text style if the previous text is another link), unless a different style is set for the same text.
     *
     * @title The hyperlink target for the text
     */
    link?: Link;

    /**
     * Text with a SUPERSCRIPT or SUBSCRIPT offset is automatically rendered at a smaller font size, calculated based on the fontSize field.
     *
     * fontSize itself is not affected by changes to this field.
     *
     * @title Vertical offset of text from normal position
     */
    baselineOffset?: BaselineOffset | null;

    /**
     * @title Whether the text is in small caps
     */
    smallCaps?: boolean | null;

    /**
     * @title Whether to display strikethrough
     */
    strikethrough?: boolean | null;

    /**
     * @title Whether the text is underlined
     */
    underline?: boolean | null;

    /**
     * @title Font family and rendered thickness of text
     */
    weightedFontFamily?: WeightedFontFamily;
  }

  /**
   * @title Baseline Offset
   *
   * How the text is offset vertically from its normal position.
   */
  export type BaselineOffset =
    | tags.Constant<
        "BASELINE_OFFSET_UNSPECIFIED",
        { title: "텍스트의 기준선 오프셋은 상위 요소로부터 상속됩니다." }
      >
    | tags.Constant<"NONE", { title: "텍스트가 세로로 오프셋되지 않습니다." }>
    | tags.Constant<
        "SUPERSCRIPT",
        { title: "텍스트가 수직 위쪽의 오프셋 (위 첨자)입니다." }
      >
    | tags.Constant<
        "SUBSCRIPT",
        { title: "텍스트가 수직 아래쪽 (아래 첨자)으로 오프셋됩니다." }
      >;

  /**
   * @title A collection of weighted fonts
   */
  export interface WeightedFontFamily {
    /**
     * The font family can be from the font menu in Slides or from Google Fonts.
     *
     * If the font name is not recognized, the text is rendered in Arial.
     *
     * @title The font for the text
     */
    fontFamily?: string | null;

    /**
     * @title The rendered thickness of the text
     */
    weight:
      | (number &
          tags.Type<"int64"> &
          tags.Minimum<100> &
          tags.Maximum<900> &
          tags.MultipleOf<100>)
      | null;
  }

  /**
   * @title Select Color
   *
   * A color that can be completely opaque or completely transparent.
   */
  export interface OptionalColor {
    /**
     * If set, it is used as an opaque color.
     *
     * If not set, it is a transparent color.
     */
    opaqueColor?: OpaqueColor;
  }

  /**
   * If this text is contained in a shape that contains a parent placeholder, this paragraph style may be inherited from the parent element.
   *
   * The paragraph style inherited depends on the nesting level of the list.
   *
   * - A paragraph that is not in a list inherits the paragraph style from the paragraph at nesting level 0 of the list within the parent placeholder.
   * - A paragraph in a list inherits the paragraph style from the paragraph at the corresponding nesting level of the list within the parent placeholder.
   *
   * An inherited paragraph style is indicated by the unset field in this message.
   *
   * @title Style applied to the entire paragraph
   */
  export interface ParagraphStyle {
    lineSpacing?: number | null;

    /**
     * @title Paragraph text alignment type
     */
    alignment?: Alignment | null;

    /**
     * @title The indentation distance for the paragraph corresponding to the beginning of the text based on the current text direction
     */
    indentStart?: Dimension;

    /**
     * @title The indentation distance of the paragraph corresponding to the end of the text based on the current text direction
     */
    indentEnd?: Dimension;

    /**
     * @title Extra space above the paragraph
     *
     * If not set, the value is inherited from the parent element.
     */
    spaceAbove?: Dimension;

    /**
     * @title Extra space is displayed below the paragraph
     *
     * If not set, the value is inherited from the parent element.
     */
    spaceBelow?: Dimension;

    /**
     * @title Indents the beginning of the first line of a paragraph
     *
     * If not set, the value is inherited from the parent element.
     */
    indentFirstLine?: Dimension;

    /**
     * @title The text direction of this paragraph
     */
    direction?: (TextDirection & tags.Default<"LEFT_TO_RIGHT">) | null;

    /**
     * @title Paragraph spacing mode
     */
    spacingMode?: SpacingMode | null;
  }

  /**
   * @title Paragraph text alignment type
   */
  export type Alignment =
    | tags.Constant<
        "ALIGNMENT_UNSPECIFIED",
        { title: "단락 정렬은 상위 요소로부터 상속됩니다." }
      >
    | tags.Constant<
        "START",
        {
          title: "단락이 줄의 시작 부분에 정렬됩니다. LTR 텍스트의 경우 왼쪽, 그렇지 않은 경우 오른쪽 정렬";
        }
      >
    | tags.Constant<"CENTER", { title: "단락이 중앙에 표시됩니다." }>
    | tags.Constant<
        "END",
        {
          title: "단락이 줄의 끝에 정렬됩니다. LTR 텍스트의 경우 오른쪽 정렬, 그렇지 않은 경우 왼쪽 정렬";
        }
      >
    | tags.Constant<"JUSTIFIED", { title: "단락이 정렬되었습니다." }>;

  /**
   * @title Text direction
   *
   * The text path can be displayed.
   */
  export type TextDirection =
    | tags.Constant<
        "TEXT_DIRECTION_UNSPECIFIED",
        { title: "텍스트 방향은 상위 요소로부터 상속됩니다." }
      >
    | tags.Constant<
        "LEFT_TO_RIGHT",
        { title: "텍스트가 왼쪽에서 오른쪽으로 이동합니다." }
      >
    | tags.Constant<
        "RIGHT_TO_LEFT",
        { title: "텍스트가 오른쪽에서 왼쪽으로 이동합니다." }
      >;

  /**
   * @title Spacing Mode
   *
   * Various modes of paragraph spacing.
   */
  export type SpacingMode =
    | tags.Constant<
        "SPACING_MODE_UNSPECIFIED",
        { title: "간격 모드는 상위 요소로부터 상속됩니다." }
      >
    | tags.Constant<
        "NEVER_COLLAPSE",
        { title: "단락 간격은 항상 렌더링됩니다." }
      >
    | tags.Constant<
        "COLLAPSE_LISTS",
        { title: "목록 요소 간에 단락 간격을 건너뜁니다." }
      >;

  /**
   * @title Type of shape
   */
  export namespace Shape {
    /**
     * Most of these shapes correspond to predefined shapes in the ECMA-376 standard.
     *
     * For more information about these shapes, see the description of the 'ST_ShapeType' simple type in section 20.1.10.55 of the Office Open XML File Formats - Fundamentals and Markup Language Reference, Part 1, ECMA-376, Edition 4.
     *
     * @title Shape Types
     */
    export type Type =
      | tags.Constant<"TYPE_UNSPECIFIED", { title: `사전 정의된 도형 유형.` }>
      | tags.Constant<"TEXT_BOX", { title: `텍스트 상자 도형` }>
      | tags.Constant<
          "RECTANGLE",
          { title: `직사각형 도형 ECMA-376 ST_ShapeType 'rect'에 해당합니다.` }
        >
      | tags.Constant<
          "ROUND_RECTANGLE",
          {
            title: `모서리가 둥근 직사각형 ECMA-376 ST_ShapeType 'roundRect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "ELLIPSE",
          { title: `타원형. ECMA-376 ST_ShapeType 'ellipse'에 해당합니다.` }
        >
      | tags.Constant<
          "ARC",
          {
            title: `구부러진 원호 모양 ECMA-376 ST_ShapeType 'arc'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "BENT_ARROW",
          {
            title: `휘어진 화살표 도형 ECMA-376 ST_ShapeType 'bentArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "BENT_UP_ARROW",
          {
            title: `위로 휘어진 화살표 모양 ECMA-376 ST_ShapeType 'bentUpArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "BEVEL",
          { title: `입체 테두리. ECMA-376 ST_ShapeType 'bevel'에 해당합니다.` }
        >
      | tags.Constant<
          "BLOCK_ARC",
          {
            title: `블록 원호 모양 ECMA-376 ST_ShapeType 'blockArc'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "BRACE_PAIR",
          {
            title: `중괄호 쌍 모양입니다. ECMA-376 ST_ShapeType 'bracePair'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "BRACKET_PAIR",
          {
            title: `괄호 쌍 모양 ECMA-376 ST_ShapeType 'rackPair'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CAN",
          {
            title: `도형을 만들 수 있습니다. ECMA-376 ST_ShapeType 'can'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CHEVRON",
          {
            title: `갈매기형 도형 ECMA-376 ST_ShapeType 'chevron'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CHORD",
          { title: `코드 모양 ECMA-376 ST_ShapeType 'chord'에 해당합니다.` }
        >
      | tags.Constant<
          "CLOUD",
          { title: `구름 모양 ECMA-376 ST_ShapeType 'cloud'에 해당합니다.` }
        >
      | tags.Constant<
          "CORNER",
          { title: `모서리 모양 ECMA-376 ST_ShapeType 'corner'에 해당합니다.` }
        >
      | tags.Constant<
          "CUBE",
          { title: `정육면체 ECMA-376 ST_ShapeType 'cube'에 해당합니다.` }
        >
      | tags.Constant<
          "CURVED_DOWN_ARROW",
          {
            title: `아래쪽 화살표 모양 ECMA-376 ST_ShapeType 'curvedDown화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CURVED_LEFT_ARROW",
          {
            title: `왼쪽 구부러진 화살표 모양 ECMA-376 ST_ShapeType 'curvedLeft화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CURVED_RIGHT_ARROW",
          {
            title: `오른쪽 구부러진 화살표 모양 ECMA-376 ST_ShapeType 'curvedRightArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CURVED_UP_ARROW",
          {
            title: `위로 구부러진 화살표 모양 ECMA-376 ST_ShapeType 'curvedUpArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "DECAGON",
          { title: `십각형 도형 ECMA-376 ST_ShapeType 'decagon'에 해당합니다.` }
        >
      | tags.Constant<
          "DIAGONAL_STRIPE",
          {
            title: `대각선 줄무늬 ECMA-376 ST_ShapeType 'diagStripe'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "DIAMOND",
          {
            title: `다이아몬드 모양 ECMA-376 ST_ShapeType 'diamond'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "DODECAGON",
          {
            title: `십이형 도형 ECMA-376 ST_ShapeType 'dodecagon'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "DONUT",
          { title: `도넛 모양 ECMA-376 ST_ShapeType 'donut'에 해당합니다.` }
        >
      | tags.Constant<
          "DOUBLE_WAVE",
          {
            title: `이중 물결 모양. ECMA-376 ST_ShapeType 'doubleWave'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "DOWN_ARROW",
          {
            title: `아래쪽 화살표 도형 ECMA-376 ST_ShapeType 'down화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "DOWN_ARROW_CALLOUT",
          {
            title: `콜아웃 아래쪽 화살표 도형 ECMA-376 ST_ShapeType 'down화살표콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FOLDED_CORNER",
          {
            title: `모서리가 접힌 도형 ECMA-376 ST_ShapeType 'foldedCorner'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FRAME",
          { title: `프레임 모양 ECMA-376 ST_ShapeType 'frame'에 해당합니다.` }
        >
      | tags.Constant<
          "HALF_FRAME",
          {
            title: `절반 프레임 ECMA-376 ST_ShapeType 'halfFrame'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "HEART",
          { title: `하트 모양 ECMA-376 ST_ShapeType 'heart'에 해당합니다.` }
        >
      | tags.Constant<
          "HEPTAGON",
          { title: `7각형 ECMA-376 ST_ShapeType 'heptagon'에 해당합니다.` }
        >
      | tags.Constant<
          "HEXAGON",
          { title: `육각형 모양. ECMA-376 ST_ShapeType '육각형'에 해당합니다.` }
        >
      | tags.Constant<
          "HOME_PLATE",
          {
            title: `홈플레이트 모양 ECMA-376 ST_ShapeType 'homePlate'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "HORIZONTAL_SCROLL",
          {
            title: `가로 스크롤 모양 ECMA-376 ST_ShapeType 'horizontalScroll'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "IRREGULAR_SEAL_1",
          {
            title: `밀봉 1 도형 ECMA-376 ST_ShapeType 'irregularSeal1'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "IRREGULAR_SEAL_2",
          {
            title: `불규칙적인 표시 2 도형 ECMA-376 ST_ShapeType 'irregularSeal2'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_ARROW",
          {
            title: `왼쪽 화살표 도형 ECMA-376 ST_ShapeType 'leftArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_ARROW_CALLOUT",
          {
            title: `콜아웃 왼쪽 화살표 도형 ECMA-376 ST_ShapeType 'left화살표콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_BRACE",
          {
            title: `왼쪽 중괄호 도형. ECMA-376 ST_ShapeType 'leftBrace'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_BRACKET",
          {
            title: `왼쪽 대괄호 모양 ECMA-376 ST_ShapeType 'leftBracket'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_RIGHT_ARROW",
          {
            title: `왼쪽 화살표 모양 ECMA-376 ST_ShapeType 'leftRight화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_RIGHT_ARROW_CALLOUT",
          {
            title: `콜아웃 왼쪽 오른쪽 화살표 도형 ECMA-376 ST_ShapeType 'leftRight화살표콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_RIGHT_UP_ARROW",
          {
            title: `왼쪽/오른쪽 화살표 모양 ECMA-376 ST_ShapeType 'leftRightUp화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LEFT_UP_ARROW",
          {
            title: `왼쪽 화살표 모양 ECMA-376 ST_ShapeType 'leftUpArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "LIGHTNING_BOLT",
          {
            title: `번개 모양 모양 ECMA-376 ST_ShapeType 'lightningBolt'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "MATH_DIVIDE",
          {
            title: `수학 도형을 나눕니다. ECMA-376 ST_ShapeType 'mathDivide'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "MATH_EQUAL",
          { title: `등호 모양 ECMA-376 ST_ShapeType 'mathEqual'에 해당합니다.` }
        >
      | tags.Constant<
          "MATH_MINUS",
          {
            title: `수학 모양 빼기 ECMA-376 ST_ShapeType 'mathMinus'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "MATH_MULTIPLY",
          {
            title: `수학 곱하기 도형 ECMA-376 ST_ShapeType 'mathMultiply'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "MATH_NOT_EQUAL",
          {
            title: `수학 모양이 같지 않습니다. ECMA-376 ST_ShapeType 'mathNotEqual'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "MATH_PLUS",
          { title: `+ ECMA-376 ST_ShapeType 'mathPlus'에 해당합니다.` }
        >
      | tags.Constant<
          "MOON",
          { title: `달 모양 ECMA-376 ST_ShapeType 'moon'에 해당합니다.` }
        >
      | tags.Constant<
          "NO_SMOKING",
          {
            title: `흡연 형태 없음 ECMA-376 ST_ShapeType 'noSmoking'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "NOTCHED_RIGHT_ARROW",
          {
            title: `톱니 모양의 오른쪽 화살표 모양 ECMA-376 ST_ShapeType 'notchedRightArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "OCTAGON",
          {
            title: `팔각형 모양. ECMA-376 ST_ShapeType 'octagon'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "PARALLELOGRAM",
          {
            title: `평행사각형. ECMA-376 ST_ShapeType 'parallelogram'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "PENTAGON",
          { title: `오각형 ECMA-376 ST_ShapeType 'pentagon'에 해당합니다.` }
        >
      | tags.Constant<
          "PIE",
          {
            title: `원형 모양입니다. ECMA-376 ST_ShapeType 'pie'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "PLAQUE",
          { title: `명판 ECMA-376 ST_ShapeType 'plaque'에 해당합니다.` }
        >
      | tags.Constant<
          "PLUS",
          { title: `+ 도형 ECMA-376 ST_ShapeType 'plus'에 해당합니다.` }
        >
      | tags.Constant<
          "QUAD_ARROW",
          {
            title: `4각형 도형 ECMA-376 ST_ShapeType 'quad화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "QUAD_ARROW_CALLOUT",
          {
            title: `콜아웃의 네 방향 화살표 모양 ECMA-376 ST_ShapeType 'quad화살표콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "RIBBON",
          { title: `리본 모양 ECMA-376 ST_ShapeType 'ribbon'에 해당합니다.` }
        >
      | tags.Constant<
          "RIBBON_2",
          { title: `리본 2 도형 ECMA-376 ST_ShapeType 'ribbon2'에 해당합니다.` }
        >
      | tags.Constant<
          "RIGHT_ARROW",
          {
            title: `오른쪽 화살표 도형 ECMA-376 ST_ShapeType 'rightArrow'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "RIGHT_ARROW_CALLOUT",
          {
            title: `콜아웃 오른쪽 화살표 도형 ECMA-376 ST_ShapeType 'right화살표콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "RIGHT_BRACE",
          {
            title: `오른쪽 중괄호 모양. ECMA-376 ST_ShapeType 'rightBrace'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "RIGHT_BRACKET",
          {
            title: `오른쪽 대괄호 모양 ECMA-376 ST_ShapeType 'rightBracket'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "ROUND_1_RECTANGLE",
          {
            title: `모서리가 둥근 직사각형 ECMA-376 ST_ShapeType 'round1Rect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "ROUND_2_DIAGONAL_RECTANGLE",
          {
            title: `대각선으로 모서리가 둥근 두 개의 직사각형 모양 ECMA-376 ST_ShapeType 'round2DiagRect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "ROUND_2_SAME_RECTANGLE",
          {
            title: `같은 측면의 두 모서리가 둥근 직사각형 모양입니다. ECMA-376 ST_ShapeType 'round2SameRect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "RIGHT_TRIANGLE",
          {
            title: `직각 삼각형 ECMA-376 ST_ShapeType 'rtTriangle'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "SMILEY_FACE",
          {
            title: `웃는 얼굴 모양 ECMA-376 ST_ShapeType 'smileyFace'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "SNIP_1_RECTANGLE",
          {
            title: `한쪽 모서리가 잘린 직사각형 도형 ECMA-376 ST_ShapeType 'snip1Rect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "SNIP_2_DIAGONAL_RECTANGLE",
          {
            title: `대각선 절단 모서리가 직사각형 모양입니다. ECMA-376 ST_ShapeType 'snip2DiagRect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "SNIP_2_SAME_RECTANGLE",
          {
            title: `같은 측면의 한쪽 모서리가 잘린 직사각형 도형 ECMA-376 ST_ShapeType 'snip2SameRect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "SNIP_ROUND_RECTANGLE",
          {
            title: `한쪽 모서리가 잘리고 한쪽 모서리가 둥근 직사각형입니다. ECMA-376 ST_ShapeType 'snipRoundRect'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_10",
          {
            title: `10각형 별 모양 ECMA-376 ST_ShapeType 'star10'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_12",
          {
            title: `12각형 별 모양 ECMA-376 ST_ShapeType 'star12'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_16",
          {
            title: `16각형 별 모양 ECMA-376 ST_ShapeType 'star16'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_24",
          {
            title: `24각형 별 모양입니다. ECMA-376 ST_ShapeType 'star24'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_32",
          {
            title: `32개의 별 모양입니다. ECMA-376 ST_ShapeType 'star32'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_4",
          {
            title: `4각형 별 모양. ECMA-376 ST_ShapeType 'star4'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_5",
          {
            title: `5각형 별 모양. ECMA-376 ST_ShapeType 'star5'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STAR_6",
          { title: `6각형 별 모양 ECMA-376 ST_ShapeType 'star6'에 해당합니다.` }
        >
      | tags.Constant<
          "STAR_7",
          { title: `7각형 도형 ECMA-376 ST_ShapeType 'star7'에 해당합니다.` }
        >
      | tags.Constant<
          "STAR_8",
          {
            title: `8각형 별 모양. ECMA-376 ST_ShapeType 'star8'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "STRIPED_RIGHT_ARROW",
          {
            title: `줄무늬가 있는 오른쪽 화살표 도형 ECMA-376 ST_ShapeType 'stripedRight화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "SUN",
          { title: `태양 모양 ECMA-376 ST_ShapeType 'sun'에 해당합니다.` }
        >
      | tags.Constant<
          "TRAPEZOID",
          {
            title: `사다리꼴 모양 ECMA-376 ST_ShapeType 'trapezoid'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "TRIANGLE",
          {
            title: `삼각형 모양 ECMA-376 ST_ShapeType 'triangle'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "UP_ARROW",
          {
            title: `위쪽 화살표 모양 ECMA-376 ST_ShapeType 'up화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "UP_ARROW_CALLOUT",
          {
            title: `설명선 위쪽 화살표 모양 ECMA-376 ST_ShapeType 'up화살표콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "UP_DOWN_ARROW",
          {
            title: `위쪽 화살표 모양 ECMA-376 ST_ShapeType 'upDown화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "UTURN_ARROW",
          {
            title: `U자형 화살표 도형 ECMA-376 ST_ShapeType 'uturn화살표'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "VERTICAL_SCROLL",
          {
            title: `세로 스크롤 도형 ECMA-376 ST_ShapeType 'verticalScroll'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "WAVE",
          { title: `물결 모양. ECMA-376 ST_ShapeType 'wave'에 해당합니다.` }
        >
      | tags.Constant<
          "WEDGE_ELLIPSE_CALLOUT",
          {
            title: `콜아웃 웨지 타원형 도형 ECMA-376 ST_ShapeType 'wedgeEllipse콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "WEDGE_RECTANGLE_CALLOUT",
          {
            title: `콜아웃 웨지 직사각형 도형 ECMA-376 ST_ShapeType 'wedgeRect콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "WEDGE_ROUND_RECTANGLE_CALLOUT",
          {
            title: `콜아웃 웨지 둥근 직사각형 도형 ECMA-376 ST_ShapeType 'wedgeRoundRect콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_ALTERNATE_PROCESS",
          {
            title: `대체 프로세스 흐름 형태 ECMA-376 ST_ShapeType 'flowChartAlternateProcess'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_COLLATE",
          {
            title: `흐름 형태 대조 ECMA-376 ST_ShapeType 'flowChartCollate'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_CONNECTOR",
          {
            title: `커넥터 흐름 모양 ECMA-376 ST_ShapeType 'flowChartConnector'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_DECISION",
          {
            title: `결정 흐름 형태 ECMA-376 ST_ShapeType 'flowChartDecision'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_DELAY",
          {
            title: `지연 흐름 모양 ECMA-376 ST_ShapeType 'flowChartDelay'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_DISPLAY",
          {
            title: `흐름 모양을 표시합니다. ECMA-376 ST_ShapeType 'flowChartDisplay'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_DOCUMENT",
          {
            title: `문서 흐름 도형 ECMA-376 ST_ShapeType 'flowChartDocument'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_EXTRACT",
          {
            title: `흐름 형태를 추출합니다. ECMA-376 ST_ShapeType 'flowChartExtract'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_INPUT_OUTPUT",
          {
            title: `입력 출력 흐름 모양. ECMA-376 ST_ShapeType 'flowChartInputOutput'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_INTERNAL_STORAGE",
          {
            title: `내부 저장소 흐름 형태 ECMA-376 ST_ShapeType 'flowChartInternalStorage'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MAGNETIC_DISK",
          {
            title: `자기 디스크 흐름 형태 ECMA-376 ST_ShapeType 'flowChartMagneticDisk'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MAGNETIC_DRUM",
          {
            title: `자기 드럼 흐름 모양. ECMA-376 ST_ShapeType 'flowChartMagneticDrum'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MAGNETIC_TAPE",
          {
            title: `자기 테이프 흐름 모양 ECMA-376 ST_ShapeType 'flowChartMagneticTape'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MANUAL_INPUT",
          {
            title: `수동 입력 흐름 형태 ECMA-376 ST_ShapeType 'flowChartManualInput'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MANUAL_OPERATION",
          {
            title: `수동 작업 흐름 형태 ECMA-376 ST_ShapeType 'flowChartManualOperation'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MERGE",
          {
            title: `병합 흐름 도형 ECMA-376 ST_ShapeType 'flowChartMerge'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_MULTIDOCUMENT",
          {
            title: `다중 문서 흐름 도형 ECMA-376 ST_ShapeType 'flowChartMultidocument'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_OFFLINE_STORAGE",
          {
            title: `오프라인 스토리지 흐름 형태 ECMA-376 ST_ShapeType 'flowChartOfflineStorage'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_OFFPAGE_CONNECTOR",
          {
            title: `페이지 외부 커넥터 흐름 모양 ECMA-376 ST_ShapeType 'flowChartOffpageConnector'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_ONLINE_STORAGE",
          {
            title: `온라인 스토리지 흐름 형태 ECMA-376 ST_ShapeType 'flowChartOnlineStorage'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_OR",
          {
            title: `유동적인 형태입니다. ECMA-376 ST_ShapeType 'flowChartOr'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_PREDEFINED_PROCESS",
          {
            title: `사전 정의된 프로세스 흐름 모양 ECMA-376 ST_ShapeType 'flowChartPreProcess'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_PREPARATION",
          {
            title: `준비 흐름 모양 ECMA-376 ST_ShapeType 'flowChartPreparation'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_PROCESS",
          {
            title: `프로세스 흐름 형태 ECMA-376 ST_ShapeType 'flowChartProcess'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_PUNCHED_CARD",
          {
            title: `천공 카드 흐름 도형 ECMA-376 ST_ShapeType 'flowChartPunchedCard'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_PUNCHED_TAPE",
          {
            title: `천공 테이프 흐름 모양 ECMA-376 ST_ShapeType 'flowChartPunchedTape'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_SORT",
          {
            title: `흐름 모양 정렬 ECMA-376 ST_ShapeType 'flowChartSort'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_SUMMING_JUNCTION",
          {
            title: `교차로 흐름의 형태 ECMA-376 ST_ShapeType 'flowChartSummingJunction'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "FLOW_CHART_TERMINATOR",
          {
            title: `종결자 흐름 형태입니다. ECMA-376 ST_ShapeType 'flowChartTerminator'에 해당합니다.`;
          }
        >
      | tags.Constant<"ARROW_EAST", { title: `동쪽 화살표 모양` }>
      | tags.Constant<"ARROW_NORTH_EAST", { title: `북동쪽 화살표 모양` }>
      | tags.Constant<"ARROW_NORTH", { title: `북쪽 화살표 모양` }>
      | tags.Constant<"SPEECH", { title: `음성 도형` }>
      | tags.Constant<"STARBURST", { title: `별 버스트 도형` }>
      | tags.Constant<
          "TEARDROP",
          {
            title: `눈물방울 모양 ECMA-376 ST_ShapeType 'teardrop'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "ELLIPSE_RIBBON",
          {
            title: `타원형 리본 모양 ECMA-376 ST_ShapeType 'ellipseRibbon'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "ELLIPSE_RIBBON_2",
          {
            title: `타원형 리본 2 도형 ECMA-376 ST_ShapeType 'ellipseRibbon2'에 해당합니다.`;
          }
        >
      | tags.Constant<
          "CLOUD_CALLOUT",
          {
            title: `콜아웃 구름 모양 ECMA-376 ST_ShapeType 'cloud콜아웃'에 해당합니다.`;
          }
        >
      | tags.Constant<"CUSTOM", { title: `맞춤 도형` }>;
  }

  /**
   * @title Image
   *
   * A type of `PageElement` representing an image.
   */
  export interface Image {
    /**
     * This URL is tagged with the requester's account.
     *
     * Anyone with the URL effectively has access to the image as the original requester.
     *
     * If the presentation's sharing settings change, the image will become inaccessible.
     *
     * @title URL of an image with a default lifetime of 30 minutes
     */
    contentUrl?: string | null;

    /**
     * @title Image properties
     */
    imageProperties: ImageProperties;

    /**
     * @title Source URL is the URL used to embed the image
     *
     * The source URL can be left blank.
     */
    sourceUrl?: string | null;

    /**
     * If set, the image is the placeholder image.
     *
     * All inherited properties can be checked by checking the parent placeholder identified by the Placeholder.parent_object_id field.
     *
     * @title The page element that inherits from the corresponding placeholder in the layout and master
     */
    placeholder?: Placeholder;
  }

  /**
   * @title Image properties
   */
  export interface ImageProperties {
    /**
     * @title The cropping property of the image
     *
     * If not set, the image will not be cropped.
     */
    readonly cropProperties?: CropProperties;

    /**
     * @title The transparency effect of the image
     *
     * Here, 0 means no effect, 1 means completely transparent.
     */
    readonly transparency?: (number & tags.Minimum<0> & tags.Maximum<1>) | null;

    /**
     * @title The brightness effect of the image
     *
     * 0 means no effect.
     */
    readonly brightness?: (number & tags.Minimum<-1> & tags.Maximum<1>) | null;

    /**
     * @title Contrast effect of the image
     */
    readonly contrast?: (number & tags.Minimum<-1> & tags.Maximum<1>) | null;

    /**
     * @title The outline of the image
     *
     * If not set, the image will have no outline.
     */
    readonly recolor?: Recolor;

    /**
     * @title The outline of the image
     *
     * If not set, the image will have no shadow.
     */
    readonly outline?: Outline;

    /**
     * @title This is the shadow of the image
     */
    readonly shadow?: Shadow;

    /**
     * @title Hyperlink target of the image
     *
     * If not set, the link will not be displayed.
     */
    link?: Link;
  }

  export interface CropProperties {
    /**
     * The offset specifies the left edge of the crop rectangle relative to the left edge of the original bounding rectangle, relative to the original width of the object.
     */
    leftOffset?: number | null;

    /**
     * The offset specifies the right edge of the crop rectangle to the left of the right edge of the original bounding rectangle, relative to the original width of the object.
     */
    rightOffset?: number | null;

    /**
     * The offset specifies the top edge of the clipping rectangle below the top edge of the original bounding rectangle, relative to the object's original height.
     */
    topOffset?: number | null;

    /**
     * The offset specifies where the bottom edge of the crop rectangle is positioned above the bottom edge of the original bounding rectangle, relative to the object's original height.
     */
    bottomOffset?: number | null;

    /**
     * The rotation angle (in radians) of the crop window relative to the center. The rotation angle is applied after the offset.
     */
    angle?: number | null;
  }

  /**
   * @title Color Reset
   *
   * Color reset effect applied to the image.
   */
  export interface Recolor {
    /**
     * @title Recolor effect
     *
     * Represented as a gradient, a list of color stops.
     */
    recolorStops?: ColorStop[];

    /**
     * @title The name of the color change effect
     */
    readonly name?: Name | null;
  }

  /**
   * @title Color effect name
   */
  export type Name =
    | tags.Constant<
        "NONE",
        { title: "색상 재지정 효과가 없습니다. 기본값입니다." }
      >
    | tags.Constant<
        "LIGHT1",
        {
          title: "페이지의 색 구성표에서 사용 가능한 첫 번째 색상을 사용하여 이미지를 밝게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT2",
        {
          title: "페이지에서 사용할 수 있는 두 번째 색상을 색 구성표를 사용하여 밝게 하는 재지정 색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT3",
        {
          title: "페이지에서 사용할 수 있는 세 번째 색상을 색 구성표를 사용하여 밝게 하는 재지정 색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT4",
        {
          title: "페이지의 색 구성표에서 사용 가능한 색상을 사용하여 이미지를 밝게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT5",
        {
          title: "페이지에서 사용할 수 있는 5번째 색상을 해당하는 색 구성표로 밝게 만드는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT6",
        {
          title: "페이지의 색 구성표에서 사용 가능한 여섯 번째 색상을 사용하여 이미지를 밝게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT7",
        {
          title: "페이지의 색 구성표에서 사용 가능한 일곱 번째 색상을 사용하여 이미지를 밝게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT8",
        {
          title: "페이지에서 8번째 사용 가능한 색상을 사용해 이미지를 밝게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT9",
        {
          title: "페이지의 9번째 사용 가능한 색상을 사용하여 이미지의 밝기를 높일 수 있는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "LIGHT10",
        {
          title: "페이지의 색 구성표에서 사용 가능한 10의 색상을 사용하여 이미지를 밝게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK1",
        {
          title: "페이지의 색 구성표에서 사용 가능한 첫 번째 색상을 사용하여 이미지를 어둡게 하는 재지정 색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK2",
        {
          title: "페이지의 두 번째 색상 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK3",
        {
          title: "페이지에서 사용할 수 있는 세 번째 색상을 색 구성표를 사용하여 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK4",
        {
          title: "페이지의 네 번째 색 구성표에서 사용 가능한 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK5",
        {
          title: "페이지의 5번째 사용 가능한 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK6",
        {
          title: "페이지에서 사용할 수 있는 6번째 색 구성표 색상을 사용해 이미지를 어둡게 하는 색 재조정 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK7",
        {
          title: "페이지의 색 구성표에서 사용 가능한 7번째 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK8",
        {
          title: "페이지의 색 구성표에서 사용 가능한 8번째 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK9",
        {
          title: "페이지의 9번째 사용 가능한 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "DARK10",
        {
          title: "색 구성표에서 사용 가능한 10의 색상을 사용하여 이미지를 어둡게 하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "GRAYSCALE",
        { title: "이미지 색상을 그레이 스케일로 변경하는 재색상 색상 효과." }
      >
    | tags.Constant<
        "NEGATIVE",
        { title: "이미지를 음영 그레이 스케일로 다시 칠하는 색상 재지정 효과." }
      >
    | tags.Constant<
        "SEPIA",
        {
          title: "세피아 색상을 사용하여 이미지 색상을 변경하는 재색상 효과입니다.";
        }
      >
    | tags.Constant<
        "CUSTOM",
        { title: "맞춤 색상 효과. 구체적인 경사는 recolorStops를 참고하세요." }
      >;

  export interface ColorStop {
    /**
     * @title Color of gradient color
     */
    color?: OpaqueColor;

    /**
     * @title The alpha value of this color in the gradient band
     *
     * The default is 1.0, which is fully opaque.
     */
    alpha?:
      | (number &
          tags.Type<"int32"> &
          tags.Maximum<1> &
          tags.Minimum<0> &
          tags.Default<0>)
      | null;

    /**
     * The relative position of the color stop within the gradient band, measured as a percentage. This value must be entered in the interval [0.0, 1.0].
     */
    position?: number | null;
  }

  // export interface Video {}

  /**
   * @title A type of PageElement that represents non-connector lines, straight connectors, bent connectors, bent connectors, etc
   */
  export interface Line {
    /**
     * @title is a line property
     */
    lineProperties?: LineProperties;

    /**
     * @title Type of line
     */
    lineType?: LineType | null;

    /**
     * @title Category of good
     */
    lineCategory?: LineCategory | null;
  }

  export type LineCategory =
    | tags.Constant<
        `LINE_CATEGORY_UNSPECIFIED`,
        { title: `지정되지 않은 선 카테고리입니다.` }
      >
    | tags.Constant<`STRAIGHT`, { title: `직선 커넥터(직선 커넥터 1 포함)` }>
    | tags.Constant<
        `BENT`,
        { title: `구부러진 커넥터(2-5 구부러진 커넥터 포함)` }
      >
    | tags.Constant<
        `CURVED`,
        { title: `곡선 커넥터 2~5를 포함한 곡선 커넥터` }
      >;

  export type LineType =
    | tags.Constant<
        `TYPE_UNSPECIFIED`,
        { title: `지정되지 않은 선 유형입니다.` }
      >
    | tags.Constant<
        `STRAIGHT_CONNECTOR_1`,
        {
          title: `직선 커넥터 1 양식 ECMA-376 ST_ShapeType 'straightConnector1'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `BENT_CONNECTOR_2`,
        {
          title: `커넥터 2 양식 구부러짐 ECMA-376 ST_ShapeType 'bentConnector2'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `BENT_CONNECTOR_3`,
        {
          title: `커넥터 3이 구부러짐 ECMA-376 ST_ShapeType 'bentConnector3'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `BENT_CONNECTOR_4`,
        {
          title: `커넥터 4 양식 구부러짐 ECMA-376 ST_ShapeType 'bentConnector4'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `BENT_CONNECTOR_5`,
        {
          title: `커넥터 5 양식 굽힘 ECMA-376 ST_ShapeType 'bentConnector5'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `CURVED_CONNECTOR_2`,
        {
          title: `곡선 커넥터 2 양식 ECMA-376 ST_ShapeType 'curvedConnector2'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `CURVED_CONNECTOR_3`,
        {
          title: `구부러진 커넥터 3 양식 ECMA-376 ST_ShapeType 'curvedConnector3'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `CURVED_CONNECTOR_4`,
        {
          title: `구부러진 커넥터 4 양식 ECMA-376 ST_ShapeType 'curvedConnector4'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `CURVED_CONNECTOR_5`,
        {
          title: `구부러진 커넥터 5 양식 ECMA-376 ST_ShapeType 'curvedConnector5'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `STRAIGHT_LINE`,
        {
          title: `직선 ECMA-376 ST_ShapeType 'line'에 해당합니다. 이 선 유형은 커넥터가 아닙니다.`;
        }
      >;

  export interface LineProperties {
    /**
     * @title Filling the line
     */
    lineFill?: LineFill;

    /**
     * @title Line thickness
     */
    weight?: Dimension;

    /**
     * @title dashed line style
     */
    dashStyle?: DashStyle | null;

    /**
     * @title Arrow style at the beginning of the line
     */
    startArrow?: ArrowStyle | null;

    /**
     * @title Arrow style at the end of the line
     */
    endArrow?: ArrowStyle | null;

    /**
     * @title The hyperlink target of the line
     */
    link?: Link;

    /**
     * @title A connection at the beginning of a line
     *
     * Only exists for connector types.
     */
    startConnection?: LineConnection;

    /**
     * @title A connection at the end of a line
     *
     * Only present in connector type.
     */
    endConnection?: LineConnection;
  }

  export interface LineConnection {
    /**
     * @title The object ID of the linked page element
     */
    connectedObjectId?: string | null;

    /**
     * @title The index of the linked site in the linked page element
     */
    connectionSiteIndex?: (number & tags.Type<"int64">) | null;
  }

  export type ArrowStyle =
    | tags.Constant<
        `ARROW_STYLE_UNSPECIFIED`,
        { title: `지정되지 않은 화살표 스타일` }
      >
    | tags.Constant<`NONE`, { title: `화살표가 없습니다.` }>
    | tags.Constant<
        `STEALTH_ARROW`,
        {
          title: `뒤로 노치가 있는 화살표 ECMA-376 ST_LineEndType 값 'stealth'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `FILL_ARROW`,
        {
          title: `채워진 화살표 ECMA-376 ST_LineEndType 값 'triangle'에 해당합니다.`;
        }
      >
    | tags.Constant<
        `FILL_CIRCLE`,
        { title: `채워진 원 ECMA-376 ST_LineEndType 값 'oval'에 해당합니다.` }
      >
    | tags.Constant<`FILL_SQUARE`, { title: `채워진 정사각형입니다.` }>
    | tags.Constant<
        `FILL_DIAMOND`,
        {
          title: `다이아몬드가 채워졌습니다. ECMA-376 ST_LineEndType 값 'diamond'에 해당합니다.`;
        }
      >
    | tags.Constant<`OPEN_ARROW`, { title: `흰색 화살표` }>
    | tags.Constant<`OPEN_CIRCLE`, { title: `흰색 원` }>
    | tags.Constant<`OPEN_SQUARE`, { title: `흰색 정사각형` }>
    | tags.Constant<`OPEN_DIAMOND`, { title: `흰색 다이아몬드입니다.` }>;

  export type DashStyle =
    | tags.Constant<
        "DASH_STYLE_UNSPECIFIED",
        { title: `지정되지 않은 대시 스타일` }
      >
    | tags.Constant<
        "SOLID",
        {
          title: `실선 ECMA-376 ST_PresetLineDashVal 값 'solid'에 해당합니다. 기본 대시 스타일입니다.`;
        }
      >
    | tags.Constant<
        "DOT",
        { title: `점선 ECMA-376 ST_PresetLineDashVal 값 'dot'에 해당합니다.` }
      >
    | tags.Constant<
        "DASH",
        {
          title: `파선입니다. ECMA-376 ST_PresetLineDashVal 값 'dash'에 해당합니다.`;
        }
      >
    | tags.Constant<
        "DASH_DOT",
        {
          title: `교점 및 대시를 사용합니다. ECMA-376 ST_PresetLineDashVal 값 'dashDot'에 해당합니다.`;
        }
      >
    | tags.Constant<
        "LONG_DASH",
        {
          title: `큰 대시가 있는 선 ECMA-376 ST_PresetLineDashVal 값 'lgDash'에 해당합니다.`;
        }
      >
    | tags.Constant<
        "LONG_DASH_DOT",
        {
          title: `큰 대시와 점을 번갈아 사용합니다. ECMA-376 ST_PresetLineDashVal 값 'lgDashDot'에 해당합니다.`;
        }
      >;

  export interface LineFill {
    /**
     * @title Solid Fill
     *
     * The default line fill matches the default for new lines created in the Slides editor.
     */
    solidFill?: SolidFill;
  }

  // export interface Table {}

  // export interface WordArt {}

  /**
   * @title Transformation of the page element
   */
  export interface Transform {
    /**
     * @title X-coordinate scale factor
     */
    scaleX?: number | null;

    /**
     * @title Y coordinate scale factor
     */
    scaleY?: number | null;

    /**
     * @title X-coordinate slope component
     */
    shearX?: number | null;

    /**
     * @title Y coordinate slope component
     */
    shearY?: number | null;

    /**
     * @title X coordinate transformation element
     */
    translateX?: number | null;

    /**
     * @title Y coordinate transformation factor
     */
    translateY?: number | null;

    /**
     * @title Units of conversion factor
     */
    unit?: Unit | null;
  }
}
