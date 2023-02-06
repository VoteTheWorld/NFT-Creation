const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = []
    const waitBlockComfirmation = developmentChains.includes(network.name)
        ? 1
        : network.config.blockConfirmations

    const BasicNFT = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: waitBlockComfirmation,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(BasicNFT.address, args)
    }
}

module.exports.tags = ["all", "main", "BasicNFT"]
