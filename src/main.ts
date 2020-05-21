function main() {
    const lock = LockService.getScriptLock()
    if (lock.tryLock(60000)) {
        doDiscordWebhook()
    }
}