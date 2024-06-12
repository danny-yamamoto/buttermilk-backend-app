import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as ec2 from "aws-cdk-lib/aws-ec2";
//import * as rds from "aws-cdk-lib/aws-rds";
//import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs from "aws-cdk-lib/aws-ecs";
//import * as codebuild from "aws-cdk-lib/aws-codebuild";
//import * as iam from "aws-cdk-lib/aws-iam";
//import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";

const backend = defineBackend({
  auth,
  data,
});

const customResourceStack = backend.createStack("KBPCustomResources");

// VPC
// README at: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2-readme.html
const kbpCustomVpc = new ec2.Vpc(customResourceStack, "kbpAmpxVPC", {
  //  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  maxAzs: 2,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: "public",
      subnetType: ec2.SubnetType.PUBLIC,
    },
  ],
});
const kbpSecurityGroup = new ec2.SecurityGroup(
  customResourceStack,
  "kbpRDSSecurityGroup",
  {
    vpc: kbpCustomVpc,
    allowAllOutbound: true,
  },
);
kbpSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3306));
kbpSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
kbpSecurityGroup.addEgressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(443),
  "Allow HTTPS outbound traffic",
);

/*
//533267164653.dkr.ecr.ap-northeast-1.amazonaws.com/hello-repository
const repository = ecr.Repository.fromRepositoryArn(
  customResourceStack,
  "MyExistingRepository",
  "arn:aws:ecr:ap-northeast-1:533267164653:repository/hello-repository",
);

const containerImage = ecs.ContainerImage.fromEcrRepository(
  repository,
  "latest",
);

const taskDefinition = new ecs.Ec2TaskDefinition(
  customResourceStack,
  "MyTaskDefinition",
);

const container = taskDefinition.addContainer("DefaultContainer", {
  image: containerImage,
  memoryLimitMiB: 512,
  cpu: 256,
});
*/

/*
const repository = ecr.Repository.fromRepositoryArn(
  customResourceStack,
  "MyExistingRepository",
  "arn:aws:ecr:ap-northeast-1:533267164653:repository/hello-repository",
);

const containerImage = ecs.ContainerImage.fromEcrRepository(
  repository,
  "latest",
);

const kbpCluster = new ecs.Cluster(customResourceStack, "kbpCluster", {
  vpc: kbpCustomVpc,
});

kbpCluster.addCapacity("kbpAutoScalingGroupCapacity", {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  desiredCapacity: 1,
});

const kbpTaskDefinition = new ecs.Ec2TaskDefinition(
  customResourceStack,
  "kbpTaskDef",
);

kbpTaskDefinition.addContainer("kbpContainer", {
  image: containerImage,
  memoryLimitMiB: 512,
  cpu: 256,
});

new ecs.Ec2Service(customResourceStack, "kbpService", {
  cluster: kbpCluster,
  taskDefinition: kbpTaskDefinition,
});
*/

kbpSecurityGroup.addIngressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(80),
  "Allow HTTP traffic",
);

const kbpCluster = new ecs.Cluster(customResourceStack, "kbpCluster", {
  vpc: kbpCustomVpc,
});

// タスク定義の作成
const taskDefinition = new ecs.FargateTaskDefinition(
  customResourceStack,
  "kbpFargateTaskDefinition",
  {
    memoryLimitMiB: 512,
    cpu: 256,
  },
);

// コンテナ定義の追加
taskDefinition.addContainer("fargate-app", {
  image: ecs.ContainerImage.fromRegistry(
    "public.ecr.aws/docker/library/httpd:latest",
  ),
  entryPoint: ["sh", "-c"],
  command: [
    "/bin/sh -c \"echo '<html> <head> <title>Amazon ECS Sample App</title> <style>body {margin-top: 40px; background-color: #333;} </style> </head><body> <div style=color:white;text-align:center> <h1>Amazon ECS Sample App</h1> <h2>Congratulations!</h2> <p>Your application is now running on a container in Amazon ECS.</p> </div></body></html>' >  /usr/local/apache2/htdocs/index.html && httpd-foreground\"",
  ],
  portMappings: [
    {
      containerPort: 80,
      hostPort: 80,
      protocol: ecs.Protocol.TCP,
    },
  ],
});

const kbpFargateServiceSecurityGroup = new ec2.SecurityGroup(
  customResourceStack,
  "kbpFargateServiceSecurityGroup",
  {
    vpc: kbpCustomVpc,
    description: "Allow access to Fargate service",
    allowAllOutbound: true,
  },
);
kbpFargateServiceSecurityGroup.addIngressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(80),
  "Allow HTTP traffic",
);

// Fargateサービスの作成
new ecs.FargateService(customResourceStack, "kbpFargateService", {
  cluster: kbpCluster,
  taskDefinition: taskDefinition,
  assignPublicIp: true,
  securityGroups: [kbpFargateServiceSecurityGroup],
});

/*
// RDS
// README at: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecr-readme.html
const kbpRdsInstance = new rds.DatabaseInstance(
  customResourceStack,
  "kbpRDSInstance",
  {
    engine: rds.DatabaseInstanceEngine.mysql({
      version: rds.MysqlEngineVersion.VER_8_0_36,
    }),
    credentials: rds.Credentials.fromGeneratedSecret("admin"),
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.BURSTABLE3,
      ec2.InstanceSize.SMALL,
    ),
    vpc: kbpCustomVpc,
    vpcSubnets: {
      subnetType: ec2.SubnetType.PUBLIC,
    },
    securityGroups: [kbpSecurityGroup],
    databaseName: "kbpAmpxDb",
    publiclyAccessible: true,
  },
);

backend.addOutput({
  custom: {
    rds: kbpRdsInstance.dbInstanceEndpointAddress,
  },
});
*/
