import outputs from "../../amplify_outputs.json"

export const cognitoAuthConfig = {
  authority: `https://cognito-idp.${outputs.auth.aws_region}.amazonaws.com/${outputs.auth.user_pool_id}`,
  client_id: outputs.auth.user_pool_client_id,
  redirect_uri: window.origin,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid phone profile",
}

export const onSignIn = () => {
  window.history.replaceState({}, document.title, window.location.pathname)
}
