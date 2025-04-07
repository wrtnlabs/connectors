import {
  GoogleDocsService,
  IGoogleDocsService,
} from "@wrtnlabs/connector-google-docs";
import { TestGlobal } from "../TestGlobal";
import typia from "typia";

export const test_google_docs = async () => {
  const googleDocsService = new GoogleDocsService({
    googleClientId: TestGlobal.env.GOOGLE_CLIENT_ID,
    googleClientSecret: TestGlobal.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: TestGlobal.env.GOOGLE_TEST_SECRET,
  });
  /**
   * create a new Google Docs.
   */
  const createGoogleDocsOutput = await googleDocsService.createDocs({
    title: "connector_test",
  });

  typia.assert<IGoogleDocsService.ICreateGoogleDocsOutput>(
    createGoogleDocsOutput,
  );

  const docId = createGoogleDocsOutput.id;
  /**
   * Permission Google Docs
   */
  const permissionGoogleDocsOutput = await googleDocsService.permission({
    documentId: docId,
    permissions: [
      {
        email: "jake@wrtn.io",
        role: "writer",
        type: "user",
      },
    ],
  });

  typia.assert(permissionGoogleDocsOutput);

  /**
   * Append text to docs
   */
  const appendTextToDocsOutput = await googleDocsService.append({
    documentId: docId,
    text: "Hello World",
  });

  typia.assert(appendTextToDocsOutput);

  /**
   * Read docs contents
   */
  const readDocsOutput = await googleDocsService.readDocs({ id: docId });

  typia.assert<"Hello World\n">(readDocsOutput.data.text);
  typia.assert<IGoogleDocsService.IReadGoogleDocsOutput>(readDocsOutput);

  /**
   * Create docs by template
   */
  const createDocByTemplateOutput = await googleDocsService.createDocByTemplate(
    { title: "connector_test_2", templateId: docId },
  );

  typia.assert<IGoogleDocsService.ICreateDocByTemplateOutput>(
    createDocByTemplateOutput,
  );

  /**
   * Read docs list
   */
  const readDocsListOutput = await googleDocsService.list();

  typia.assert<IGoogleDocsService.IListGoogleDocsOutput>(readDocsListOutput);

  /**
   * Delete docs
   */
  const ids = [docId, createDocByTemplateOutput.id];
  for (const id of ids) {
    const res = await googleDocsService.deleteById({ id });

    typia.assert(res);
  }
};
