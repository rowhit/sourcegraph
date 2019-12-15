import * as React from 'react'
import { Link } from '../../../shared/src/components/Link'
import { ALL_EXTERNAL_SERVICE_ADD_VARIANTS, GITHUB_EXTERNAL_SERVICE } from '../site-admin/externalServices'
import { ExternalServiceCard } from '../components/ExternalServiceCard'
import { SiteAdminAddExternalServicesPage } from '../site-admin/SiteAdminAddExternalServicesPage'
import * as GQL from '../../../shared/src/graphql/schema'

/**
 * The explore area, which shows cards containing summaries and actions from product features. The purpose of it is
 * to expose information at a glance and make it easy to navigate to features (without requiring them to add a link
 * on the space-constrained global nav).
 */
// eslint-disable-next-line react/prefer-stateless-function
export class WelcomePage extends React.Component<{}, {}> {
    public render(): JSX.Element | null {
        return (
            <div className="welcome-page">
                <div className="welcome-page__content">
                    <h1>
                        <img
                            className="welcome-page__logo"
                            src={`${window.context.assetsRoot}/img/sourcegraph-mark.svg`}
                        />
                        Welcome to Sourcegraph!
                    </h1>
                    <p>You are moments away from having the universe of code at your fingertips...</p>
                    <Link to="/asdf-welcome/add-repositories">
                        <button className="btn btn-primary btn-block" type="submit">
                            Let's get started
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

interface WelcomeAddReposPageProps {}
interface WelcomeAddReposPageState {}

export class WelcomeAddReposPage extends React.Component<WelcomeAddReposPageProps, WelcomeAddReposPageState> {
    public state: WelcomeAddReposPageState = {}

    public render(): JSX.Element | null {
        const externalServices = ALL_EXTERNAL_SERVICE_ADD_VARIANTS.filter(
            s => s.kind !== GQL.ExternalServiceKind.PHABRICATOR
        ).map(s => ({ ...s, shortDescription: undefined }))

        // const externalServices = externalServiceADdVar

        return (
            <div className="welcome-page-left">
                <div className="welcome-page-left__content">
                    <h2 className="welcome-page-left__content-header">
                        Where are the repositories you&rsquo;d like Sourcegraph to index?
                    </h2>

                    {externalServices.map((service, i) => (
                        <div className="add-external-services-page__card" key={i}>
                            <ExternalServiceCard
                                to={SiteAdminAddExternalServicesPage.getAddURL(service)}
                                {...service}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

// const onboarding
