/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'admin') return '/home'
  if (role === 'jobseeker') return '/jobseeker/dashboard'
  if (role === 'recruiter') return 'recruiter/dashboard'
  else return '/home'
}

export default getHomeRoute
