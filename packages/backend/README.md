# Connector API Functions

## 1. Outline
- `@todo` In the future, when the service is released, it should be rewritten in English.
- `@todo` Detailed technical documentation is needed for the contents covered in the outline.

Connector Backend Server.

- Provides functions and metadata for Studio.
- Studio is a visual compiler-based service.
- Workflow is a document of visual components.

"Wrtn Technologies" has a service called "Studio," which is a visual compiler-based service combined with LLM (Large Language Model). The visual component documents that can be created in this "Studio" are called "Workflows," and "Studio" can compile these "Workflow documents" into executable programs.

The function nodes that can be used in "Workflows" are mostly derived from this connector backend server. Functions like "Send Email" or "Summarize Paper" that can be placed in "Workflows" are the most representative examples of functions provided by this connector server.

Additionally, the visual compiler system of "Studio" defines and manages the metadata of each function and data that make up the "Workflow" in OpenAPI v3.1 (formerly Swagger) specifications. Therefore, this connector serves as a provider of functions to "Studio" and also plays a role in building Swagger documents to deliver their metadata specifications.

## 2. Setup
### 2.1. NodeJS
https://nodejs.org/en/

Install NodeJS v20 or higher.

### 2.2. Backend Server
```bash
git clone https://github.com/wrtnio/connectors
cd connectors
git update-index --assume-unchanged .env

npm install
npm run build
npm run test
```

The connector server can be installed with the above `git clone` command. Then move to the corresponding folder and execute the `git update-index --assume-unchanged .env` command. This command means that any changes to the `.env` file will not be committed in the future.

Next, open the [.env](./.env) file and fill in each item. Items to be set in the [.env](./.env) file include OpenAI or AWS S3 authentication keys, and local settings should be set at the discretion of developers by obtaining API authentication keys from each service. Note that the environment variable values used in Github Actions or actual services are separate.

Finally, by executing `npm run build` and `npm run test`, you can determine whether the connector server is operating normally.

### 2.3. Swagger Documents
```bash
# Build Swagger documents only
npm run build:swagger

# View Swagger documents with Swagger-UI after building
npm run start:swagger

# Run Swagger-UI without building Swagger documents
npm run start:swagger -- --skipBuild
```

By executing the above commands, you can build Swagger (OpenAPI v3.1) documents and view them with `swagger-ui`.

The purpose of this project is to develop connector functions and build them into OpenAPI spec documents for use in Wrtn's visual compiler, so it is essential to achieve a high level of API design and documentation (comments) and to utilize/verify them with Swagger documents at all times.

## 3. Development
Guidelines on how to develop the connector server. For more detailed information, refer to [CONTRIBUTING.md], but here we will cover conceptual explanations.

1. Define the metadata of API functions and DTOs first.
2. Build it into a client SDK library.
3. Write e2e test functions using the SDK library.
   - Verify the normal operation of each API at the individual API level.
   - Write by combining API functions based on use case scenarios.
4. Develop the main program and verify it with the previous test program.

### 3.1. Definition
> Define API operation and DTO structures

When developing the connector server, the first thing to do is to define interfaces such as API functions and DTO structures. And by interface definition here, it means only defining the metadata of controller methods and DTOs, not completing the main program.

In the example code below, it is a controller that embodies an API for registering and viewing posts on a bulletin board. As you can see, only the interfaces of DTO types and controller methods are defined, and each controller method is empty, and there is no service provider.

In addition, for each API function (controller method) and DTO type and attributes, sufficient explanations should be written as comments. The titles and descriptions written in the API metadata are provided as a custom function set in the form of Function Call (a custom function set provided to LLM to induce calls) to LLM (Large Language Model), which has a significant impact on the quality of conversations and the level of appropriate function selection that ChatGPT, etc., develops with users.

