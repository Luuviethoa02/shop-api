const jwt = require('jsonwebtoken')
const { parse, isBefore, isAfter } = require('date-fns')

const formatResponse = (code, message, data = null) => {
  return {
    statusCode: code,
    message,
    data: data,
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

const checkDateStatus = (startDate, endDate) => {
  const dateFormat = 'MMMM do, yyyy HH:mm:ss'
  const now = new Date() // Lấy thời gian hiện tại

  const parsedStartDate = parse(startDate, dateFormat, new Date())
  const parsedEndDate = parse(endDate, dateFormat, new Date())

  if (isBefore(now, parsedStartDate)) {
    // Nếu hiện tại nhỏ hơn startDate, trạng thái là 'inactive'
    return 'inactive'
  } else if (isBefore(now, parsedEndDate) && isAfter(now, parsedStartDate)) {
    // Nếu hiện tại nằm giữa startDate và endDate, trạng thái là 'active'
    return 'active'
  } else {
    // Nếu hiện tại lớn hơn endDate, trạng thái là 'expired'
    return 'expired'
  }
}

module.exports = { formatResponse, gennarateToken, checkDateStatus }
