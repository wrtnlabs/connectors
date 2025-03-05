# Contributing Guide (Connector Package)

## What is `Connector`?

Connector is a powerful tool that allows you to access other external services when communicating with LLM.

## Do you have suggestion?

- If you want to supply and demand a new connector
- If you want to add a new property or feature to the existing connector

If you have any suggestions, please leave an issue. If you have a connector that you want to try through LLM, and if you think there are enough users who want it, we will be happy to link them for you. But if you want to contribute to our project yourself, this is also welcome.

## Contributing Code

### Folder structure

To illustrate here as an example, let's say you want to supply and receive connectors from a service called wrtn (It's our company name).
There will be various APIs in the service called wrtn, and you may want to receive only a few of these functions.
Anyway, in order for you to contribute to this code, you need to understand the folder structure below.

```bash

packages
│
└── <package-name>
     │
     ├── src
     │    │
     │    ├── <package-name> # Main service logic is located here.
     │    │    │
     │    │    └── ${PackageName}Service.ts
     │    │
     │    ├── structures # Every Dtos or Interfaces or Types are located here.
     │    │    │
     │    │    └── I${PackageName}Service.ts # Add prefix "I" to the file name.
     │    │
     │    └── index.ts # Export classes and interfaces in src directory.
     │
     ├── test # Write the Test code about the service that you implement.
     │    │
     │    ├── features # Implement test about each features.
     │    │    │
     │    │    └── test_${package_name}_${feature} # Test code file.
     │    │
     │    ├── index.ts # Test execute file.
     │    │
     │    ├── TestGlobal.ts # Define the environment variables for Test.
     │    │
     │    └── tsconfig.json # tsconfig.json for Test.
     │
     ├── package.json
     │
     ├── README.md
     │
     ├── rollup.config.js
     │
     └── tsconfig.json
```

### Convention

- The directory name follows the lower snake case.
- The file name follows the Pascal case.
- Add the prefix `I` in interface or DTO file.

### Adding and Implementing a Connector Package

The minimum conditions you need to make connectors are as follows. Of course, these aren't the only ones, but I'll also explain them.

1. First, if we don't have a service file yet, make `service`.
2. Second, Define input & output types in `structure` directory as you design Service methods.
3. Third, Write E2E test codes about `service` feature.
4. Fourth, Implement internal logic in `service`.

Let's take a closer look one by one.

```ts
export class SlackService {
  constructor(private readonly props: ISlackService.IProps) {}
  /**
   * Slack Service.
   *
   * Get Specific Message Information.
   *
   * Get channel information and ts and get information of a specific message.
   */
  async getMessage(
    input: ISlackService.IGetMessageInput,
  ): Promise<ISlackService.IGetMessageOutput> {
    // Implement the get message logic.
  }
}
```

JSDoc must have a service name like `SlackService`.
comments are converted into value of `description` field in OpenAI Function Schema.
So LLM will have a better understanding of that method. So when a user wants to run a particular function, they will be able to specify that function better.

If you want to hide a method from OpenAI Function Schema, add the `@hidden` comment.

```ts
  /*
   * @hidden
   */
  async getMessage(
    input: ISlackService.IGetMessageInput,
  ): Promise<ISlackService.IGetMessageOutput> {
  }
```

Because of the `@hidden` comment, the method cannot be called with user utterance and can only be used on code.

### Define input & output types and add comments

```ts
export namespace ISlackService {
  export interface IGetMessageInput {
    messageId: string;
  }

  export interface IGetMessageOutput {
    message: string;
  }
}
```

But the difference here is that we use a library called [`Typia`](https://github.com/samchon/typia), [`Nestia`](https://github.com/samchon/nestia), to test the type and value of the library. Rather than adopting a popular library called class-validator to test the type and value, we adopted the type and nestia library that allows validation to be performed with only type information.

What you need to know is that because we are using these two libraries, we need to strictly write param, query, and body type in Request, and if type and value are different, validation error occurs! So if you want to make a connector, you need to specify the exact type to match the actual value with the type.

```ts
import { tags } from "typia";

export namespace ISlackService {
  export interface IGetMessageInput {
    messageId: string & tags.Format<"uuid">;
  }

  export interface IGetMessageOutput {
    message: string;
  }
}
```

There are also tags types in typia. These tag types help you specify more detailed types than the primitive types in the TypeScript.

The reason for specifying the type in the connector is that it is safe in that it makes the code predictable, but it is also because LLM uses this type of information. The type is itself an explanation and a hint of how to use the connector.

```ts
import { tags } from "typia";

export namespace ISlackService {
  export interface IGetMessageInput {
    /**
     * this is message id from the channel.
     *
     * @title Slack Message ID.
     */
    messageId: string & tags.Format<"uuid">;
  }

  export interface IGetMessageOutput {
    /**
     * Message body.
     *
     * @title Message Content.
     */
    message: string;
  }
}
```

Finally, please write `@title` and `description` in JSDOC. It is used to pass domain and business knowledge that is difficult to explain by type to LLM. You need to provide a sufficient level of description so that LLM can understand the purpose of this connector and use it.

### Configuration

If you can test the code only by inserting an environmental variable, you should write the following in `${project-root-directory}/.env` and `test/TestGlobal.ts`. One is where you put the environment variables, and the other is where you inject the environment variables in the .env file when the code is executed. `.env` file must be located in the project root directory.

```
// .env file
SLACK_CLIENT_ID=a
SLACK_CLIENT_SECRET=b
SLACK_TEST_SECRET=c
```

```ts
// test/TestGlobal.ts
interface IEnvironments {
  SLACK_CLIENT_ID: string;
  SLACK_CLIENT_SECRET: string;
  SLACK_TEST_SECRET: string;
}
```

Maybe you linked a connector that needed an environmental variable. For example, it could be sensitive information such as the value of the service client_id or client_secret, or it could be an environmental variable that is only needed for testing. For security reasons, you don't have to provide us with the values you used. Instead, please let us know which values we should link.

If you are using an environment variable that belongs to you, such as the client ID or the secret, you don't need to share it either. If you let me know the link, we will create the application ourselves and issue the ID and the secret key.

### Test your code

```ts
// test/features
export const test_slack_get_message = async () => {
  const slackService = new SlackService({
    // props
  });

  const res = await slackService.getMessage();

  typia.assert(res);
};
```

Once the connectors have been completed, it is time to write the test code. To ensure that the connectors are operational, at the very least, the code above must be written.

The function of all test codes has a prefix of `test_`. And create the service instance, call the method you want to test.

```bash
> npm run test -- --include slack
```

Now run the above command so that you can only test the connectors you created as above. The include option examines the name of a test function, allowing it to test only functions with that keyword.

### Sending Pull Request

We are giving icons to make this connector easier for users to use. If you want to recommend icons, you can provide the image file when you fly PR. However, the file is SVG, and our designer will make it for you if you don't provide it. :)

If you add or modify connectors, you need to let us know which API you are working on. If you do not have an official document, but do not work with an API, please leave enough commentary for it in PR. We will read and review the document you provided to prevent LLM from calling dangerous functions with Function calling.

### Server Contributing

If you want to contribute the Connector Server, Please refer to the following link.

- [Connector Server CONTRIBUTING.md](https://github.com/wrtnlabs/connectors/tree/main/packages/backend/README.md)
