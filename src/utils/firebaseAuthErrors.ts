export const getFirebaseAuthErrorMessage = (error: unknown): string => {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'That email and password did not match. Check them and try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email. Try logging in instead.';
    case 'auth/weak-password':
      return 'Choose a stronger password with at least 6 characters.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'The Google sign-in window was closed before sign-in finished.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.';
    case 'auth/unauthorized-domain':
      return 'This website domain is not yet allowed in Firebase Authentication. Add it under Firebase Console → Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled yet. Enable Email/Password and Google in Firebase Console → Authentication → Sign-in method.';
    case 'auth/too-many-requests':
      return 'There have been too many attempts. Wait a little and try again.';
    case 'auth/network-request-failed':
      return 'The connection failed. Check your internet and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account with this email already uses another sign-in method. Log in with that method first.';
    default:
      return 'We could not complete sign-in right now. Please try again.';
  }
};
