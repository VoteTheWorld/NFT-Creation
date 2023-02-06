const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    chainId = network.config.chainId
    const waitBLockConfirmation = developmentChains.includes(network.name)
        ? 1
        : network.config.blockConfirmations

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const MockAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = MockAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeedAddress
    }

    const lowSVG = fs.readFileSync("./images/dynamicNft/frown.svg", {
        encoding: "utf8",
    })
    const highSVG = fs.readFileSync("./images/dynamicNft/happy.svg", {
        encoding: "utf8",
    })

    args = [ethUsdPriceFeedAddress, lowSVG, highSVG]

    const RandomIpfsNFT = await deploy("DynamicSvgNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: waitBLockConfirmation,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(RandomIpfsNFT.address, args)
    }
}

module.exports.tags = ["all", "main", "DynamicSvgNFT"]
