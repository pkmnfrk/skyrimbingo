#!/bin/sh

export CDNV=`date +%s`
echo $CDNV > CDNV

node updateVersion

docker build -t 285209584037.dkr.ecr.us-east-1.amazonaws.com/bingo:latest .
docker tag 285209584037.dkr.ecr.us-east-1.amazonaws.com/bingo:latest 285209584037.dkr.ecr.us-east-1.amazonaws.com/bingo:$CDNV
docker push 285209584037.dkr.ecr.us-east-1.amazonaws.com/bingo:latest
docker push 285209584037.dkr.ecr.us-east-1.amazonaws.com/bingo:$CDNV
