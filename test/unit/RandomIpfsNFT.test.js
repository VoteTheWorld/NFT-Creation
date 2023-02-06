const { developmentChains } = require("../../helper-hardhat-config")
const { network, deployments, ethers } = require("hardhat")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("RandomNFT test", function () {
          let RandomNFT, deployer, VRFCoordinatorV2Mock
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mock", "RandomIpfsNFT"])
              RandomNFT = await ethers.getContract("RandomIpfsNFT")
              VRFCoordinatorV2Mock = await ethers.getContract(
                  "VRFCoordinatorV2Mock"
              )
          })

          describe("constructor", function () {
              it("constructor initiated", async () => {
                  const vrfCoordinator = await RandomNFT.getVrfCoordinator()
                  const tokenURI0 = await RandomNFT.getDogTokenUris(0)
                  assert(tokenURI0.includes("ipfs://"))
                  assert.equal(vrfCoordinator, VRFCoordinatorV2Mock.address)
              })
          })
          describe("NFT mint", () => {
              it("revert when the money is not enough", async function () {
                  const fee = await RandomNFT.getMintFee()
                  await expect(
                      RandomNFT.requestNFT({
                          value: fee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETH")
              })

              it("emits an event and kicks off a random word request", async () => {
                  const mintFee = await RandomNFT.getMintFee()
                  await expect(
                      RandomNFT.requestNFT({
                          value: mintFee.toString(),
                      })
                  ).to.emit(RandomNFT, "NftRequested")
              })
          })

          describe("fullfill random words", () => {
              it("mints NFT after random number is returned", async () => {
                  await new Promise(async (resolve, reject) => {
                      RandomNFT.once("NftMinted", async () => {
                          try {
                              const tokenUri = await RandomNFT.tokenURI("0")
                              const tokenCounter =
                                  await RandomNFT.getTokenCounter()
                              assert(tokenUri.toString().includes("ipfs://"))
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (e) {
                              console.log(e)
                              reject(e)
                          }
                      })

                      const fee = await RandomNFT.getMintFee()
                      const requestNftResponse = await RandomNFT.requestNFT({
                          value: fee.toString(),
                      })
                      const requestNftReceipt = await requestNftResponse.wait(1)
                      await VRFCoordinatorV2Mock.fulfillRandomWords(
                          requestNftReceipt.events[1].args.requestId,
                          RandomNFT.address
                      )
                  })
              })
          })
      })
