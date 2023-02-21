const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockComfirmation = developmentChains.includes(network.name)
        ? 1
        : network.config.blockConfirmations

    const SVG = fs.readFileSync("./images/Brand3NFT/Brand3DAO.svg", {
        encoding: "utf8",
    })

    const BrandNFT = await deploy("Brand3DAO", {
        from: deployer,
        args: [SVG],
        log: true,
        waitConfirmations: waitBlockComfirmation,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(BrandNFT.address, [SVG])
    }
}

module.exports.tags = ["all", "main", "brandSvg"]
