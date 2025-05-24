export  const getTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const jwtCookie = cookies.find(row => row.startsWith('jwt_token='));
  return jwtCookie ? jwtCookie.split('=')[1] : null;
};