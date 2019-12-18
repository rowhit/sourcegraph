import * as H from 'history'
import * as React from 'react'
import { Link } from '../../../shared/src/components/Link'
import { ExternalServiceCard } from '../components/ExternalServiceCard'
import { onboardingExternalServices, ExternalServiceKindMetadata } from '../site-admin/externalServices'
import { map } from 'lodash'
import { PageTitle } from '../components/PageTitle'
import { Markdown } from '../../../shared/src/components/Markdown'
import { renderMarkdown } from '../../../shared/src/util/markdown'
import { SiteAdminExternalServiceForm } from '../site-admin/SiteAdminExternalServiceForm'
import * as GQL from '../../../shared/src/graphql/schema'
import { Subject, Subscription } from 'rxjs'
import { switchMap, catchError, tap } from 'rxjs/operators'
import { addExternalService } from '../site-admin/SiteAdminAddExternalServicePage'
import { refreshSiteFlags } from '../site/backend'
import { ThemeProps } from '../../../shared/src/theme'

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
                    <Link to="/asdf-welcome/select-code-host">
                        <button className="btn btn-primary btn-block" type="submit">
                            Let's get started
                        </button>
                    </Link>
                </div>
            </div>
        )
    }
}

interface WelcomeAddReposPageProps {
    history: H.History
    eventLogger: {
        logViewEvent: (event: 'AddExternalService') => void
        log: (event: 'AddExternalServiceFailed' | 'AddExternalServiceSucceeded', eventProperties?: any) => void
    }
}
interface WelcomeAddReposPageState {}

export class WelcomeAddReposPage extends React.Component<WelcomeAddReposPageProps, WelcomeAddReposPageState> {
    public state: WelcomeAddReposPageState = {}

