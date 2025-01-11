//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MusicNFTMarketplace is ERC721("MELO","MAPP"), Ownable {
    string public baseURI = 
    "https://black-cheap-basilisk-940.mypinata.cloud/ipfs/QmdHXYnGCkRf1vgCUEWxMz2HcBZKztZ4ZPmg5JcYC4vvm9/";
    string public baseExtension = ".json";
    address public artist;
    uint256 public royaltyFee;
    uint256 public mintingFee;
    uint256 private _totalSupply;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        address owner;
    }
    MarketItem[] public marketItems;

    // Maps each NFT token to its meta data and stores it
    mapping(uint256 => string) public nftData;

    event MarketItemBought(
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );
    event MarketItemRelisted(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTMinted(
        uint256 indexed tokenId, 
        address indexed minter, 
        string data
    );


    // Initializes the values at the beginning
    constructor(
        uint256 _royaltyFee,
        address _artist,
        uint256[] memory _prices,
        uint256 _mintingFee
    ) payable {
        _totalSupply = 0;
        require(
            _prices.length * _royaltyFee <= msg.value,
            "Deployer must pay royalty fee for each token listed on the marketplace"
        );
        royaltyFee = _royaltyFee;
        artist = _artist;
        mintingFee = _mintingFee;
        for (uint8 i = 0; i < _prices.length; i++) {
            require(_prices[i] > 0, "Price must be greater than 0");
            _mint(address(this), i);
            marketItems.push(MarketItem(i, payable(msg.sender), _prices[i], address(0)));
            _totalSupply++;
        }
    }

    // allows users to mint NFTs (payable to cover minting fee)
  function mintNFT(string memory _data, uint256 _price) public payable {
    require(msg.value >= mintingFee, "Insufficient funds for minting");
    uint256 newTokenId = _totalSupply;
    _mint(msg.sender, newTokenId);
    nftData[newTokenId] = _data;  // Store user-provided NFT data
    marketItems.push(MarketItem(newTokenId, payable(msg.sender), _price, msg.sender));
    _totalSupply++;
    emit NFTMinted(newTokenId, msg.sender, _data);
}

    /* Updates the royalty fee of the contract */
    function updateRoyaltyFee(uint256 _royaltyFee) external onlyOwner {
        royaltyFee = _royaltyFee;
    }

    /* Creates the sale of a music nft listed on the marketplace */
    /* Transfers ownership of the nft, as well as funds between parties */
    function buyToken(uint256 _tokenId) external payable {
        uint256 price = marketItems[_tokenId].price;
        address seller = marketItems[_tokenId].seller;
        require(
            msg.value == price,
            "Please send the asking price in order to complete the purchase");
        require(msg.sender != marketItems[_tokenId].owner, "The person who relisted the item cannot buy it back");
        marketItems[_tokenId].seller = payable(address(0));
        _transfer(address(this), msg.sender, _tokenId);
        payable(artist).transfer(royaltyFee);
        payable(seller).transfer(msg.value);
        marketItems[_tokenId].owner = msg.sender;
        emit MarketItemBought(_tokenId, seller, msg.sender, price);
    }

    /* Allows someone to resell their music nft */
    function resellToken(uint256 _tokenId, uint256 _price) external payable {
        uint256 limitPrice = marketItems[_tokenId].price + (marketItems[_tokenId].price / 2);
        require(msg.value == royaltyFee, "Must pay royalty");
        require(_price > 0 , "Price must be greater than zero");
        require(_price < limitPrice , "Price must be lesser than 1.5 times of original price");
        marketItems[_tokenId].price = _price;
        marketItems[_tokenId].seller = payable(msg.sender);
        _transfer(msg.sender, address(this), _tokenId);
        emit MarketItemRelisted(_tokenId, msg.sender, _price);
    }

    /* Fetches all the tokens currently listed for sale */
    function getAllUnsoldTokens() external view returns (MarketItem[] memory) {
        uint256 unsoldCount = balanceOf(address(this));
        MarketItem[] memory tokens = new MarketItem[](unsoldCount);
        uint256 currentIndex;
        for (uint256 i = 0; i < marketItems.length; i++) {
            if (marketItems[i].seller != address(0)) {
                tokens[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return (tokens);
    }
    /* Fetches all the tokens owned by the user */
    function getMyTokens() external view returns (MarketItem[] memory) {
        uint256 myTokenCount = balanceOf(msg.sender);
        MarketItem[] memory tokens = new MarketItem[](myTokenCount);
        uint256 currentIndex;
        for (uint256 i = 0; i < marketItems.length; i++) {
            if (ownerOf(i) == msg.sender) {
                tokens[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return (tokens);
    }
    /* Internal function that gets the baseURI initialized in the constructor */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function getTotalSupply() public view returns (uint256) {
        return _totalSupply;
    }
}
