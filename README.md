# Contest - Freelancer: Log-Recorder

## Description:

The description for the project: https://www.freelancer.com/contest/2085151

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

## Additional:

-   Custom NPM package: `LINK WILL COME SOON`
-   Technical debt: - No custom Publisher/Listener service - This is meant to provide high availability and almost 100% uptime. It's not built in here due to the fact it's extremely complicated and not worth for a contest. - The service itself would also have to be cross language functional.
