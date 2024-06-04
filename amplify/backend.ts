import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

const backend = defineBackend({
  auth,
  data,
});

const customResourceStack = backend.createStack("KBPCustomResources");

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
    value: kbpRdsInstance.dbInstanceEndpointAddress,
  },
});