```ts
@Controller("bbs/articles")
export class BbsArticlesController {
  /**
   * Get an article with detailed info.
   *
   * Open an article with detailed info, increasing reading count.
   *
   * @param section Target section
   * @param id Target articles id
   * @returns Detailed article info
   */
  @core.TypedRoute.Get(":id")
  public at(
    @core.TypedParam("section") section: string,
    @core.TypedParam("id") id: string,
  ): Promise<IBbsArticle> {
    section;
    id;
    return null!;
  }

  /**
   * Create a new article.
   *
   * Create a new article and returns its detailed record info.
   *
   * @param section Target section
   * @param input New article info
   * @returns Newly created article info
   */
  @core.TypedRoute.Post()
  public create(
    @core.TypedParam("section") section: string,
    @core.TypedBody() input: IBbsArticle.ICreate,
  ): Promise<IBbsArticle> {
    section;
    input;
    return null!;
  }
}
```

### 3.2. Software Development Kit
```bash
npm run build:sdk
```

Once the API and DTO interface definitions are complete, run the above command to build the SDK library.

The SDK (Software Development Kit) library here refers to the integration library that `nestia` analyzes at the compiler level and creates for the client to use, based on the controller methods and DTO types you wrote on the connector server.

It is a kind of client-level RPC (Remote Procedure Call) set for the Rest API server.

```ts
/**
 * Get an article with detailed info.
 *
 * Open an article with detailed info, increasing reading count.
 *
 * @param section Target section
 * @param id Target articles id
 * @returns Detailed article info
 *
 * @controller BbsArticlesController.at
 * @path GET /bbs/articles/:section/:id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function at(
  connection: IConnection,
  section: string,
  id: string,
): Promise<at.Output> {
  return !!connection.simulate
    ? at.simulate(connection, section, id)
    : PlainFetcher.fetch(connection, {
        ...at.METADATA,
        path: at.path(section, id),
      });
}
export namespace at {
  export type Output = IBbsArticle;

  export const METADATA = {
    method: "GET",
    path: "/bbs/articles/:section/:id",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (section: string, id: string) =>
    `/bbs/articles/${encodeURIComponent(section ?? "null")}/${encodeURIComponent(id ?? "null")}`;
  export const random = (g?: Partial<typia.IRandomGenerator>): IBbsArticle =>
    typia.random<IBbsArticle>(g);
  export const simulate = (
    connection: IConnection,
    section: string,
    id: string,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(section, id),
      contentType: "application/json",
    });
    assert.param("section")(() => typia.assert(section));
    assert.param("id")(() => typia.assert(id));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}

/**
 * Create a new article.
 *
 * Create a new article and returns its detailed record info.
 *
 * @param section Target section
 * @param input New article info
 * @returns Newly created article info
 *
 * @controller BbsArticlesController.create
 * @path POST /bbs/articles/:section
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  section: string,
  input: IBbsArticle.ICreate,
): Promise<create.Output> {
  return !!connection.simulate
    ? create.simulate(connection, section, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...create.METADATA,
          path: create.path(section),
        },
        input,
      );
}
export namespace create {
  export type Input = IBbsArticle.ICreate;
  export type Output = IBbsArticle;

  export const METADATA = {
    method: "POST",
    path: "/bbs/articles/:section",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (section: string) =>
    `/bbs/articles/${encodeURIComponent(section ?? "null")}`;
  export const random = (g?: Partial<typia.IRandomGenerator>): IBbsArticle =>
    typia.random<IBbsArticle>(g);
  export const simulate = (
    connection: IConnection,
    section: string,
    input: IBbsArticle.ICreate,
  ): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(section),
      contentType: "application/json",
    });
    assert.param("section")(() => typia.assert(section));
    assert.body(() => typia.assert(input));
    return random(
      "object" === typeof connection.simulate && null !== connection.simulate
        ? connection.simulate
        : undefined,
    );
  };
}
```

### 3.3. Test Automation Program
Using the above SDK library, write an e2e test program.

Each test program can be created in the [`test/features/api`](./test/features/api) folder or anywhere. The target function for testing should be marked with the `export` directive and start with the name `test_`, and the parameter should be a variable of type `IConnection` corresponding to the connection information to the connector server. And the code of the test function body should be written in E2E (End to End) format using the SDK library built in the previous section.

