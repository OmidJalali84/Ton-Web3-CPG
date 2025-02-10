import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { CHAIN } from "@tonconnect/protocol";
import { beginCell, storeMessage, TonClient } from "@ton/ton";
import { Cell } from "tonweb";
import TonWeb from "tonweb";

export function Options({ options }) {
  const [tonConnectUi] = useTonConnectUI();
  const wallet = useTonWallet();

  const { utils } = TonWeb;

  // Create Client
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  });

  async function buyOption(price) {
    const defaultT = {
      // The transaction is valid for 10 minutes from now, in unix epoch seconds.
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        {
          // The receiver's address.
          address: "UQBYl66SqBmKF9REMPJ75U3y8VdUM628MEtsTMfFhSGXCcf-",
          // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
          amount: `${price * 1e9}`,
          // (optional) State initialization in boc base64 format.
          stateInit:
            "te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==",
          // (optional) Payload in boc base64 format.
          payload: "te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==",
        },
      ],
    };

    try {
      if (wallet) {
        if (wallet.account.chain != -239) {
          alert("Must be in Mainnet");
        } else {
          const result = await tonConnectUi.sendTransaction(defaultT);
          alert(result);

          // const cell = Cell.fromBoc(`${result.boc}`);
          // // Calculate the hash of the BOC
          // const bocHash = utils.bytesToHex(cell.hash());
          // console.log("BOC Hash:", bocHash);

          const state = await client.getContractState(wallet.account.address);
          const { lt: lastLt, hash: lastHash } = state.lastTransaction;
          const lastTx = await client.getTransaction(
            wallet.account.address,
            lastLt,
            lastHash
          );
          console.log(lastTx);

          const msgCell = beginCell()
            .store(storeMessage(lastTx.inMessage))
            .endCell();
          const inMsgHash = msgCell.hash().toString("base64");
          console.log("InMsgHash", inMsgHash);
        }
      } else {
        alert("First, connect a wallet");
      }
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <div className="option-container">
      {options.map((option, index) => (
        <div className="option-box" onClick={() => buyOption(option.price)}>
          <div key={index}>
            <h2>{option.title}</h2>
            <p>Price: {option.price} Ton</p>
            {option.activation ? (
              <h3 className="active">Active</h3>
            ) : (
              <h3 className="inactive">inactive</h3>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
