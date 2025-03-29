declare module '#auth-utils' {
  interface User {
    email: string
    webauthn?: string | undefined
  }

  interface UserSession {
    loggedInAt: number
  }

  interface SecureSessionData {
    userId: string
  }
}

export {}