    public render(): JSX.Element | null {
        const externalServices = onboardingExternalServices

        const id = new URLSearchParams(this.props.history.location.search).get('id')
        if (id) {
            const externalService = externalServices[id]
            if (externalService) {
                return (
                    <WelcomeAddExternalServicePage
                        {...this.props}
                        externalService={externalService}
                        isLightTheme={true}
                    />
                )
            }
        }

        return (
            <div className="welcome-page-left">
                <div className="welcome-page-left__content">
                    <h2 className="welcome-page-left__content-header">
                        Where are the repositories you&rsquo;d like Sourcegraph to index?
                    </h2>

                    {map(externalServices, (externalService, id) => (
                        <div className="add-external-services-page__card" key={id}>
                            <ExternalServiceCard to={`?id=${encodeURIComponent(id)}`} {...externalService} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

interface Props extends ThemeProps {
    history: H.History
    externalService: ExternalServiceKindMetadata
    eventLogger: {
        logViewEvent: (event: 'AddExternalService') => void
        log: (event: 'AddExternalServiceFailed' | 'AddExternalServiceSucceeded', eventProperties?: any) => void
    }
}
interface State {
    config: string

    /**
     * Holds any error returned by the remote GraphQL endpoint on failed requests.
     */
    error?: Error

    /**
     * True if the form is currently being submitted
     */
    loading: boolean

    /**
     * Holds the externalService if creation was successful but produced a warning
     */
    externalService?: GQL.IExternalService
}

export class WelcomeAddExternalServicePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            loading: false,
            config: props.externalService.defaultConfig,
        }
    }

    private submits = new Subject<GQL.IAddExternalServiceInput>()
    private subscriptions = new Subscription()

    public componentDidMount(): void {
        this.props.eventLogger.logViewEvent('AddExternalService')
        this.subscriptions.add(
            this.submits
                .pipe(
                    tap(() => this.setState({ loading: true })),
                    switchMap(input =>
                        addExternalService(input, this.props.eventLogger).pipe(
                            catchError(error => {
                                console.error(error)
                                this.setState({ error, loading: false })
                                return []
                            })
                        )
                    )
                )
                .subscribe(externalService => {
                    if (externalService.warning) {
                        this.setState({ externalService, error: undefined, loading: false })
                    } else {
                        // Refresh site flags so that global site alerts
                        // reflect the latest configuration.
                        // tslint:disable-next-line: rxjs-no-nested-subscribe
                        refreshSiteFlags().subscribe({ error: err => console.error(err) })
                        this.setState({ loading: false })
                        this.props.history.push('/search')
                    }
                })
        )
    }

    public componentWillUnmount(): void {
        this.subscriptions.unsubscribe()
    }

    public render(): JSX.Element | null {
        const createdExternalService = this.state.externalService
        return (
            <div className="welcome-page-left">
                <div className="welcome-page-left__add-code-host-content mb-5">
                    <PageTitle title="Onboarding" />
                    {createdExternalService?.warning ? (
                        <div>
                            {/* <div className="mb-3">
                                <ExternalServiceCard
                                    {...this.props.externalService}
                                    title={createdExternalService.displayName}
                                    shortDescription="Update this external service configuration to manage repository mirroring."
                                    to={`/site-admin/external-services/${createdExternalService.id}`}
                                />
                            </div>
                            <div className="alert alert-warning">
                                <h4>Warning</h4>
                                <Markdown dangerousInnerHTML={renderMarkdown(createdExternalService.warning)} />
                            </div> */}
                            TODO
                        </div>
                    ) : (
                        <div>
                            <Link className="welcome-page-left__back-button" to="/asdf-welcome/select-code-host">
                                &lt; Back
                            </Link>
                            <div className="mb-3">
                                <ExternalServiceCard {...this.props.externalService} />
                            </div>
                            <h2 className="welcome-page-left__content-header">
                                Which repositories would you like to index from{' '}
                                {this.props.externalService.defaultDisplayName}?
                            </h2>
                            {/* TODO: move this to the metadata struct */}
                            <div>
                                <p>
                                    <b>Instructions:</b>
                                </p>
                                <ol>
                                    <li>
                                        <Link
                                            to="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Create a GitHub access token
                                        </Link>{' '}
                                        with <code>repo</code> scope to allow Sourcegraph to clone your repositories.
                                        <br />
                                        (Your repositories never leave this Sourcegraph instance.)
                                    </li>
                                    <li>
                                        Set the value of the <code>token</code> field below to be your GitHub access
                                        token.
                                    </li>
                                    <li>
                                        Set the <code>organizations</code> field to be the list of GitHub organizations
                                        whose repositories Sourcegraph should index.
                                    </li>
                                </ol>
                                <p>
                                    For more advanced configuration options, see{' '}
                                    <Link to="https://docs.sourcegraph.com/admin/external_service/github#configuration">
                                        the docs
                                    </Link>
                                    .
                                </p>
                            </div>
                            <div className="mb-4">{this.props.externalService.longDescription}</div>
                            <SiteAdminExternalServiceForm
                                {...this.props}
                                error={this.state.error}
                                input={this.getExternalServiceInput()}
                                editorActions={this.props.externalService.editorActions}
                                jsonSchema={this.props.externalService.jsonSchema}
                                mode="create"
                                submitName="Next"
                                onSubmit={this.onSubmit}
                                onChange={this.onChange}
                                loading={this.state.loading}
                                hideDisplayNameField={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    private getExternalServiceInput(): GQL.IAddExternalServiceInput {
        return {
            displayName: this.props.externalService.defaultDisplayName,
            config: this.state.config,
            kind: this.props.externalService.kind,
        }
    }

    private onChange = (input: GQL.IAddExternalServiceInput): void => {
        this.setState({
            config: input.config,
        })
    }

    private onSubmit = (event?: React.FormEvent<HTMLFormElement>): void => {
        if (event) {
            event.preventDefault()
        }
        this.submits.next(this.getExternalServiceInput())
    }
}
