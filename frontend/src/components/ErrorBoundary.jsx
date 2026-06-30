import { Component } from "react"

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface the crash in the console for debugging
    console.error("Page crashed:", error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, gap: 16 }}>
          <i className="fas fa-triangle-exclamation" style={{ fontSize: "2rem", color: "var(--pink)" }} />
          <h2 style={{ fontFamily: "'Bodoni Moda', serif", color: "var(--dark)" }}>Something went wrong</h2>
          <p style={{ color: "var(--muted)", maxWidth: 420 }}>
            This page hit an error. Please refresh — if it keeps happening, let us know.
          </p>
          <button className="btn btn-pink" onClick={() => { this.setState({ error: null }); window.location.reload() }}>
            Reload
          </button>
          <pre style={{ marginTop: 12, fontSize: "0.72rem", color: "var(--muted)", maxWidth: "90vw", overflow: "auto", whiteSpace: "pre-wrap" }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
