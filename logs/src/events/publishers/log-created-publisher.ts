import { LogCreatedEvent, Publisher, Subjects } from "@cgestione/fl-common";

export default class LogCreatedPublisher extends Publisher<LogCreatedEvent> {
    subject: Subjects.LogCreated = Subjects.LogCreated;
};