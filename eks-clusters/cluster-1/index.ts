import * as k8s from "@pulumi/kubernetes"
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {ExternalDns, Dex} from '@k8s-ms-modules-demo/eks';
import {runTests} from './tests';

const config = new pulumi.Config();
// Get the EKS cluster
const cluster = aws.eks.Cluster.get('k8s-ms-infra-demo', config.require('eksClusterName'));
const provider = new k8s.Provider('k8s-ms-infra-demo', {cluster: cluster.arn});

// Create new k8s namespace
const namespace = new k8s.core.v1.Namespace('rax-managed', {
    metadata: {name: 'rax-managed'}
}, {provider});

// Provision ExternalDNS service
export const externalDns = new ExternalDns(provider, namespace);

// Provision Dex service
// export const dex = new Dex(provider, namespace);

runTests();
/*
const harbor = new Harbor(cluster, namespace, {
    expose: {
        type: 'ClusterIP',
        tls: {
            commonName: 'harbor.atistler.mk8s.rackspace.net'
        }
    }
});
const prometheusOperator = new PrometheusOperator(cluster, namespace);
const certManager = new CertManager(cluster, namespace);
*/


