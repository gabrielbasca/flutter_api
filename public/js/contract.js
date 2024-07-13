const contractAddress = "0x9cb7b9A6fbb69Fd20b6A921866ADf2F05D1B9502";
const contractABI = [
    "function setExpirationDate(uint256 _newDate) public",
    "function getExpirationDate() public view returns (uint256)",
    "function isInsuranceExpired() public view returns (bool)"
];

let contract;
let signer;

const connectButton = document.getElementById('connectButton');
const setDateButton = document.getElementById('setDateButton');
const getDateButton = document.getElementById('getDateButton');
const checkExpiredButton = document.getElementById('checkExpiredButton');
const contractInteraction = document.getElementById('contractInteraction');

connectButton.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            contractInteraction.style.display = 'block';
            connectButton.textContent = 'Connected';
        } catch (error) {
            console.error("User rejected the connection request");
        }
    } else {
        console.log('MetaMask is not installed');
    }
});

setDateButton.addEventListener('click', async () => {
    const date = new Date(document.getElementById('expirationDate').value);
    const timestamp = Math.floor(date.getTime() / 1000);
    try {
        const tx = await contract.setExpirationDate(timestamp);
        await tx.wait();
        alert("Expiration date set successfully!");
    } catch (error) {
        console.error("Error setting date:", error);
    }
});

getDateButton.addEventListener('click', async () => {
    try {
        const timestamp = await contract.getExpirationDate();
        const date = new Date(timestamp * 1000);
        document.getElementById('currentDate').textContent = date.toLocaleDateString();
    } catch (error) {
        console.error("Error getting date:", error);
    }
});

checkExpiredButton.addEventListener('click', async () => {
    try {
        const expired = await contract.isInsuranceExpired();
        document.getElementById('isExpired').textContent = expired ? "Expired" : "Not Expired";
    } catch (error) {
        console.error("Error checking expiration:", error);
    }
});