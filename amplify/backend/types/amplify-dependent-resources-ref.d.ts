export type AmplifyDependentResourcesAttributes = {
    "api": {
        "AdminQueries": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "presolvedteamsadmin": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        },
        "PresolvedClientAPI": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "auth": {
        "presolvedteamsadmine76efdae": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        },
        "userPoolGroups": {
            "p3fAdminGroupRole": "string",
            "p3fSupportGroupRole": "string",
            "tenantAdminGroupRole": "string",
            "tenantSupervisorGroupRole": "string",
            "tenantUserGroupRole": "string"
        }
    },
    "function": {
        "AdminQueriescecc2b38": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        },
        "MSTeamsClientsAPI": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        },
        "downloadPSTNCallLogs": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        },
        "ItemsHandler": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string",
            "LambdaExecutionRoleArn": "string"
        }
    },
    "hosting": {
        "S3AndCloudFront": {
            "Region": "string",
            "HostingBucketName": "string",
            "WebsiteURL": "string",
            "S3BucketSecureURL": "string",
            "CloudFrontDistributionID": "string",
            "CloudFrontDomainName": "string",
            "CloudFrontSecureURL": "string",
            "CloudFrontOriginAccessIdentity": "string"
        }
    }
}