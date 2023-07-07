/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ApolloClient } from "@apollo/client";

import { FilterElement } from "../FilterElement";
import {
  AttributeChoicesHandler,
  AttributesHandler,
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  Handler,
  ProductTypeHandler,
} from "./Handler";

const getFilterElement = (value: any, index: number): FilterElement => {
  const possibleFilterElement = value[index];
  return typeof possibleFilterElement !== "string"
    ? possibleFilterElement
    : null;
};

const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
): Handler => {
  if (selectedRow.isAttribute()) {
    return new AttributeChoicesHandler(
      client,
      selectedRow.value.value,
      inputValue,
    );
  }

  if (selectedRow.isCollection()) {
    return new CollectionHandler(client, inputValue);
  }

  if (selectedRow.isCategory()) {
    return new CategoryHandler(client, inputValue);
  }

  if (selectedRow.isProductType()) {
    return new ProductTypeHandler(client, inputValue);
  }

  if (selectedRow.isChannel()) {
    return new ChannelHandler(client, inputValue);
  }

  throw new Error("Unknown filter element");
};

export const getLeftOperatorOptions = async (
  client: ApolloClient<unknown>,
  inputValue: string,
) => {
  const handler = new AttributesHandler(client, inputValue);
  return handler.fetch();
};
