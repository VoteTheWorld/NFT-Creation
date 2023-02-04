const { developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = await deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
            waitConfirmations: 1,
        })
        log("mock deployed!")
        log("-------------------------------")
    }
}

module.exports.tags = ["main", "mock"]