Note that the test program you write must be able to verify all APIs existing on the connector server. Conversely, whenever you define each API function in the [3.1. Definition](#31-definition) section, you must build the [3.2. Software Development Kit](#32-software-development-kit) and write e2e functions through it.

In addition to writing test functions for each API function, when adding API functions to this connector server, there is usually a specific purpose. And that specific purpose is generally not to use only one API function, but to combine multiple API functions. 

Therefore, it is also necessary to write a scenario-type e2e test function that assumes a special use case and calls multiple SDK functions in this way. Writing an e2e test program based on use case scenarios is also a necessary process because incorrect API designs become prominently visible.

```ts
import { RandomGenerator, TestValidator } from "@nestia/e2e";
import typia from "typia";
import { v4 } from "uuid";

import CApi from "@wrtn/connector-api/lib/index";
import { IBbsArticle } from "@wrtn/connector-api/lib/structures/bbs/IBbsArticle";

export async function test_api_bbs_article_store(
  connection: CApi.IConnection,
): Promise<void> {
  // STORE A NEW ARTICLE
  const stored: IBbsArticle = await CApi.functional.bbs.articles.create(
    connection,
    "general",
    {
      writer: RandomGenerator.name(),
      title: RandomGenerator.paragraph(3)(),
      body: RandomGenerator.content(8)()(),
      format: "txt",
      files: [
        {
          name: "logo",
          extension: "png",
          url: "https://somewhere.com/logo.png",
        },
      ],
      password: v4(),
    },
  );
  typia.assertEquals(stored);

  // READ THE DATA AGAIN
  const read: IBbsArticle = await CApi.functional.bbs.articles.at(
    connection,
    stored.section,
    stored.id,
  );
  typia.assertEquals(read);
  TestValidator.equals("write and read")(stored)(read);
}
```

### 3.4. Main Program Development
The development of the main program should only proceed after completing all the previous processes ([Interface Definition](#31-definition) -> [SDK Build](#32-software-development-kit) -> [e2e Test Program Writing](#33-test-automation-program)). This is called CDD (Contract Driven Development) or TDD (Test Driven Development), and it is a particularly effective methodology for projects like this connector server.

By defining the interface strictly in advance and preparing a test program for it, you can always ensure the stability of each element being developed. It is very efficient because it eliminates the need to discover design flaws and make breaking changes or manually verify each time by omitting the test program, so be sure to follow this methodology.

If you have completed the development of the elements ([Interface Design](#31-definition) > [Test Program Preparation](#33-test-automation-program) > Main Program), you can check whether each function is working properly by executing the following commands.

```bash
npm run build:sdk
npm run build:test
npm run test
```

And if you run the `npm run dev` command instead of `npm run build:test`, an incremental build (a method of partially compiling only the modified parts each time the program code is modified to always maintain the latest state of the build result) for the test program will be executed. And when you need to run the test program, you can simply run the `npm run test` command in a separate terminal. If you want to run or exclude only specific test functions, you can use the `--include` and `--exclude` options as shown in the command below.

```bash
# Terminal 1
npm run build:sdk
npm run dev

# Terminal 2
npm run test
npm run test -- --include google daum
npm run test -- --exclude rag hwp youtube
npm run test -- --include google naver --exclude drive
```

## 4. Documentation
### 4.1. Concepts
Write `title/summary` and `description` comments faithfully.

The comments written for each DTO type and controller method on the connector server are recorded as the `title` (or `summary`) and `description` attributes of the OpenAPI spec. 

And this is provided as a custom function set in the form of Function Call (a custom function set provided to LLM to induce calls) to LLM (Large Language Model), which has a significant impact on the quality of conversations and the level of appropriate function selection that ChatGPT, etc., develops with users.

Therefore, in addition to the unique spec of the API, comments have a great impact on the quality of the LLM session, so sufficient explanations must be written as comments for each API function (controller method) and DTO type and attributes.

### 4.2. DTO Structures
```ts
/**
 * DTO for uploading an image to Google Drive.
 * 
 * DTO used when uploading a single image to Google Drive. If you want to upload multiple images
 * at once, use the `IGoogleDriveImageMultipleUpload` DTO and related API functions.
 * 
 * author Jaxtyn
 */
export interface IGoogleDriveImageSingleUpload {
  /**
   * Google user authentication key.
   * 
   * To upload an image file to Google Drive, Google user authentication must be preceded.
   * This field value must be assigned the user authentication key issued after pre-authentication.
   * And that authentication key must be able to respond to both read and write scopes.
   */
  token: string & SecretKey<"google-auth-key", ["read", "write"]>;

  /**
   * Image file path.
   * 
   * Composed by the File Uploader of the Workflow Editor's Inspector or Chat Agent.
   */
  url: string & tags.Format<"iri"> & (
    | tags.MediaContentType<"image/png">
    | tags.MediaContentType<"image/jpg">
  );

  /**
   * Path where the image file will be located, excluding the file name and extension.
   * 
   * title File path
   */
  location: string;

  /**
   * File name.
   * 
   * Pure file name excluding the extension.
   * 
   * Can be uploaded differently from the actual file name of {@link url}.
   */
  name: string & Placeholder<"Please enter the file name.">;

  /**
   * Image extension.
   */
  extension: "jpg" | "png";
}
```

When defining DTO types, write detailed explanations for each type and attribute as shown above.

And when developing this connector project, there are often cases where you need to use studio-specific decorator types such as `SecretKey` for referring to external service authentication keys or `Placeholder` provided as a hint to UI components. Visit https://github.com/wrtnio/decorators to understand how to use them.

Note that in the case of DTOs, the description part is divided into `title` and `description` in the JSON Schema definition, and `title` can be explicitly written as `@title Text` at the bottom of the comment. If there is no `@title` JSDoc tag, the first line of the comment sentence ending with a period (`.`) becomes the `title`, otherwise it becomes `undefined`.

### 4.3. Controller Methods
```ts
@Controller("google/:accountCode/drives/images/upload")
export class GoogleDriveImageUploadController {
  /**
   * Upload a single image file.
   * 
   * Upload a single image file individually to Google Drive.
   * 
   * @param accountCode Google account name
   * @param input Single image file upload information
   * @returns Information of the uploaded Google Drive file
   * 
   * @tag Google
   */
  @RouteIcon("https://somewhere.com/icons/file.png")
  @TypedRoute.Post("single")
  public async single(
    @TypedParam("accountCode") 
    accountCode: string,
    @TypedBody() input: IGoogleDriveImageSingleUpload
  ): Promise<IGoogleDriveFile> {
    ...
  }

  /**
   * Upload multiple image files to Google Drive at once.
   * 
   * @summary Multiple image file upload 
   * @param accountCode Google account name
   * @param input Multiple image file upload information
   * @returns List of information of the uploaded Google Drive files
   * 
   * @tag Google
   */
  @RouteIcon("https://somewhere.com/icons/file.png")
  @TypedRoute.Post("multiple")
  public multiple(
    @TypedParam("accountCode") 
    accountCode: string,
    @TypedBody() input: IGoogleDriveImageMultipleUpload
  ): Promise<IGoogleDriveFile[]> {
    ...
  }
}
```

When defining API controller methods, write detailed explanations about their functions as shown above.

And when developing this connector project, there are often cases where you need to use studio-specific decorator types such as `@RouteIcon()` for referring to the icon of each connector function. Visit https://github.com/wrtnio/decorators to understand how to use them.

Note that in the case of API operations, the description part is divided into `summary` and `description` in the OpenAPI spec definition, and `summary` can be explicitly written as `@summary Text` at the bottom of the comment. If there is no `@summary` JSDoc tag, the first line of the comment sentence ending with a period (`.`) becomes the `summary`, otherwise it becomes `undefined`.

## 5. Appendix
### 5.1. NPM Run Commands
A collection of NPM commands provided by this connector project.

If you add or modify new commands in `pakage.json`, be sure to modify this document.

- Test
  - **`test`**: **Run the test program, can be run after `build:test` or `dev`**
  - `test:inhouse`: Test program that can only be run within the Wrtn infrastructure
- Build
  - `build`: Build all SDK/Test/Main programs below
  - `build:sdk`: Build SDK library, local only
  - `build:main`: Build main program
  - `build:test`: Build test program
  - **`dev`**: **Incremental builder for test programs**
  - `eslint`: EsLint inspector
  - `pretter`: Apply Prettier in bulk
- Deploy
  - `package:api`: Build SDK library and deploy NPM package
  - `start`: Backend server standalone runner
  - `start:swagger`: Swagger UI runner

### 5.2. Directories
This connector project takes roughly the following folder structure.

- [.vscode/launch.json](.vscode/launch.json): Configuration for debugging
- [packages/](packages/): Packages to publish as private npm modules
  - [packages/api/](packages/api): Client [SDK](#32-software-development-kit) library for the client developers
- [src/](src/): TypeScript Source directory
  - [src/api/](src/api/): Client SDK that would be published to the `@wrtn/connector-api`
    - [**src/api/functional/**](src/api/functional/): API functions generated by the [`nestia`](https://github.com/samchon/nestia)
    - [**src/api/structures/**](src/api/structures/): DTO structures
  - [src/controllers/](src/controllers/): Controller classes of the Main Program
  - [src/providers/](src/providers/): Service providers
  - [src/executable/](src/executable/): Executable programs
- [**test/**](test/): Test Automation Program
  - [test/features/api](test/features/api): List of test functions

### 5.3. Custom Decorators
https://github.com/wrtnio/decorators

In the studio system, for functions that cannot be satisfied with the standard specs of OpenAPI v3.1 and JSON Schema, separate metadata plugin attributes are defined to supplement them. And the library that allows you to define these metadata plugin attributes is `@wrtn/decorators`.

Therefore, visit the above repository to understand what types of metadata plugin attributes exist and their purposes and usage.

### 5.4. Pure TypeScript Type
https://nestia.io/docs/pure/

Originally, NestJS requires DTOs to be declared as classes, and each TypeScript type, validator, transformer, and OpenAPI Spec (JSON Schema) must be defined redundantly four times. In the process, countless human errors can occur, making it impossible to guarantee the consistency of metadata.

Therefore, this connector server uses something called `nestia` on NestJS, allowing pure TypeScript types to be used when defining DTOs. And by automatically composing validation and OpenAPI (JSON schema) spec definitions from TypeScript types at the compiler level, it eliminates the need for redundant definitions of metadata, ensuring its safety.

This is the biggest difference between the connector backend server and the conventional NestJS backend server development method, so be sure to keep this in mind.

```ts
----------------------------------------------------------
// Traditional DTO definition method of NestJS
----------------------------------------------------------
export class BbsArticle {
  @ApiProperty({
    format: "uuid",
  })
  @IsString()
  id!: string;
 
  // DUPLICATED SCHEMA DEFINITION
  // - duplicated function call + property type
  // - have to specify `isArray` and `nullable` props by yourself
  @ApiProperty({
    type: () => AttachmentFile,
    nullable: true,
    isArray: true,
    description: "List of attached files.",
  })
  @Type(() => AttachmentFile)
  @IsArray()
  @IsOptional()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  files!: AttachmentFile[] | null;
 
  @ApiProperty({
    type: "string",
    nullable: true,
    minLength: 5,
    maxLength: 100,
    description: "Title of the article.",
  })
  @IsOptional()
  @IsString()
  title!: string | null;
 
  @ApiProperty({
    description: "Main content body of the article.",
  })
  @IsString()
  body!: string;
 
  @ApiProperty({
    format: "date-time",
    description: "Creation time of article",
  })
  @IsString()
  created_at!: string;
}

----------------------------------------------------------
// The connector server can define DTOs with pure interfaces
----------------------------------------------------------
export interface IBbsArticle {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;
 
  /**
   * List of attached files.
   */
  files: null | IAttachmentFile[];
 
  /**
   * Title of the article.
   */
  title: null | (string & tags.MinLength<5> & tags.MaxLength<100>);
 
  /**
   * Main content body of the article.
   */
  body: string;
 
  /**
   * Creation time of article.
   */
  created_at: string & tags.Format<"date-time">;
}
```
