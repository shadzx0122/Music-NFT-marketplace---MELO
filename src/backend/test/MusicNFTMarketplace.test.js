const { expect } = require("chai");

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("MusicNFTMarketplace", function () {

  let nftMarketplace
  let deployer, artist, user1, user2, users;
  let royaltyFee = toWei(0.01); // 1 ether = 10^18 wei
  let URI = "https://black-cheap-basilisk-940.mypinata.cloud/ipfs/QmViaVJDiujSMskXqaoARfCicCH8o4CgkR4MhNqcZvc5ni/"
  let prices = [toWei(1), toWei(2), toWei(3), toWei(4), toWei(5), toWei(6), toWei(7), toWei(8)]
  let deploymentFees = toWei(prices.length * 0.01)
  let mintfee = toWei(0.01)
  
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const NFTMarketplaceFactory = await ethers.getContractFactory("MusicNFTMarketplace");
    [deployer, artist, user1, user2, ...users] = await ethers.getSigners();

    // Deploy music nft marketplace contract 
    nftMarketplace = await NFTMarketplaceFactory.deploy(
      royaltyFee,
      artist.address,
      prices,
      mintfee,
      { value: deploymentFees }
    );

  });

  describe("Deployment", function () {

    it("Should track name, symbol, URI, royalty fee and artist", async function () {
      const nftName = "MELO"
      const nftSymbol = "MAPP"
      expect(await nftMarketplace.name()).to.equal(nftName);
      expect(await nftMarketplace.symbol()).to.equal(nftSymbol);
      expect(await nftMarketplace.baseURI()).to.equal(URI);
      expect(await nftMarketplace.royaltyFee()).to.equal(royaltyFee);
      expect(await nftMarketplace.artist()).to.equal(artist.address);
    });

    it("Should mint then list all the music nfts", async function () {
      expect(await nftMarketplace.balanceOf(nftMarketplace.address)).to.equal(8);
      // Get each item from the marketItems array then check fields to ensure they are correct
      await Promise.all(prices.map(async (i, indx) => {
        const item = await nftMarketplace.marketItems(indx)
        expect(item.tokenId).to.equal(indx)
        expect(item.seller).to.equal(deployer.address)
        expect(item.price).to.equal(i)
      }))
    });
    it("Ether balance should equal deployment fees", async function () {
      expect(await ethers.provider.getBalance(nftMarketplace.address)).to.equal(deploymentFees)
    });

  });

  describe("Updating royalty fee", function () {

    it("Only deployer should be able to update royalty fee", async function () {
      const fee = toWei(0.02)
      await nftMarketplace.updateRoyaltyFee(fee)
      await expect(
        nftMarketplace.connect(user1).updateRoyaltyFee(fee)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      expect(await nftMarketplace.royaltyFee()).to.equal(fee)
    });

  });
  describe("Buying tokens", function () {
    it("Should update seller to zero address, transfer NFT, pay seller, pay royalty to artist and emit a MarketItemBought event", async function () {
      const deployerInitalEthBal = await deployer.getBalance()
      const artistInitialEthBal = await artist.getBalance()
      // user1 purchases item.
      await expect(nftMarketplace.connect(user1).buyToken(0, { value: prices[0] }))
        .to.emit(nftMarketplace, "MarketItemBought")
        .withArgs(
          0,
          deployer.address,
          user1.address,
          prices[0]
        )
      const deployerFinalEthBal = await deployer.getBalance()
      const artistFinalEthBal = await artist.getBalance()
      // Item seller should be zero addr
      expect((await nftMarketplace.marketItems(0)).seller).to.equal("0x0000000000000000000000000000000000000000")
      // Seller should receive payment for the price of the NFT sold.
      expect(+fromWei(deployerFinalEthBal)).to.equal(+fromWei(prices[0]) + +fromWei(deployerInitalEthBal))
      // Artist should receive royalty
      expect(+fromWei(artistFinalEthBal)).to.equal(+fromWei(royaltyFee) + +fromWei(artistInitialEthBal))
      // The buyer should now own the nft
      expect(await nftMarketplace.ownerOf(0)).to.equal(user1.address);
    });
    it("Should fail when ether amount sent with transaction does not equal asking price", async function () {
      // Fails when ether sent does not equal asking price
      await expect(
        nftMarketplace.connect(user1).buyToken(0, { value: prices[1] })
      ).to.be.revertedWith("Please send the asking price in order to complete the purchase");
    });
    it("Should fail when the owner itself tries to buy his resold token", async function(){
        // user1 purchases an item.
        await nftMarketplace.connect(user1).buyToken(0, { value: prices[0] });
        // user1 resells the item
        await nftMarketplace.connect(user1).resellToken(0, toWei(1.2), { value: royaltyFee });
        //user1 tries to buy the same item
        await expect (
          nftMarketplace.connect(user1).buyToken(0, { value: toWei(1.2)})
        ).to.be.revertedWith("The person who relisted the item cannot buy it back");
    });
  })
  describe("Reselling tokens", function () {
    beforeEach(async function () {
      // user1 purchases an item.
      await nftMarketplace.connect(user1).buyToken(1, { value: prices[1] });
    })

    it("Should track resale item, incr. ether bal by royalty fee, transfer NFT to marketplace and emit MarketItemRelisted event", async function () {
      const resaleprice = toWei(2.5)
      const initMarketBal = await ethers.provider.getBalance(nftMarketplace.address)
      // user1 lists the nft for a price of 2 hoping to flip it and double their money
      await expect(nftMarketplace.connect(user1).resellToken(1, resaleprice, { value: royaltyFee }))
        .to.emit(nftMarketplace, "MarketItemRelisted")
        .withArgs(
          1,
          user1.address,
          resaleprice
        )
      const finalMarketBal = await ethers.provider.getBalance(nftMarketplace.address)
      // Expect final market bal to equal inital + royalty fee
      expect(+fromWei(finalMarketBal)).to.equal(+fromWei(royaltyFee) + +fromWei(initMarketBal))
      // Owner of NFT should now be the marketplace
      expect(await nftMarketplace.ownerOf(1)).to.equal(nftMarketplace.address);
      // Get item from items mapping then check fields to ensure they are correct
      const item = await nftMarketplace.marketItems(1)
      expect(item.tokenId).to.equal(1)
      expect(item.seller).to.equal(user1.address)
      expect(item.price).to.equal(resaleprice)
    });

    it("Should fail if price is set to zero, royalty fee is not paid and if new price is more than 1.5 times", async function () {
      await expect(
        nftMarketplace.connect(user1).resellToken(1, 0, { value: royaltyFee })
      ).to.be.revertedWith("Price must be greater than zero");
      await expect(
        nftMarketplace.connect(user1).resellToken(1, toWei(1), { value: 0 })
      ).to.be.revertedWith("Must pay royalty");
      await expect(
        nftMarketplace.connect(user1).resellToken(1, toWei(4), { value: royaltyFee })
      ).to.be.revertedWith("Price must be lesser than 1.5 times of original price");
    });
  });

  describe("Getter functions", function () {
    let soldItems = [0, 1, 4]
    let ownedByUser1 = [0, 1]
    let ownedByUser2 = [4]
    beforeEach(async function () {
      // user1 purchases item 0.
      await (await nftMarketplace.connect(user1).buyToken(0, { value: prices[0] })).wait();
      // user1 purchases item 1.
      await (await nftMarketplace.connect(user1).buyToken(1, { value: prices[1] })).wait();
      // user2 purchases item 4.
      await (await nftMarketplace.connect(user2).buyToken(4, { value: prices[4] })).wait();
    })

    it("getAllUnsoldTokens should fetch all the marketplace items up for sale", async function () {
      const unsoldItems = await nftMarketplace.getAllUnsoldTokens()
      // Check to make sure that all the returned unsoldItems have filtered out the sold items.
      expect(unsoldItems.every(i => !soldItems.some(j => j === i.tokenId.toNumber()))).to.equal(true)
      // Check that the length is correct
      expect(unsoldItems.length === prices.length - soldItems.length).to.equal(true)
    });
    it("getMyTokens should fetch all tokens the user owns", async function () {
      // Get items owned by user1
      let myItems = await nftMarketplace.connect(user1).getMyTokens()
      // Check that the returned my items array is correct
      expect(myItems.every(i => ownedByUser1.some(j => j === i.tokenId.toNumber()))).to.equal(true)
      expect(ownedByUser1.length === myItems.length).to.equal(true)
      // Get items owned by user2
      myItems = await nftMarketplace.connect(user2).getMyTokens()
      // Check that the returned my items array is correct
      expect(myItems.every(i => ownedByUser2.some(j => j === i.tokenId.toNumber()))).to.equal(true)
      expect(ownedByUser2.length === myItems.length).to.equal(true)
    });
  });

  describe("mintNFT", function () {
    it("should mint a new NFT, store data, and list it for sale", async function () {
      const mintfee = toWei(0.01);
      const listingPrice = toWei(1);

      // Connect signer1 to the contract
      const marketplaceWithSigner1 = nftMarketplace.connect(user1);

      // Mint an NFT with listing price from signer1
      await marketplaceWithSigner1.mintNFT("Some NFT data", listingPrice, {value : mintfee});

      // Get the total supply
      const totalSupply = await nftMarketplace.getTotalSupply();

      // Check if the new NFT is listed for sale with the correct price
      const marketItem = await nftMarketplace.marketItems(totalSupply.sub(1));
      expect(marketItem.tokenId).to.equal(totalSupply.sub(1));
      expect(marketItem.seller).to.equal(user1.address);
      expect(marketItem.price).to.equal(listingPrice);

      // Check if the NFT data is stored correctly
      const nftData = await nftMarketplace.nftData(totalSupply.sub(1));
      expect(nftData).to.equal("Some NFT data");
    });
    it("should revert if minting fee is insufficient", async function () {
      const marketplaceWithSigner1 = nftMarketplace.connect(user1);
      const mintfee = toWei(0.001);
      const listingPrice = toWei(1);

      // Attempting to mint an NFT with insufficient funds
      try {
        await marketplaceWithSigner1.mintNFT("Some NFT data", listingPrice , { value: mintfee });
        assert.fail("Minting should revert with insufficient funds");
      } catch (error) {
        expect(error.message).to.include("Insufficient funds for minting", "Error message should indicate insufficient funds");
      }
    });
  });

 })