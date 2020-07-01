import { config as awsConfig, Credentials, ECSCredentials, TemporaryCredentials } from 'aws-sdk'
import { Mode, CredentialProviderSource } from 'aws-cdk'

const { green } = require('colors')

const SUB_ACCOUNT_ACCESS_ROLE = 'OrganizationSubAccountAccessRole'

/**
 * Provides temporary credentials used by CDK to access AWS accounts.
 * Notes:
 * - `SUB_ACCOUNT_ACCESS_ROLE` is created by AWS Organizations upon creation of the account.
 */
export class OrganizationAccountCredentialProviderSource implements CredentialProviderSource {
    name = 'SubAccountCredentialProviderSource'

    private readonly _credentials: Credentials

    constructor() {
        if (awsConfig.credentials) {
            this._credentials = awsConfig.credentials as Credentials
        } else {
            this._credentials = new ECSCredentials({
                httpOptions: { timeout: 5000 },
                maxRetries: 10,
            })
        }
    }

    async isAvailable() {
        return true
    }

    async canProvideCredentials(_accountId: string): Promise<boolean> {
        return true
    }

    async getProvider(accountId: string, mode: Mode) {
        const roleArn = `arn:aws:iam::${accountId}:role/${SUB_ACCOUNT_ACCESS_ROLE}`
        console.log('\n')
        console.log(` 🚀  Using role ${green(roleArn)} for account ${green(accountId)} in mode ${green(Mode[mode])}`)
        console.log('\n')

        await this._credentials.getPromise()
        return new TemporaryCredentials({
            RoleArn: roleArn,
            RoleSessionName: accountId
        }, this._credentials)
    }
}
