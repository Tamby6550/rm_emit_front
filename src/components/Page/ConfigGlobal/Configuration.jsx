import CryptoJS from 'crypto-js';


export  const decrypt = () => {
    const secret= "tamby6550";
    const virus = localStorage.getItem("virus");
    const token = localStorage.getItem("token");
    const decryptedData = CryptoJS.AES.decrypt(virus, secret);
    const dataString = decryptedData.toString(CryptoJS.enc.Utf8);
    const data = JSON.parse(dataString);
    return { data, token };
}