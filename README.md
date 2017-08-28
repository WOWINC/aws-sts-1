# AWS STS Token Generator
 
 ### This is a fork of https://github.com/meetearnest/aws-sts.  It has been modified to work with our account setup, which requires a different
 app url for each account.   

Single Sign on within AWS removes the ability to generate long-lived access tokens for AWS. Instead, the 
[Amazon Security Token Service](http://docs.aws.amazon.com/STS/latest/APIReference/Welcome.html) is used to generate 
short-lived tokens.

This command line utility can be used to authenticate with an SSO provider (ex: Okta) and generate access token credentials.
It supports assuming an AWS role and will automatically update your AWS CLI credentials file with the new credentials.
 
## Configuration

Configuration is done by creating a config.json file in the cfg directory. An [example template](./cfg/config.example.json) is provided.
 
```
awsConfigPath:    Path to the user AWS CLI credential file. The recommended path is the path to the Docker container's credential path.
outputFormat:     Output format of AWS access token credentials
region:           Region used for AWS API calls
provider:         Name of the SAML provider to use for authentication
defaultAccount:   Default AWS account to use when one is not specified via the command line
accounts:         Hash of name/idPEntryUrl pairs for accounts which can be switched to. (idpEntrpUrla is the  URL to access the form-based authentication login for the provider fot the account)
```

## Installation

To install:
1. Clone this Repo
2. install the dependencies: ```npm instal```
3. run the [`aws-token.sh`](./aws-token.sh) script at the root of your repository. use the --account switch to selecgt an account to log in to.  
``` ./aws-token.sh --account account-name ```

## Usage

`````
$> ./aws-token.sh --help
usage: index.js [-h] [-v] [--username USERNAME] [--password PASSWORD]
                [--role ROLE]
                [--account {staging,development}]
                [--profile PROFILE]


AWS STS Token Generator

Optional arguments:
  -h, --help            Show this help message and exit.
  -v, --version         Show program's version number and exit.
  --username USERNAME   Okta username (ex. user@meetearnest.com)
  --password PASSWORD   Okta password
  --role ROLE           Name of SAML role to assume
  --account {staging,development}
                        Name of account to switch to. Defaults to "staging".
  --profile PROFILE     Profile name that the AWS credentials should be saved
                        as. Defaults to the name of the account and role specified.
`````

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

