const client_url = process.env.CLIENT_URL || 'http://localhost:3000'

module.exports = {
  accessKey: 'F8BBA842ECF85',
  secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
  orderInfo: 'pay with MoMo',
  partnerCode: 'MOMO',
  redirectUrl: `${client_url}/order-successfully`,
  ipnUrl: 'https://91ef-116-111-14-167.ngrok-free.app/callback', //chú ý: cần dùng ngrok thì momo mới post đến url này được
  requestType: 'payWithATM',
  extraData: '',
  orderGroupId: '',
  autoCapture: true,
  lang: 'vi',
}
