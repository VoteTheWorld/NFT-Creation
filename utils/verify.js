const { run, log } = require("hardhat")

const verify = async (contractAddress, args) => {
    log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            log("Already verified!")
        } else {
            log(e)
        }
    }
}

module.exports = {
    verify,
}
