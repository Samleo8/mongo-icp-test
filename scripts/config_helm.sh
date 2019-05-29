#!/bin/bash

# Do this AFTER you `vagrant ssh` into the master node; i.e. this is to be run on the MASTER NODE!.
# Actually not very sure...

cloudctl login -n default -u admin -p S3cure-icp-admin-passw0rd-default -a https://192.168.31.100:8443 --skip-ssl-validation

helm init
helm update && helm install --name test --set service.type=NodePort,database.password=password123 stable/ibm-mongodb-dev
