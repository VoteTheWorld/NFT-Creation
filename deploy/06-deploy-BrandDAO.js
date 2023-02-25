const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const {
    storeImages,
    storeTokenUriMetadata,
} = require("../utils/uploadToPinata")
const { network, ethers } = require("hardhat")

const imagesLocation = "./images/Brand3NFT/"
const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Rarity",
            value: 100,
        },
    ],
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockComfirmation = developmentChains.includes(network.name)
        ? 1
        : network.config.blockConfirmations

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    const BrandNFT = await deploy("Brand3DAO", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: waitBlockComfirmation,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(BrandNFT.address, [])
    }
}
async function handleTokenUris() {
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    )
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(
            ".png",
            ""
        )
        tokenUriMetadata.description = `This is our first stop where we will define our Label regarding name choices, find logo inspiration and branding messages. For example, you can propose: An elevated d-physical web3 community brand depicted by web3 natives, co-led by the tasteful community that is geek, bizarre and luxury. (It is aaa d-physical brand that is geek, bizarre and luxury for the web3 nomads)`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(
            tokenUriMetadata
        )
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris
}

module.exports.tags = ["all", "main", "brand"]
