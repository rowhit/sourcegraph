import * as React from 'react'

interface Props {}
interface State {}

/**
 * The explore area, which shows cards containing summaries and actions from product features. The purpose of it is
 * to expose information at a glance and make it easy to navigate to features (without requiring them to add a link
 * on the space-constrained global nav).
 */
export class WelcomePage extends React.Component<Props, State> {
    public state: State = {}

    public render(): JSX.Element | null {
        console.log('# HERE')
        return <div>Welcome to Sourcegraph</div>
    }
}
