#!/bin/bash

mv package.json package_bis.json
git pull
mv package_bis.json package.json

if [[ $? == 1 ]]; then
  echo "can't update"
fi

npm start
