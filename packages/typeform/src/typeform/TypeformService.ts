import axios from "axios";
import qs from "qs";
import typia from "typia";
import { ITypeformService } from "../structures/ITypeformService";

export class TypeformService {
  constructor(private readonly props: ITypeformService.IProps) {}

  /**
   * Typeform Service.
   *
   * Create a workspace
   */
  async createWorkspace(
    input: ITypeformService.ICreateWorkspaceInput,
  ): Promise<ITypeformService.ICreateWorkspaceOutput> {
    try {
      const accessToken = await this.refresh();
      const res = await axios.post(
        "https://api.typeform.com/workspaces",
        {
          name: input.name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const workspace = res.data;
      const createdResult: ITypeformService.ICreateWorkspaceOutput = {
        id: workspace.id,
        name: workspace.name,
        link: workspace.self.href,
      };
      return createdResult;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Get workspace information
   */
  async getWorkspaces(): Promise<ITypeformService.IFindWorkspaceOutput[]> {
    try {
      const accessToken = await this.refresh();
      const res = await axios.get("https://api.typeform.com/workspaces", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const workspaceList = res.data.items;
      const workspaceListInfo: ITypeformService.IFindWorkspaceOutput[] = [];

      for (const workspace of workspaceList) {
        const workspaceInfo: ITypeformService.IFindWorkspaceOutput = {
          workspace_id: workspace.id,
          name: workspace.name,
          link: workspace.self.href,
        };
        workspaceListInfo.push(workspaceInfo);
      }

      return workspaceListInfo;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Create an empty form in the workspace
   */
  async createEmptyForm(
    input: ITypeformService.ICreateEmptyFormInput,
  ): Promise<ITypeformService.ICreateFormOutput> {
    try {
      const accessToken = await this.refresh();
      const res = await axios.post(
        "https://api.typeform.com/forms",
        {
          title: input.name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = res.data;

      const createEmptyFormResult: ITypeformService.ICreateFormOutput = {
        id: result.id,
        name: result.title,
        type: result.type,
      };
      return createEmptyFormResult;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Get a list of forms that exist in the workspace
   */
  async getForms(): Promise<ITypeformService.IFindFormOutput[]> {
    try {
      const accessToken = await this.refresh();
      const res = await axios.get("https://api.typeform.com/forms", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const formList = res.data.items;

      const formListInfo: ITypeformService.IFindFormOutput[] = [];
      for (const form of formList) {
        const formInfo: ITypeformService.IFindFormOutput = {
          formId: form.id,
          name: form.title,
        };
        formListInfo.push(formInfo);
      }
      return formListInfo;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Copy a form that exists in the workspace
   */
  async duplicateExistingForm(
    input: ITypeformService.IDuplicateExistingFormInput,
  ): Promise<ITypeformService.ICreateFormOutput> {
    try {
      const existingFormInfo = await this.getFormInfo(input.formId);
      if (!existingFormInfo) {
        throw new Error("Cannot find form");
      }
      const { settings, fields } = existingFormInfo;

      // 새로운 타입 정의 (id가 없는 필드)
      type FormFieldWithoutId = Omit<ITypeformService.IFormFieldOutput, "id">;

      /**
       * id 필드 제거해야 함.
       * https://www.typeform.com/developers/create/walkthroughs/
       * Duplicates an existing form 참고
       */
      let fieldsWithoutId;
      if (fields && fields.length > 0) {
        fieldsWithoutId = typia.misc.assertClone<FormFieldWithoutId[]>(fields);
      }
      // if (fields && fields.length > 0) {
      //   // fieldsWithoutId = fields.map(
      //   //   ({ id, ...field }: ITypeformService.IFormFieldOutput) => {
      //   //     const choices =
      //   //       field.properties.choices?.map(
      //   //         ({ id, ...choice }: ITypeformService.IChoice) => choice,
      //   //       ) || [];
      //   //     return {
      //   //       ...field,
      //   //       properties: {
      //   //         ...field.properties,
      //   //         choices,
      //   //       },
      //   //     };
      //   //   },
      //   // );
      // }

      const accessToken = await this.refresh();
      const res = await axios.post(
        "https://api.typeform.com/forms",
        {
          workspace: {
            href: input.workspaceLink,
          },
          title: input.name,
          settings: settings,
          fields: fieldsWithoutId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const result = res.data;
      const duplicatedFormInfo: ITypeformService.ICreateFormOutput = {
        id: result.id,
        name: result.title,
        type: result.type,
      };

      return duplicatedFormInfo;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Get the field information of the form to update the options of the ranking, dropdown, and multiple choice questions
   */
  async getFieldsForUpdateFieldValue(
    input: ITypeformService.IGetFieldForUpdateFieldValueInput,
  ): Promise<ITypeformService.IFieldInfoForUpdateFieldValueOutput[]> {
    try {
      const formInfo = await this.getFormInfo(input.formId);
      const fields: ITypeformService.IFormFieldOutput[] = formInfo.fields || [];

      /**
       * 랭킹, 드롭다운, 다중선택 필드만 제공
       */
      const filteredFields = fields.filter(
        (field: ITypeformService.IFormFieldOutput) =>
          field.type === "ranking" ||
          field.type === "dropdown" ||
          field.type === "multiple_choice",
      );
      const fieldInfoList: ITypeformService.IFieldInfoForUpdateFieldValueOutput[] =
        [];

      for (const field of filteredFields) {
        const fieldInfo = {
          id: field.id,
          name: `${field.title}(${field.type})`,
        };
        fieldInfoList.push(fieldInfo);
      }

      return fieldInfoList;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Updates options for ranking, dropdown, and multiple choice questions
   */
  async updateFormFieldValue(
    input: ITypeformService.IUpdateFormFieldValueInput,
  ): Promise<ITypeformService.IUpdateFormFieldValueOutput> {
    try {
      const formInfo = await this.getFormInfo(input.formId);
      const updatedFormInfo = this.updateFormInfo(formInfo, input);
      const updatedForm = await this.updateForm(input.formId, updatedFormInfo);
      const fieldInfoList = this.getFieldInfoList(updatedForm.fields);

      const updatedFieldResult: ITypeformService.IUpdateFormFieldValueOutput = {
        formId: updatedForm.id,
        name: updatedForm.title,
        fields: fieldInfoList,
      };

      return updatedFieldResult;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Delete a workspace
   */
  async deleteWorkspace(input: { workspaceId: string }): Promise<void> {
    try {
      const accessToken = await this.refresh();
      await axios.delete(
        `https://api.typeform.com/workspaces/${input.workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  /**
   * Typeform Service.
   *
   * Delete a form
   */
  async deleteForm(input: { formId: string }): Promise<void> {
    try {
      const accessToken = await this.refresh();
      await axios.delete(`https://api.typeform.com/forms/${input.formId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async getFormInfo(
    formId?: string,
  ): Promise<ITypeformService.IFormOutput> {
    try {
      const accessToken = await this.refresh();
      const formInfo = await axios.get(
        `https://api.typeform.com/forms/${formId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return formInfo.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private async updateForm(
    formId: string,
    updatedFormInfo: any,
  ): Promise<ITypeformService.IFormOutput> {
    try {
      const accessToken = await this.refresh();
      const res = await axios.put(
        `https://api.typeform.com/forms/${formId}`,
        updatedFormInfo,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return res.data;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }

  private updateFormInfo(
    formInfo: ITypeformService.IFormOutput,
    input: ITypeformService.IUpdateFormFieldValueInput,
  ) {
    return {
      ...formInfo,
      fields: formInfo.fields.map(
        (field: ITypeformService.IFormFieldOutput) => {
          if (field.id !== input.fieldId) return field;
          const updatedChoices = input.value.map((value: string) => ({
            label: value,
          }));
          return {
            ...field,
            properties: {
              ...field.properties,
              choices: updatedChoices,
            },
          };
        },
      ),
    };
  }

  private getFieldInfoList(updatedFields: ITypeformService.IFormFieldOutput[]) {
    const fieldInfoList: ITypeformService.IFieldInformation[] = [];
    for (const field of updatedFields) {
      const labels: string[] = field.properties.choices.map(
        (choice: ITypeformService.IChoice) => choice.label,
      );
      for (const label of labels) {
        const fieldInfo = {
          id: field.id,
          name: field.title,
          value: label,
        };
        fieldInfoList.push(fieldInfo);
      }
    }
    return fieldInfoList;
  }

  private async refresh(): Promise<string> {
    try {
      const res = await axios.post(
        "https://api.typeform.com/oauth/token",
        qs.stringify({
          grant_type: "refresh_token",
          refresh_token: this.props.secret,
          client_id: this.props.clientId,
          client_secret: this.props.clientSecret,
          scope:
            "accounts:read forms:read forms:write images:read images:write responses:read responses:write themes:read themes:write workspaces:read workspaces:write",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      /**
       * Refresh Token이 일회용이므로 값 업데이트
       */
      this.props.secret = res.data.refresh_token;

      /**
       * 테스트 환경에서만 사용
       */
      // if (process.env.NODE_ENV === "test") {
      //   await ConnectorGlobal.write({
      //     TYPEFORM_TEST_SECRET: res.data.refresh_token,
      //   });
      // }

      return res.data.access_token;
    } catch (err) {
      console.error(JSON.stringify(err));
      throw err;
    }
  }
}
