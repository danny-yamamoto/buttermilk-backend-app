import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as ec2 from "aws-cdk-lib/aws-ec2";
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
kbpSecurityGroup.addIngressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(3000),
  "Allow NestJS traffic",
);
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
