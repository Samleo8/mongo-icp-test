#!/bin/bash

# Before this script can be run in the master node, you need to change something in the GUI according to the bug report here:
# https://github.com/IBM/deploy-ibm-cloud-private/issues/80#issuecomment-364155516
# More info is in the README.md

# NOTE: This is to be run on the MASTER NODE!
# i.e. Do this AFTER you `vagrant ssh` into the master node
SERVER="192.168.31.100"

cloudctl login -n default -u admin -p S3cure-icp-admin-passw0rd-default -a https://$SERVER:8443 --skip-ssl-validation

helm repo add ibm-charts https://raw.githubusercontent.com/IBM/charts/master/repo/stable/
helm repo add ibm-mongodb-dev https://raw.githubusercontent.com/IBM/charts/master/repo/stable/

helm init
helm repo update
