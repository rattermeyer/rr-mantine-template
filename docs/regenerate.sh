#!/bin/bash

rm -rf build/site/docs
npx antora generate antora-playbook.yml
