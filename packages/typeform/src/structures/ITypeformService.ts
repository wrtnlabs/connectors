export namespace ITypeformService {
  export interface IProps {
    /**
     * Typeform Client ID
     */
    clientId: string;

    /**
     * Typeform Client Secret
     */
    clientSecret: string;

    /**
     * Typeform Refresh Token.
     */
    secret: string;
  }

  export interface IGetFieldForUpdateFieldValueInput {
    /**
     * The id of the field whose value you want to update.
     *
     * @title field id
     */
    formId: string;
  }

  export interface ICreateWorkspaceInput {
    /**
     * The name of the workspace to be created.
     *
     * @title Workspace name
     */
    name: string;
  }

  export interface ICreateWorkspaceOutput {
    /**
     * The generated workspace id.
     *
     * @title Workspace id
     */
    id: string;

    /**
     * The name of the generated workspace.
     *
     * @title Workspace name
     */
    name: string;

    /**
     * Here is the generated workspace link.
     *
     * @title Workspace Link
     */
    link: string;
  }
  export interface IFindWorkspaceOutput {
    /**
     * The id of the workspace that was read.
     *
     * @title Workspace id
     */
    workspace_id: string;

    /**
     * The name of the workspace you're reading from.
     *
     * @title Workspace name
     */
    name: string;

    /**
     * Here is a link to the workspace you've read.
     *
     * @title Workspace Link
     */
    link: string;
  }

  export interface ICreateEmptyFormInput {
    /**
     * The title of the form to be created.
     *
     * @title Form title
     */
    name: string;
  }

  export interface ICreateFormOutput {
    /**
     * The id of the generated form.
     *
     * @title form id
     */
    id: string;

    /**
     * The name of the generated form.
     *
     * @title Form name
     */
    name: string;

    /**
     * The type of the generated form.
     *
     * @title Form Type
     */
    type: string;
  }
  export interface IFindFormOutput {
    /**
     * The id of the form being read.
     *
     * @title form id
     */
    formId: string;

    /**
     * The name of the form being read.
     *
     * @title Form name
     */
    name: string;
  }

  export interface IDuplicateExistingFormInput {
    /**
     * The form to update the values.
     *
     * @title form
     */
    formId: string;

    /**
     * The workspace link to duplicate the form.
     *
     * @title Workspace Link
     */
    workspaceLink: string;

    /**
     * The name of the form to be cloned and created.
     *
     * @title Form name
     */
    name: string;
  }

  export interface IFieldInfoForUpdateFieldValueOutput {
    /**
     * Field to update value
     *
     * @title field
     */
    id: string;

    /**
     * The name of the field whose value is to be updated.
     *
     * @title Field name
     */
    name: string;
  }

  export interface IUpdateFormFieldValueInput {
    /**
     * The form to update the values.
     *
     * @title form
     */
    formId: string;

    /**
     * The field whose value is to be updated.
     *
     * @title The field whose value is to be updated
     */
    fieldId: string;

    /**
     * The value of the field to update.
     *
     * @title field value
     */
    value: string[];
  }

  export interface IUpdateFormFieldValueOutput extends IFindFormOutput {
    /**
     * Information about the field whose value has been updated.
     *
     * @title Information about the field whose value has been updated
     */
    fields: IFieldInformation[];
  }

  export interface IFieldInformation
    extends IFieldInfoForUpdateFieldValueOutput {
    /**
     * The value of the updated field.
     *
     * @title field value
     */
    value: string;
  }

  export interface IFormFieldOutput {
    /**
     * The id of the field in the form.
     *
     * The id of the `@title` field.
     */
    id: string;

    /**
     * The title of the field in the form.
     *
     * @title The title of the field
     */
    title: string;

    /**
     * An alias for a field in a form.
     *
     * @title Field alias
     */
    ref: string;

    /**
     * Field property information.
     *
     * @title Field property
     */
    properties: IFieldProperties;

    /**
     * Validation information for the field.
     *
     * @title Validation for the field
     */
    validations: {
      /**
       * Whether the field is required.
       *
       * @title Whether the field is required
       */
      required: boolean;
    };

    /**
     * The type of the field.
     * ex) text, choice ...
     *
     * @title The type of the field
     */
    type: string;
  }

  interface IFieldProperties {
    /**
     * Description of the field.
     *
     * @title Field description
     */
    description: string;

    /**
     * Whether to randomly place the choices.
     *
     * @title Whether to randomly place the choices
     */
    randomize: boolean;

    /**
     * Whether to allow multiple selections.
     *
     * @title Whether to allow multiple selections
     */
    allow_multiple_selection: boolean;

    /**
     * Here is the selection information.
     *
     * @title Selection
     */
    choices: IChoice[];
  }

  export interface IChoice {
    /**
     * The unique id of the choice.
     *
     * @title Unique id of the choice
     */
    id: string;

    /**
     * An alias for the choice.
     *
     * @title Choice alias
     */
    ref: string;

    /**
     * The label of the choice.
     *
     * @title Choice Label
     */
    label: string;
  }
  export interface IFormOutput {
    /**
     * The form's id.
     *
     * @title form id
     */
    id: string;

    /**
     * The type of the form.
     *
     * @title Form type
     */
    type: string;

    /**
     * The title of the form.
     *
     * @title The form title
     */
    title: string;

    /**
     * Information about the workspace the form belongs to.
     *
     * @title Information about the workspace the form belongs to
     */
    workspace: {
      /**
       * This is a workspace hyperlink.
       *
       * @title Workspace Link
       */
      href: string;
    };

    /**
     * Theme information for the form.
     *
     * @title Theme information
     */
    theme: {
      /**
       * This is the theme hyperlink for the form.
       *
       * @title Theme Link
       */
      href: string;
    };

    /**
     * This is the form settings information.
     *
     * @title Form settings information
     */
    settings: ISettings;

    /**
     * This is the information on the thank you message screen that is shown to the user after completing the form.
     *
     * @title This is the information on the thank you message screen that is shown after completing the form
     */
    thankyou_screens: IThankyouScreens[];

    /**
     * This is the field information of the form.
     *
     * @title Form field information
     */
    fields: IFormFieldOutput[];

    /**
     * The creation date of the form.
     *
     * @title The creation date of the form
     */
    created_at: string;

    /**
     * The last update date of the form.
     *
     * @title The last update date of the form
     */
    last_updated_at: string;

    /**
     * The date the form was released.
     *
     * @title The date the form was released
     */
    published_at: string;

    /**
     * Provides a hyperlink related to the resource.
     *
     * @title Provides a hyperlink related to the resource
     */
    _links: {
      /**
       * It is mainly used for the purpose of showing or sharing the form to the user after the form has been completed.
       *
       * @title The URL that takes the user to the web page where the form can be filled out
       */
      display: string;

      /**
       * This link can be used to collect or analyze responses from users who have filled out a form.
       *
       * @title URL of the API endpoint where responses to the form can be retrieved
       */
      responses: string;
    };
  }

  interface ISettings {
    /**
     * The language of the form.
     * ex) ko: Korean.
     *
     * @title The language of the form
     */
    language: string;

    /**
     * Sets the display method of the progress bar.
     * ex) percentage: percentage.
     *
     * @title The display method of the progress bar
     */
    progress_bar: string;

    /**
     * Set additional settings.
     *
     * @title Additional settings
     */
    meta: {
      /**
       * Whether to allow indexing by search engines.
       *
       * @title Whether to allow indexing by search engines
       */
      allow_indexing: boolean;
    };

    /**
     * Whether to hide the navigation within the form.
     *
     * @title Whether to hide the navigation within the form
     */
    hide_navigation: boolean;

    /**
     * Whether the form is public or not.
     *
     * @title Whether the form is public or not
     */
    is_public: boolean;

    /**
     * Whether the form is a trial version.
     *
     * @title Whether the form is a trial version
     */
    is_trial: boolean;

    /**
     * Whether to display the progress bar.
     *
     * @title Whether to display the progress bar
     */
    show_progress_bar: boolean;

    /**
     * Whether to display Typeform's branding.
     *
     * @title Whether to display Typeform's branding
     */
    show_typeform_branding: boolean;

    /**
     * Whether the file upload is publicly accessible.
     *
     * @title Whether the file upload is publicly accessible
     */
    are_uploads_public: boolean;

    /**
     * Whether to display the estimated time for form completion.
     *
     * @title Whether to display the estimated time for form completion
     */
    show_time_to_complete: boolean;

    /**
     * Whether to display the number of form submissions.
     *
     * @title Whether to display the number of form submissions
     */
    show_number_of_submissions: boolean;

    /**
     * Whether to display cookie consent.
     *
     * @title Whether to display cookie consent
     */
    show_cookie_consent: boolean;

    /**
     * Whether to display question numbers.
     *
     * @title Whether to display question numbers
     */
    show_question_number: boolean;

    /**
     * Whether to show hints for selection keyboard shortcuts.
     *
     * @title Whether to show hints for selection keyboard shortcuts
     */
    show_key_hint_on_choices: boolean;

    /**
     * Whether to automatically save progress.
     *
     * @title Whether to automatically save progress
     */
    autosave_progress: boolean;

    /**
     * Whether or not you can move freely within the form.
     *
     * @title Whether or not you can move freely within the form
     */
    free_form_navigation: boolean;

    /**
     * Whether to use lead qualification.
     *
     * @title Whether to use lead qualification
     */
    use_lead_qualification: boolean;

    /**
     * Whether subdomains are possible.
     *
     * @title Whether subdomains are possible
     */
    pro_subdomain_enabled: boolean;

    /**
     * Additional feature settings.
     *
     * @title Additional feature settings
     */
    capabilities: {
      /**
       * Whether the form is encrypted from the beginning to the end.
       *
       * @title Whether the form is encrypted from the beginning to the end
       */
      e2e_encryption: {
        /**
         * Whether encryption is enabled.
         *
         * @title Whether encryption is enabled
         */
        enabled: boolean;

        /**
         * Whether encryption settings can be changed.
         *
         * @title Whether encryption settings can be changed
         */
        modifiable: boolean;
      };
    };
  }
  interface IThankyouScreens {
    /**
     * The ID of the thank you message screen.
     *
     * @title The ID of the thank you message screen
     */
    id: string;

    /**
     * Alias for the thank you message screen.
     *
     * @title Alias for the thank you message screen
     */
    ref: string;

    /**
     * The title of the thank you message screen.
     *
     * @title The title of the thank you message screen
     */
    name: string;

    /**
     * The type of the thank you message screen.
     *
     * @title The type of the thank you message screen
     */
    type: string;

    /**
     * The properties of the thank you message screen.
     *
     * @title The properties of the thank you message screen
     */
    properties: {
      /**
       * Whether to show the button.
       *
       * @title Whether to show the button
       */
      show_button: boolean;

      /**
       * Whether to display the share icon.
       *
       * @title Whether to display the share icon
       */
      share_icons: boolean;

      /**
       * This is button mode.
       *
       * @title Button Mode
       */
      button_mode: string;

      /**
       * This is the button text.
       *
       * @title Button Text
       */
      button_text: string;
    };

    /**
     * Here is the attached file information.
     *
     * @title Attached file information
     */
    attachment: {
      /**
       * The type of the attachment.
       *
       * @title Attachment type
       */
      type: string;

      /**
       * Hyperlink to the attached file.
       *
       * @title Hyperlink to the attached file
       */
      href: string;
    };
  }
}
