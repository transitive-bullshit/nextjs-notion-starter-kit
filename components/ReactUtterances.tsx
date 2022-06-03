import React from 'react'

import styles from './styles.module.css'

export type MappingType =
  | 'pathname'
  | 'url'
  | 'title'
  | 'og:title'
  | 'issue-number'
  | 'issue-term'

export type Theme =
  | 'github-light'
  | 'github-dark'
  | 'preferred-color-scheme'
  | 'github-dark-orange'
  | 'icy-dark'
  | 'dark-blue'
  | 'photon-dark'

interface ReactUtterancesProps {
  repo: string
  issueMap: MappingType
  issueTerm?: string
  issueNumber?: number
  label?: string
  theme: Theme
}

interface ReactUtterancesState {
  pending: boolean
}

export class ReactUtterances extends React.Component<
  ReactUtterancesProps,
  ReactUtterancesState
> {
  reference: React.RefObject<HTMLDivElement>
  scriptElement: any

  constructor(props: ReactUtterancesProps) {
    super(props)

    if (props.issueMap === 'issue-term' && props.issueTerm === undefined) {
      throw Error(
        "Property 'issueTerm' must be provided with issueMap 'issue-term'"
      )
    }

    if (props.issueMap === 'issue-number' && props.issueNumber === undefined) {
      throw Error(
        "Property 'issueNumber' must be provided with issueMap 'issue-number'"
      )
    }

    this.reference = React.createRef<HTMLDivElement>()
    this.state = { pending: true }
  }

  UNSAFE_componentWillReceiveProps(props) {
    // this.scriptElement.setAttribute('theme', props.theme)
    const iframe = document.querySelector('iframe.utterances-frame') as any

    if (iframe) {
      iframe.contentWindow.postMessage(
        { type: 'set-theme', theme: props.theme },
        'https://utteranc.es/'
      )
    }
  }

  componentDidMount(): void {
    const { repo, issueMap, issueTerm, issueNumber, label, theme } = this.props
    const scriptElement = document.createElement('script')
    scriptElement.src = 'https://utteranc.es/client.js'
    scriptElement.async = true
    scriptElement.defer = true
    scriptElement.setAttribute('repo', repo)
    scriptElement.setAttribute('crossorigin', 'annonymous')
    scriptElement.setAttribute('theme', theme)
    scriptElement.onload = () => this.setState({ pending: false })

    if (label) {
      scriptElement.setAttribute('label', label)
    }

    if (issueMap === 'issue-number') {
      scriptElement.setAttribute('issue-number', issueNumber.toString())
    } else if (issueMap === 'issue-term') {
      scriptElement.setAttribute('issue-term', issueTerm)
    } else {
      scriptElement.setAttribute('issue-term', issueMap)
    }

    // TODO: Check current availability
    this.scriptElement = scriptElement
    this.reference.current.appendChild(scriptElement)
  }

  render(): React.ReactElement {
    return (
      <div className={styles.comments}>
        <div className={styles.utterances} ref={this.reference}>
          {this.state.pending && <p>Loading Comments...</p>}
        </div>
      </div>
    )
  }
}
