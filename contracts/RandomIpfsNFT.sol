// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__NeedMoreETH();
error RandomIpfsNft__TransferFailed();

contract RandomIpfsNFT is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    enum breed {
        PUG,
        SHIBA_INU,
        ST_BERNARD
    }

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    string[] private s_tokenURI;
    uint256 private immutable i_mintFee;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    mapping(uint256 => address) public requestOwner;

    uint256 private s_tokenCounter;
    uint private constant MAX_CHANCE = 100;

    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(breed dogBreed, address minter);

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint32 callbackGasLimit,
        string[3] memory tokenURI,
        uint256 mintFee
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("IPFSNFT", "NFTT") {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_tokenCounter = 0;
        s_tokenURI = tokenURI;
        i_mintFee = mintFee;
    }

    function requestNFT() public payable {
        if (msg.value < i_mintFee) {
            revert RandomIpfsNft__NeedMoreETH();
        }
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        requestOwner[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address owner = requestOwner[requestId];
        uint tokenId = s_tokenCounter;
        uint256 moddedRng = randomWords[0] % MAX_CHANCE;
        breed dogBreed = getBreedfromModdedRng(moddedRng);
        _safeMint(owner, tokenId);
        _setTokenURI(tokenId, s_tokenURI[uint256(dogBreed)]);
        s_tokenCounter++;
        emit NftMinted(dogBreed, owner);
    }

    function getBreedfromModdedRng(
        uint256 moddedRng
    ) public pure returns (breed) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArray = getChance();
        for (uint256 i = 0; i < chanceArray.length; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i + 1]) {
                return breed(i);
            }
            cumulativeSum = chanceArray[i + 1];
        }
        revert RandomIpfsNft__RangeOutOfBounds();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert RandomIpfsNft__TransferFailed();
        }
    }

    function getChance() public pure returns (uint256[3] memory) {
        return [10, 30, MAX_CHANCE];
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getDogTokenUris(
        uint256 index
    ) public view returns (string memory) {
        return s_tokenURI[index];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
