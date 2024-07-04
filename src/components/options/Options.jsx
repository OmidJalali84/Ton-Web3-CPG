import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export function Options({ options }) {
  const [tonConnectUi] = useTonConnectUI();
  const wallet = useTonWallet();

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
      const result = await tonConnectUi.sendTransaction(defaultT);
      console.log(result.status);
      console.log(result.amount);
    } catch (e) {
      alert(e);
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
