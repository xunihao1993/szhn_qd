#!/bin/bash

echo "获取git版本开始********"
echo ${GIT_REPO}
echo ${GIT_BRANCH}
echo ${COMMIT_ID}
echo "获取git版本********"

mkdir -p /home/admin/code_pro/ && \
 cd /home/admin/code_pro/ && \
 rm -fr yhsc_client/ && \
 git clone xxxxxxx -b ${GIT_BRANCH} && \
 cd xxx && \
 git checkout ${COMMIT_ID} && \
 sudo docker image build -f Dockerfile.base -t xxxxx8 . && \
 sudo docker-compose  -f docker/docker-compose.yml up  -d --build && \
 sudo docker container prune -f && \
 test=$(sudo docker images | grep "none")
 echo "输出none镜像信息:$test"
 if [ "$test" != "" ]; then
    sudo docker rmi $(sudo docker images | grep "none" | awk '{print $3}')
 fi
