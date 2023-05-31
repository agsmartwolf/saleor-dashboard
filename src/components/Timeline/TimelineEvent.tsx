import { Accordion, Box, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";

import TimelineEventHeader, { TitleElement } from "./TimelineEventHeader";

export interface TimelineEventProps {
  children?: React.ReactNode;
  date: string;
  secondaryTitle?: string;
  title?: React.ReactNode;
  titleElements?: TitleElement[];
  hasPlainDate?: boolean;
}

export const TimelineEvent: React.FC<TimelineEventProps> = props => {
  const { children, date, secondaryTitle, title, titleElements, hasPlainDate } =
    props;

  return (
    <Box
      display="flex"
      alignItems="center"
      marginBottom={4}
      position="relative"
      width="100%"
    >
      <Box
        as="span"
        position="absolute"
        backgroundColor="interactiveNeutralPressing"
        borderRadius="100%"
        __height="7px"
        __width="7px"
        __left="-28px"
        __top={children ? "12px" : "5px"}
      />
      {children ? (
        <Accordion
          className={sprinkles({
            width: "100%",
          })}
        >
          <Accordion.Item
            className={sprinkles({
              width: "100%",
            })}
            value="test"
          >
            <Accordion.Trigger>
              <TimelineEventHeader
                title={title}
                date={date}
                titleElements={titleElements}
                hasPlainDate={hasPlainDate}
              />
            </Accordion.Trigger>
            <Accordion.Content>
              <Box paddingTop={2}>
                <Text>{children}</Text>
              </Box>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      ) : (
        <TimelineEventHeader
          title={title}
          titleElements={titleElements}
          secondaryTitle={secondaryTitle}
          date={date}
          hasPlainDate={hasPlainDate}
        />
      )}
    </Box>
  );
};
TimelineEvent.displayName = "TimelineEvent";
export default TimelineEvent;
