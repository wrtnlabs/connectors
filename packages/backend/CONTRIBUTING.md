# Contributing Guide

## What is `Connector`?

## Do you have suggestion?

- If you want to supply and demand a new connector
- If you want to add a new property or feature to the existing connector

If you have any suggestions, please leave an issue. If you have a connector that you want to try through LLM, and if you think there are enough users who want it, we will be happy to link them for you. But if you want to contribute to our project yourself, this is also welcome.

## Contributing Code

### Folder structure

To illustrate here as an example, let's say you want to supply and receive connectors from a service called wrtn (It's our company name).  
There will be various APIs in the service called wrtn, and you may want to receive only a few of these functions.
Anyway, in order for you to contribute to this code, you need to understand the folder structure below.

```text
src
  ㄴ api/
    ㄴ structures # For your input and output types
      ㄴ connector
  ㄴ controllers
    ㄴ connectors # The controller for the api you will make
  ㄴ providers # Business logic to be used by the controller
  ㄴ modules
```

In these folders, there will be folders again under the name of the service, for example, 'api/structures/google-ads', and there will be types of google-ads.  
If you don't have a folder, you can make a contribution by creating a new folder.
If so, the structure will change again as below.

```text
src
  ㄴ api/
    ㄴ structures
      ㄴ connector
        ㄴ wrtn/IWrtn.ts
  ㄴ controllers
    ㄴ connectors
      ㄴ ConnectorModule.ts # Import WrtnModule here
      ㄴ wrtn/WrtnModule.ts
      ㄴ wrtn/WrtnController.ts
  ㄴ providers
    ㄴ wrtn/WrtnProvider.ts
```

### Adding and Implementing a Connector

The minimum conditions you need to make connectors are as follows. Of course, these aren't the only ones, but I'll also explain them.

1. First, if we don't have a controller file yet, make `controller`.
2. Second, Define `connector` as you design API endpoints.
3. Third, Define input & output types for this connector.
4. Fourth, Implement internal logic in provider.

Let's take a closer look one by one.

```ts
// in your controller
@Controller()
class WrtnController {
  constructor(private readonly wrtnProvider: WrtnProvider) {}

  /**
   * Get something is something.
   *
   * This connector get something from wrtn service.
   *
   * @summary Get Something in wrtn
   */
  @core.TypedRoute.Post("get-something")
  async getSomething(
    @TypedBody() input: IWrtn.IGetSomethingInput,
  ): Promise<IWrtn.IGetSomethingOutput> {
    return this.wrtnProvider.getSomething(input);
  }
}
```

JSDoc must have a @summary tag, which acts like a summary for Swagger.
Other untagged comments are automatically categorized as a description of the corresponding connector API, and the first line based on the two lines is a summary of the description.

```ts
// in your provider
@Injectable()
export class WrtnProvider {
  async getSomething() {
    // There's only an axios function written inside to link the functionality, and that's actually it!
    const res = await axios(...);
    return res.data;
  }
}

```

Creating connector functions is not much different than simply using functions like axios or fetch to link external APIs. Providers sometimes have server logic written for additional implementations, but in most cases, it will be only possible to call the axios function linking api.

### Define input & output types and add comments

```ts
import { tags } from "typia";

export namespace IWrtn {
  export interface IGetSomethingInput {
    someProperty1: number;
    someProperty2: string;
  }

  export interface IGetSomethingOutput {
    ...
  }
}
```

