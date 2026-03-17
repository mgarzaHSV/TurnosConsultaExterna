app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.session.user = data;
  } catch {}
  next();
});