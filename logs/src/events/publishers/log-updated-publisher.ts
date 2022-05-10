import { LogUpdatedEvent, Publisher, Subjects } from "@cgestione/fl-common";

export default class LogCreatedPublisher extends Publisher<LogUpdatedEvent> {
    subject: Subjects.LogUpdated = Subjects.LogUpdated;
};