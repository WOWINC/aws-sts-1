# AWS STS Token Generator

 ### This is a fork of https://github.com/meetearnest/aws-sts.  It has been modified to work with our account setup, which requires a different app url for each account.

Single Sign on within AWS removes the ability to generate long-lived access tokens for AWS. Instead, the
[Amazon Security Token Service](http://docs.aws.amazon.com/STS/latest/APIReference/Welcome.html) is used to generate
short-lived tokens.

This command line utility can be used to authenticate with an SSO provider (ex: Okta) and generate access token credentials.
It supports assuming an AWS role and will automatically update your AWS CLI credentials file with the new credentials.

## Configuration

Configuration is done by creating a config.json file in the cfg directory. An [example template](./cfg/config.example.json) is provided.

NOTE: For awsConfigPath, you should not use a platform specific path prefix, like '~' or '%USERPROFILE%', the script will join with the OS home directory.


```
awsConfigPath:    Path to the user AWS CLI credential file. The recommended path is the path to the Docker container's credential path.
outputFormat:     Output format of AWS access token credentials
region:           Region used for AWS API calls
provider:         Name of the SAML provider to use for authentication
defaultAccount:   Default AWS account to use when one is not specified via the command line
accounts:         Hash of name/idPEntryUrl pairs for accounts which can be switched to. (idpEntrpUrla is the  URL to access the form-based authentication login for the provider fot the account)
```

## Installation

To install on windows or osx:
1. Clone this Repo
2. install the dependencies: `npm install`
3. run the [`aws-token.sh`](./aws-token.sh) script at the root of your repository. use the --account switch to select an account to log in to.
` ./aws-token.sh --account account-name `

For linux (optionally, osx) use the docker image instead.

## Usage
The syntax for all operating systems is correct, however the script to launch varies by operating system.
* Windows powershell:  aws-token.ps1
* Windows cmd.exe:  aws-token.cmd
* OSX: aws-token.sh
* Docker: ws-tocken-docker.sh

*Important note:  the --run_command will NOT work when run via docker, as the command will be run in the context of the container.

*Another Important note:  If you specifiy a run command that has a space in the path name, you MUST escape the space.  For example, use the caret (^) to escape a space in a windows path:*

```
aws-token.cmd --account wowinc-dev --run_command "c:\Program^ Files\RazorSQL\RazorSQL.exe
```

### Parameters
```
$> ./aws-token.sh --help
usage: index.js [-h] [-v] [--username USERNAME] [--password PASSWORD]
                [--role ROLE]
                [--account {wowinc-master,wowinc-core,wowinc-logging,wowinc-dev,wowinc-dev-nta,wowinc,wowinc-dev-otr,wowinc-prod-otr,wowinc-dev-docsis,wowinc-prod-docsis,wowinc-dev-cfs,wowinc-dev-pq}]
                [--profile PROFILE] [--run_command RUN_COMMAND]
                

Generation of AWS STS tokens via SAML authentication.

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  --username USERNAME   Okta username (ex. user@domain.com)
  --password PASSWORD   Okta password
  --role ROLE           Name of SAML role to assume
  --account {wowinc-master,wowinc-core,wowinc-logging,wowinc-dev,wowinc-dev-nta,wowinc,wowinc-dev-otr,wowinc-prod-otr,wowinc-dev-docsis,wowinc-prod-docsis,wowinc-dev-cfs,wowinc-dev-pq}
                        Name of account to switch to. Defaults to 
                        "wowinc-dev".
  --profile PROFILE     Profile name that the AWS credentials should be saved 
                        as. Defaults to the name of the account specified.
  --run_command RUN_COMMAND
                        The path to the command to run after logging in. Sets 
                        AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and 
                        AWS_SESSION_TOKEN before running the command
```

![Image of Generator in Action](https://raw.githubusercontent.com/meetearnest/aws-sts/master/docs/aws-sts-token-generator.gif)

## How it Works

The process of authenticating with Okta (and many SAML SSO providers) is only possible via form-based authentication.
We're using headless browser automation to emulate a form-based sign-on. This is similar to the [solution proposed by Amazon](https://blogs.aws.amazon.com/security/post/Tx1LDN0UBGJJ26Q/How-to-Implement-Federated-API-and-CLI-Access-Using-SAML-2-0-and-AD-FS).

 1. Prompt user for SSO-provider username and password
 2. Use a headless browser to navigate to the login page and submit the credentials
 3. Prompt for a TOTP token
 4. Use the headless browser to submit the TOTP token
 5. Parse the response from Amazon to extract the SAML assertion
 6. Present accessible roles to the user (if more than one) and allow them to select the role to assume
 7. Use the STS API to [assume the role](http://docs.aws.amazon.com/cli/latest/reference/sts/assume-role-with-saml.html)
 8. Save the token information to the [AWS credentials file](https://blogs.aws.amazon.com/security/post/Tx3D6U6WSFGOK2H/A-New-and-Standardized-Way-to-Manage-Credentials-in-the-AWS-SDKs)
