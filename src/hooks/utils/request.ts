import { compile } from "json-schema-to-typescript";
import { OpenAPIV3 } from "openapi-types";
import { isReferenceObject } from "../../utils";

export async function createRequestType(
  name: string,
  requestBody?: OpenAPIV3.RequestBodyObject
): Promise<string> {
  if (!requestBody) {
    return "";
  }

  const request = parseRequest(requestBody);
  const schema = request?.schema;
  if (!schema || isReferenceObject(schema)) {
    return `export type ${name} = unknown;`;
  }
  return await compile(schema, name, {
    bannerComment: "",
  });
}

export function parseRequest(
  requestBody?: OpenAPIV3.RequestBodyObject
): OpenAPIV3.MediaTypeObject | undefined {
  if (!requestBody) {
    return;
  }
  return requestBody.content["application/json"];
}
