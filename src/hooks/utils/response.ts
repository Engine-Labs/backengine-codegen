import { compile } from "json-schema-to-typescript";
import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "../../utils";

export async function createResponseType(
  responses: OpenAPIV3.ResponsesObject,
  name: string
): Promise<[string, boolean]> {
  const successResponse = parseResponse(responses);

  const schema = successResponse?.schema;
  if (!schema || isReferenceObject(schema)) {
    return [`export type ${name} = void;`, false];
  }

  return [
    await compile(schema, name, {
      bannerComment: "",
    }),
    true,
  ];
}

export function parseResponse(
  responses: OpenAPIV3.ResponsesObject
): OpenAPIV3.MediaTypeObject | undefined {
  const successKey = Object.keys(responses).find((key) => key.startsWith("2"));
  if (!successKey) {
    return;
  }

  const successResponse = responses[successKey];
  if (isReferenceObject(successResponse) || !successResponse.content) {
    return;
  }

  return successResponse.content["application/json"];
}
