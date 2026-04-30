# NG Signals Project Summary

You built and deployed an Angular app with a serverless AWS backend, and you documented two valid frontend deployment paths.

## What You Built

- Created an Angular project called `ng-signals`.
- Added a backend in `back-end` using the Serverless Framework.
- Deployed the backend to AWS Lambda.
- Exposed the backend through API Gateway.
- Stored registered users in DynamoDB.
- Confirmed the final register endpoint:
  `https://9clpwaoipj.execute-api.us-east-1.amazonaws.com/api/v1/register`

## Frontend Deployment Paths

You tried two separate frontend deployment models:

- **S3 static hosting path**: GitHub Actions builds the Angular app, runs tests, and syncs `dist/ng-signals/browser` to the S3 bucket `dev-daho`.
- **Docker/App Runner path**: You built a Docker image for the frontend, pushed it to ECR, and ran it through AWS App Runner.

The important clarification is that S3 and Docker were separate approaches. You did not deploy a Docker image to S3. S3 received static Angular files, while ECR and App Runner handled the Docker image.

## Deployment Flow From README

Legend:

- Green = already practiced in this project.
- Red = not practiced yet, but useful next topics.

If Mermaid does not render in your Markdown preview, use this rendered SVG version:

![NG Signals deployment flow](./aws-deployment-flow.svg)

```mermaid
flowchart TD
    classDef practiced fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef next fill:#fee2e2,stroke:#dc2626,color:#7f1d1d

    Repo["GitHub repo: ng-signals"]
    Frontend["Angular frontend"]
    Backend["back-end serverless API"]

    Repo --> Frontend
    Repo --> Backend

    Frontend --> StaticBuild["ng build --configuration production"]
    StaticBuild --> GHActions["GitHub Actions CI/CD"]
    GHActions --> S3Static["S3 bucket: dev-daho"]
    S3Static --> StaticSite["Static Angular site"]

    Frontend --> DockerBuild["Docker image build"]
    DockerBuild --> ECR["Amazon ECR image repository"]
    ECR --> AppRunner["AWS App Runner service"]
    AppRunner --> ContainerSite["Container-hosted frontend"]

    Backend --> ServerlessFramework["Serverless Framework"]
    ServerlessFramework --> Offline["npx serverless offline"]
    ServerlessFramework --> Deploy["npx serverless deploy"]
    Deploy --> Lambda["AWS Lambda functions"]
    Lambda --> APIGateway["API Gateway"]
    APIGateway --> RegisterEndpoint["/api/v1/register endpoint"]
    Lambda --> AWSSDK["AWS SDK for DynamoDB"]
    AWSSDK --> DynamoDB["DynamoDB users table"]

    DockerBuild -. future practice .-> ECS["Amazon ECS"]
    DockerBuild -. future practice .-> EKS["Amazon EKS"]
    EKS -. uses .-> Kubernetes["Kubernetes"]

    class Repo,Frontend,Backend,StaticBuild,GHActions,S3Static,StaticSite,DockerBuild,ECR,AppRunner,ContainerSite,ServerlessFramework,Offline,Deploy,Lambda,APIGateway,RegisterEndpoint,AWSSDK,DynamoDB practiced
    class ECS,EKS,Kubernetes next
```

## AWS Deployment Runbook Summary

If Mermaid does not render in your Markdown preview, use this rendered SVG version:

![AWS deployment runbook summary](./aws-runbook-summary.svg)

```mermaid
flowchart LR
    classDef practiced fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef next fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    classDef evidence fill:#fef9c3,stroke:#ca8a04,color:#713f12

    Start["Local project setup"]
    AngularCLI["Angular CLI project"]
    Dependencies["npm dependencies"]
    SDKPackages["AWS SDK packages"]
    AWSAuth["aws configure + sts identity check"]

    Start --> AngularCLI
    Start --> Dependencies
    Dependencies --> SDKPackages
    AWSAuth --> BackendDeploy

    subgraph BackendPath["Backend API path"]
        BackendDeploy["Serverless deploy workflow"]
        OfflineCmd["npx serverless offline"]
        DeployCmd["npx serverless deploy"]
        LogsCmd["npx serverless logs -f register -t"]
        LambdaFns["Lambda: register and ping"]
        Gateway["API Gateway route"]
        UsersTable["DynamoDB users table"]
        Endpoint["Final register endpoint"]
    end

    BackendDeploy --> OfflineCmd
    BackendDeploy --> DeployCmd
    BackendDeploy --> LogsCmd
    DeployCmd --> LambdaFns
    LambdaFns --> Gateway
    LambdaFns --> SDKPackages
    SDKPackages --> UsersTable
    Gateway --> Endpoint

    subgraph StaticFrontend["Frontend static hosting path"]
        BuildCmd["Production Angular build"]
        CI["GitHub Actions CI/CD"]
        Tests["npm run test:unit"]
        S3Bucket["S3 static bucket: dev-daho"]
    end

    AngularCLI --> BuildCmd
    BuildCmd --> CI
    CI --> Tests
    CI --> S3Bucket

    subgraph ContainerFrontend["Frontend container path"]
        DockerInfo["docker info / hello-world"]
        Image["Docker image: ng-signals-frontend"]
        LocalRun["docker run -p 8080:80"]
        ECRRepo["ECR repository"]
        Runner["AWS App Runner"]
    end

    AngularCLI --> DockerInfo
    DockerInfo --> Image
    Image --> LocalRun
    Image --> ECRRepo
    ECRRepo --> Runner

    subgraph Evidence["Verification evidence"]
        Screenshots["Runbook screenshots"]
        DDBCheck["DynamoDB item verification"]
        AWSConsole["AWS console service checks"]
    end

    UsersTable --> DDBCheck
    Runner --> AWSConsole
    S3Bucket --> AWSConsole
    LambdaFns --> AWSConsole
    Gateway --> AWSConsole
    AWSConsole --> Screenshots

    subgraph FuturePractice["Not practiced yet"]
        ECSNext["Amazon ECS"]
        EKSNext["Amazon EKS"]
        K8sNext["Kubernetes"]
    end

    Image -. next container orchestration practice .-> ECSNext
    Image -. next Kubernetes practice .-> EKSNext
    EKSNext -. managed Kubernetes .-> K8sNext

    class Start,AngularCLI,Dependencies,SDKPackages,AWSAuth,BackendDeploy,OfflineCmd,DeployCmd,LogsCmd,LambdaFns,Gateway,UsersTable,Endpoint,BuildCmd,CI,Tests,S3Bucket,DockerInfo,Image,LocalRun,ECRRepo,Runner practiced
    class Screenshots,DDBCheck,AWSConsole evidence
    class ECSNext,EKSNext,K8sNext next
```

## AWS Services Used

You set up or touched these AWS services:

- DynamoDB
- Lambda
- API Gateway
- ECR
- App Runner
- S3
- IAM

## Documentation Purpose

The README and deployment runbook act as your personal AWS deployment memory. They capture the commands used, services touched, screenshots proving each step, and quick redeploy checklists for backend, S3 frontend, and Docker/App Runner frontend.

## Recommended Next Step

Choose one primary frontend deployment path to reduce confusion:

- Use **S3 + GitHub Actions** for simpler static hosting.
- Use **Docker + ECR + App Runner** if you want a container-based workflow.

The backend can remain Serverless/Lambda with either frontend approach.
