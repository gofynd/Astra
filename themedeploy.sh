#!/bin/bash
function themedeploy() {
  if ! [ -x "$(command -v jq)" ]; then
    echo 'Error: jq is not installed. Installing' >&2
    sudo apt install -y jq
  fi
  local email
  local password
  while getopts e:p: flag
    do
        case "${flag}" in
            e)  email=${OPTARG};;
            p)  password=${OPTARG};;
        esac
    done
  [ -z "$email" ] && echo "Email is required" && return
  [ -z "$password" ] && echo "Password is required" && return
  local password=$(echo -n $password | base64)
  local currentContext=$(cat $(pwd)/.fdk/context.json | jq '.theme["active_context"]' | sed "s/\"//g")
  local currentContextObj=$(cat $(pwd)/.fdk/context.json | jq ".theme.contexts[\"$currentContext\"]"| sed "s/\"//g")
  local application_id=$(cat $(pwd)/.fdk/context.json | jq ".theme.contexts[\"$currentContext\"].application_id"| sed "s/\"//g")
  local domain=$(cat $(pwd)/.fdk/context.json | jq ".theme.contexts[\"$currentContext\"].domain"| sed "s/\"//g")
  local company_id=$(cat $(pwd)/.fdk/context.json | jq ".theme.contexts[\"$currentContext\"].company_id"| sed "s/\"//g")
  local theme_id=$(cat $(pwd)/.fdk/context.json | jq ".theme.contexts[\"$currentContext\"].theme_id"| sed "s/\"//g")
  local env=$(cat $(pwd)/.fdk/context.json | jq ".theme.contexts[\"$currentContext\"].env" | sed "s/\"//g")
  echo "This Will sync using context: ${currentContext}"
  echo "Syncing Theme to: ${domain}"
  TAG=deploy,$env,$email,$password,$company_id,$application_id,$theme_id,$domain
  git tag $TAG -f
  git push origin $TAG -f
}