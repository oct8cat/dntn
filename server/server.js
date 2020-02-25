const Koa = require("koa")
const cors = require("@koa/cors")
const bodyParser = require("koa-bodyparser")
const static = require("koa-static")
const Router = require("koa-router")
const { Mongoose } = require("mongoose")
const path = require("path")

const staticDir = path.resolve(__dirname, "public")
const currencies = ["USD", "EUR", "GBP", "RUB"]
const ERR_BAD_AMOUNT = `"amount" should be a positive number`
const ERR_BAD_CURRENCY = `"currency" should be one of ${currencies.join(", ")}`

const main = async () => {
  const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dntn"
  const db = makeDb()
  const app = makeApp(db)
  await db.connect(dbUrl)
  app.listen(3000, () => console.log("App running on http://localhost:3000"))
}

const makeDb = () => {
  const db = new Mongoose({ useNewUrlParser: true, useUnifiedTopology: true })
  const Donation = new db.Schema({
    amount: { type: "Number", required: true },
    currency: { type: "String", required: true }
  })
  db.model("Donation", Donation)
  return db
}

const makeApp = db => {
  const app = new Koa()
  app.context.db = db
  app.use(cors())
  app.use(bodyParser())
  app.use(static(staticDir))
  const router = new Router()
  router.post("/donate", handleDonate)
  app.use(router.routes())
  return app
}

const handleDonate = async ctx => {
  const { amount, currency } = ctx.request.body
  ctx.assert(+amount > 0, 400, ERR_BAD_AMOUNT)
  ctx.assert(currencies.includes(currency), 400, ERR_BAD_CURRENCY)
  const donation = await ctx.db.model("Donation").create({ amount, currency })
  console.log("Added donation", donation)
  ctx.body = { ok: true }
}

if (require.main === module) {
  main()
}
