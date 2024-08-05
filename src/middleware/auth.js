const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { formatResponse } = require('../helpers')

const Authorization = (req, res, next) => {
  const token = req?.headers?.authorization?.split(' ')[1]
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        formatResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
      )
  }
  jwt.verify(token, process.env.TOKEN_ACCESS_KEY, (err, user) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          formatResponse(
            StatusCodes.UNAUTHORIZED,
            err || err?.mesage || ReasonPhrases.UNAUTHORIZED
          )
        )
    }
    req.user = user
    next()
  })
}

module.exports = Authorization
