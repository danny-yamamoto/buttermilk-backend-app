import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

defineBackend({ data });

export class CustomVpc extends Construct {
  public readonly vpc: ec2.Vpc;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.vpc = new ec2.Vpc(this, "CustomVpc", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
    });
  }
}
