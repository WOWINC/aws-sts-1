ORG="fatjohnny"
docker run -it --rm -v $HOME/.aws/:/root/.aws/ ${ORG}/aws-sts "$@"

