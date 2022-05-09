# Contest - Freelancer: Log-Recorder

## Description:

The description for the project: https://www.freelancer.com/contest/2085151

## My input & reply on the contest:

"I've carefully read your contest description. I'll implement whatever you want, however in addition I'll make the task more difficult for myself. The added complexity will be the following:

-   Backend will be an asynchronous event driven (NATS Streaming server) architecture
-   Will use SQL (Postgres) & NoSQL (mongodb) in combination.
-   Will add authentication
-   Will add automated testing
-   Will add a custom npm package for code re-use & clean code in general
-   Will add a CI/CD pipeline.
-   Will make all of this run in pods using kubernetes.
-   Will create an authentication service.
-   Will implement container orchestration (skaffold)
-   Will make it that if the creating logs service is down, you can still view your logs.

TL;DR: I'm adding complexity in every aspect except the front-end (a micro frontend combined with microservice backend is overkill on overkill) to showcase my abilities and distinguish myself from the rest."

## View project:

-   will be added soon

## Requirements:

-   Install docker: https://docs.docker.com/get-docker/
-   Install kubernetes: https://docs.docker.com/desktop/kubernetes/
-   Install skaffold: https://skaffold.dev/

## Setup & Installation:

-   will be added soon

## Visual overview:

### Architecture:

This diagram shows the general overview of the microservice design.
![Microservice architecture](https://github.com/berkan-alci/contest-freelancer/blob/main/diagrams/Architecture.png)

### Cluster Overview:

This diagram shows the specific cluster with its pods & services in regards to the design.
![Cluster overview](https://github.com/berkan-alci/contest-freelancer/blob/main/diagrams/Cluster-overview.png)

### Events:

This diagram shows the specific publishers & listeners for each service.
![Event overview](https://github.com/berkan-alci/contest-freelancer/blob/main/diagrams/service-events.png)

### Routes:

This diagram shows the specific routes for each service.
![Service routes overview](https://github.com/berkan-alci/contest-freelancer/blob/main/diagrams/service-routes.png)

### Event flow example:

This diagarm shows an example of how data would go around in an asynchronous event driven architecture.
![Event flow example](https://github.com/berkan-alci/contest-freelancer/blob/main/diagrams/event-flow-example.png)

## Additional info:

-   Custom NPM package: https://www.npmjs.com/package/@cgestione/fl-common
-   NPM package git repo: https://github.com/berkan-alci/contest-fl-common
-   Technical debt:
    -   No custom Publisher/Listener service
        -   This is meant to provide high availability and almost 100% uptime. It's not built in here due to the fact it's extremely complicated and not worth for a contest.
        -   The service itself would also have to be cross language functional.
