#!/bin/sh

export CDNV=`cat CDNV`
AWS_PROFILE=personal

aws cloudformation deploy --stack-name bingo --template-file infrastructure/tasks.yml --capabilities CAPABILITY_IAM --tags stack=bingo --parameter-overrides ImageVersion=$CDNV
