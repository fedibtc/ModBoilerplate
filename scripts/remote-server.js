// Spins up a remote ngrok server that forwards port 3000.
// Can't be used with bun yet since bun isn't compatible with the `got` package yet

const ngrok = require("ngrok")
const qrcode = require("qrcode")

async function runNgrok() {
  const url = await ngrok.connect(3000)
  console.log("\x1b[34mRemote Server opened on", url, "\n")

  const qr = await qrcode.toString(url, { type: "terminal", small: true })
  console.log(
    qr
      .split("\n")
      .map(line => "  " + line)
      .join("\n"),
  )

  // Keep the ngrok tunnel running until manually stopped
  await new Promise(() => {})
}

runNgrok().catch(console.error)

process.on("SIGINT", async () => {
  await ngrok.disconnect()
  process.exit(0)
})
