const { developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")

const BASE_FEE = "250000000000000000"
const GAS_PRICE_LINK = 1e9
const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = await deployments
    const { deployer } = await getNamedAccounts()
    const args1 = [BASE_FEE, GAS_PRICE_LINK]
    const args2 = [DECIMALS, INITIAL_PRICE]

    if (developmentChains.includes(network.name)) {
        log("deploying mocks...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args1,
            log: true,
        })

        await deploy("MockV3Aggregator", {
            from: deployer,
            args: args2,
            log: true,
        })
        log("mock deployed!")
        log("-------------------------------")
    }
}

module.exports.tags = ["all", "main", "mock"]
