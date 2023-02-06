const { ethers, network } = require("hardhat")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //mint basic
    const BasicNFT = await ethers.getContract("BasicNFT", deployer)
    const mingTx1 = await BasicNFT.mintNFT()
    await mingTx1.wait(1)
    console.log(`basicNFT index0 tokenURI is ${await BasicNFT.tokenURI(0)}`)

    //mint Dynamic
    const highValue = ethers.utils.parseEther("2000")
    const DynamicSvgNFT = await ethers.getContract("DynamicSvgNFT", deployer)
    const mintTx2 = await DynamicSvgNFT.mintNft(highValue)
    await mintTx2.wait(1)
    console.log(
        `DynamicNFT index0 tokenURI is ${await DynamicSvgNFT.tokenURI(0)}`
    )

    //mint RandomNFT
    const RandomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer)
    const mintFee = await RandomIpfsNFT.getMintFee()
    const mintTx3 = await RandomIpfsNFT.requestNFT({
        value: mintFee.toString(),
        gasLimit: 3e7,
    })
    const TxRecipt = await mintTx3.wait(1)

    await new Promise(async (resolve, reject) => {
        setTimeout(
            () => reject("Timeout: 'NftMinted' event did not fire"),
            300000
        )
        RandomIpfsNFT.once("NftMinted", async () => {
            console.log(
                `RandomIPFSNFT index0 tokenURI is ${await RandomIpfsNFT.tokenURI(
                    0
                )}`
            )
            resolve()
        })
        if (chainId == 31337) {
            const requestId = TxRecipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract(
                "VRFCoordinatorV2Mock",
                deployer
            )
            await vrfCoordinatorV2Mock.fulfillRandomWords(
                requestId,
                RandomIpfsNFT.address
            )
        }
    })
}

module.exports.tags = ["mint", "all"]
