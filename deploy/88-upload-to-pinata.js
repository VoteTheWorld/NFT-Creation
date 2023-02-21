const {
    storeImages,
    storeTokenUriMetadata,
} = require("../utils/uploadToPinata")
const { network, ethers } = require("hardhat")

const imagesLocation = "./images/Brand3NFT/" //change the image file
const metadataTemplate = {
    //change the metadata
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
}

async function handleTokenUris() {
    tokenUris = []
    const { responses: imageUploadResponses, files } = await storeImages(
        imagesLocation
    )
    for (imageUploadResponseIndex in imageUploadResponses) {
        // change the metadata
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

module.exports.tags = ["all", "main", "pinata"]
