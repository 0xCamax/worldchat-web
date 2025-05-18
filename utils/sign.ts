import { ethers } from "npm:ethers";

export async function withSignature(
  signer: ethers.Signer,
  data: string,
): Promise<string> {
  const hash = ethers.keccak256(data);
  const ethSignedPacked = ethers.solidityPacked(
    ["string", "bytes32"],
    ["\x19Ethereum Signed Message:\n32", hash],
  );
  const ethSignedHash = ethers.keccak256(ethSignedPacked);
  const signature = await signer.signMessage(ethers.getBytes(ethSignedHash));

  return data + signature.slice(2);
}