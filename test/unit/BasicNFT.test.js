const { network, ethers, deployments, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNFT function test", function () {
          let BasicNFT, deployer
          beforeEach(async () => {
              //   const { deployer } = await getNamedAccounts()
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["BasicNFT"])
              BasicNFT = await ethers.getContract("BasicNFT")
          })

          describe("constructor", async () => {
              it("initalize the NFT right.", async () => {
                  const name = await BasicNFT.name()
                  const symbol = await BasicNFT.symbol()
                  const tokenCounter = await BasicNFT.getTokenCounter()
                  assert.equal(name, "shensixian")
                  assert.equal(symbol, "ssx")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })
          describe("mint function", async () => {
              beforeEach(async () => {
                  const mintTx = await BasicNFT.mintNFT()
                  await mintTx.wait(1)
              })

              it("users can mint and update correctly.", async () => {
                  const tokenURI = await BasicNFT.tokenURI(0)
                  const token_uri = await BasicNFT.TOKEN_URI()
                  const tokenCounter = await BasicNFT.getTokenCounter()

                  assert.equal(tokenURI, token_uri)
                  assert.equal(tokenCounter, 1)
              })

              it("show correct balance.", async () => {
                  const deployerAddress = deployer.address
                  const deployerBalance = await BasicNFT.balanceOf(
                      deployerAddress
                  )
                  const owner = await BasicNFT.ownerOf("0")

                  assert.equal(deployerBalance, 1)
                  assert.equal(owner, deployerAddress)
              })
          })
      })
