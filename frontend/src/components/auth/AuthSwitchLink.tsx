type AuthSwitchLinkProps = {
  text: string
  actionText: string
  onSwitch: () => void
}

export function AuthSwitchLink({ text, actionText, onSwitch }: AuthSwitchLinkProps) {
  return (
    <p className="auth-switch">
      {text}{' '}
      <button type="button" className="auth-switch-button" onClick={onSwitch}>
        {actionText}
      </button>
    </p>
  )
}
