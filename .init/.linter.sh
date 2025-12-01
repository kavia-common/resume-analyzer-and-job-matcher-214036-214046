#!/bin/bash
cd /home/kavia/workspace/code-generation/resume-analyzer-and-job-matcher-214036-214046/resume_app_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

