import * as React from 'react'
import { FieldOptions } from './AddFilterDropdown'

interface Props {
    filterType: FieldOptions
    onClicked: (field: FieldOptions) => void
}
export default class AddFilterButton extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props)
    }

    public render(): JSX.Element | null {
        return (
            <>
                <button
                    type="button"
                    className="btn"
                    onClick={this.onAddFilterClicked}
                >{`+${this.props.filterType}`}</button>
            </>
        )
    }

    private onAddFilterClicked = () => {
        this.props.onClicked(this.props.filterType)
    }
}