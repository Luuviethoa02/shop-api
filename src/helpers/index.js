const jwt = require('jsonwebtoken')

const formatResponse = (code, message, data = undefined) => {
  return {
    code,
    message,
    data,
  }
}

const gennarateToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      admin: user.admin,
    },
    process.env.TOKEN_ACCESS_KEY,
    {
      expiresIn: process.env.TOKEN_LIFE || '1h',
    }
  )

  const refreshToken = jwt.sign(
    {
      id: user._id,
      admin: user.admin,
    },
    process.env.TOKEN_REFRESH_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFE || '10d',
    }
  )

  return { accessToken, refreshToken }
}

module.exports = { formatResponse, gennarateToken }