But the difference here is that we use a library called [`Typia`](https://github.com/samchon/typia), [`Nestia`](https://github.com/samchon/nestia), to test the type and value of the library. Rather than adopting a popular library called class-validator to test the type and value, we adopted the type and nestia library that allows validation to be performed with only type information.

What you need to know is that because we are using these two libraries, we need to strictly write param, query, and body type in Request, and if type and value are different, validation error occurs! So if you want to make a connector, you need to specify the exact type to match the actual value with the type.

```ts
import { tags } from "typia";

export namespace IWrtn {
  export interface IGetSomethingInput {
    someProperty1: number & tags.type<"int64"> & tags.Minimum<0>;
    someProperty2: string & tags.Format<"iri">;
  }

  export interface IGetSomethingOutput {
    ...
  }
}
```

There are also tags types in typia. These tag types help you specify more detailed types than the primitive types in the TypeScript.

The reason for specifying the type in the connector is that it is safe in that it makes the code predictable, but it is also because LLM uses this type of information. The type is itself an explanation and a hint of how to use the connector.

```ts
import { tags } from "typia";

export namespace IWrtn {
  export interface IGetSomethingInput {
    /**
     * This property contributes to this functionality.
     *
     * @title some property for getting something
     */
    someProperty1: number & tags.type<"int64"> & tags.Minimum<0>;

    someProperty2: string & tags.Format<"iri">;
  }

  export interface IGetSomethingOutput {
    ...
  }
}
```

Finally, please write `@title` and `description` in JSDOC. It is used to pass domain and business knowledge that is difficult to explain by type to LLM. You need to provide a sufficient level of description so that LLM can understand the purpose of this connector and use it.

### Configuration

If you can run or test the code only by inserting an environmental variable, you should write the following in `.env` and `src/ConnectorGlobal.ts`. One is where you put the environment variables, and the other is where you inject the environment variables in the .env file when the code is executed.

```
// .env file
WRTN_CLIENT_ID=a
WRTN_CLIENT_SECRET=b
```

```ts
// src/ConnectorGlobal.ts
export namespace ConnectorGlobal {
  export interface IEnvironments {
    WRTN_CLIENT_ID: string;
    WRTN_CLIENT_SECRET: string;
  }
}
```

Maybe you linked a connector that needed an environmental variable. For example, it could be sensitive information such as the value of the service client_id or client_secret, or it could be an environmental variable that is only needed for testing. For security reasons, you don't have to provide us with the values you used. Instead, please let us know which values we should link.

If you are using an environment variable that belongs to you, such as the client ID or the secret, you don't need to share it either. If you let me know the link, we will create the application ourselves and issue the ID and the secret key.

### Secret key for api calling

```ts
export namespace ICommon {
  export interface ISecret<
    T extends string,
    S extends undefined | never | string[] = never,
  > {
    secretKey: string & SecretKey<T, S>;
  }
}
```

There is an interface called 'ICommon.ISsecret' in our code. The service sometimes needs to inherit this interface to implement the body type of the request. The reason for the existence of 'ICommon.ISsecret' is to receive the SecretKey from the user and call the user's API instead. For example, it can be implemented as follows.

```ts
export namespace IWrtn {
  export interface ISecret
    extends ICommon.ISecret<
      "wrtn", // service name
      ["a_scope", "b_scope"] // scope
    > {}

  export interface IGetSomethingInput extends IWrtn.ISecret {
    someProperty1: number;
  }
}
```

This means that in order to call get something api, you need to get a token from the user, the name of the service is wrtn, and the required permissions should be a_scope and b_scope.

The `secretKey` will probably be the user's refresh token or access token with no expiration date. If you want to designate the refresh token as the `secretKey`, the provider will also need to write a private method of reissuing the token.

### Test your code

```ts
import CApi from "@wrtn/connector-api/lib/index";

export const test_api_connector_wrtn_get_something = async (
  connection: CApi.IConnection,
) => {
  const res = await CApi.functional.connector.wrtn.get_something.getSomething(
    connection,
    {} as IWrtn.IGetSomethingInput, // Fill in the parameters of the function
  );

  typia.assert(res); // Type check
};
```

Once the connectors have been completed, it is time to write the test code. To ensure that the connectors are operational, at the very least, the code above must be written.

The function of all test codes has a prefix of 'test_api_connector' like that, and it is sufficient to write only in the state of the function without calling.

```bash
> npm run test -- --include wrtn
```

Now run the above command so that you can only test the connectors you created as above. The include option examines the name of a test function, allowing it to test only functions with that keyword.

### Prerequisite(Optional)

Prequisite is one of the unique types that we are using. If you use this type, it's usually written as below.

```ts
import { tags } from "typia";

export namespace IWrtn {
  export interface IGetSomethingInput {
    someProperty: string &
      Prerequisite<{
        method: "post";
        path: "/connector/wrtn/get-something-list";
        jmesPath: "[].{value:url, label:name}";
      }>;
  }
}
```

`Prerequisite` is only created if there is a connector that must precede it to obtain a particular property of this type. This is the type that is used to give LLM more hints. What we know in the above case is that the value obtained by calling the connector `POST/connector/wrtn/get-something-list` is the array, and the value of the array uses url as the value and name as the label. Value refers to the actual value to be mapped to this property, and label refers to a property that lets you know what it means.

### Sending Pull Request

We are giving icons to make this connector easier for users to use. If you want to recommend icons, you can provide the image file when you fly PR. However, the file is SVG, and our designer will make it for you if you don't provide it. :)

If you add or modify connectors, you need to let us know which API you are working on. If you do not have an official document, but do not work with an API, please leave enough commentary for it in PR. We will read and review the document you provided to prevent LLM from calling dangerous functions with Function calling.
