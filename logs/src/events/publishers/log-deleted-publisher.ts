import { LogDeletedEvent, Publisher, Subjects } from "@cgestione/fl-common";

export default class LogDeletedPublisher extends Publisher<LogDeletedEvent> {
    subject: Subjects.LogDeleted = Subjects.LogDeleted;
};