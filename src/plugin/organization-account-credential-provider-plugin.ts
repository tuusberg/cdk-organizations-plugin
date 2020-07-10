import { OrganizationAccountCredentialProviderSource } from './organization-account-credential-provider-source'
import { Plugin, PluginHost } from 'aws-cdk'

/**
 * Registers the credential provider source with the CDK.
 * Implements cdk.Plugin.
 */
export class OrganizationAccountCredentialProviderPlugin implements Plugin {
    version: '1'

    init(host: PluginHost) {
        host.registerCredentialProviderSource(new OrganizationAccountCredentialProviderSource())
    }
}

