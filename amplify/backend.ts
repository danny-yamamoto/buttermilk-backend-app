import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import dotenv from "dotenv";

const backend = defineBackend({
  auth,
  data,
});

const customResourceStack = backend.createStack("KBPCustomResources");

// Loading .env files
dotenv.config();

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

kbpSecurityGroup.addIngressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(80),
  "Allow HTTP traffic",
);

const kbpCluster = new ecs.Cluster(customResourceStack, "kbpCluster", {
  vpc: kbpCustomVpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(
  customResourceStack,
  "kbpFargateTaskDefinition",
  {
    memoryLimitMiB: 512,
    cpu: 256,
  },
);

// Secrets
// README at: https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/secrets-and-vars/#access-secrets
const imageTag = process.env.BACKEND_API_TAG || "latest";

// ECS
// README at: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html
taskDefinition.addContainer("fargate-app", {
  image: ecs.ContainerImage.fromRegistry(
    "public.ecr.aws/docker/library/httpd:" + imageTag,
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
